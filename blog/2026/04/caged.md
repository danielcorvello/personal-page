---
slug: caged
title: "CAGED e médias salariais"
authors: ["corvello"]
date: 2026-04-24
tags: ["caged", "sqlserver"]
draft: false
toc_max_heading_level: 3
image: /img/blog/caged/og-caged.png
---

# CAGED e médias salariais

Tive contato com o `CAGED` (Cadastro Geral de Empregados e Desempregados) pela primeira vez há cerca de 5 anos, quando estava investigando algumas maneiras para criar uma solução que devolvesse um índice de atratividade de uma determinada vaga, e um dos parâmetros que eu queria utilizar era o salário médio da função pago na região onde a vaga estava localizada. Encontrei alguns sites que ofereciam esse tipo de informação, mas a maioria deles era paga, e os dados não eram tão atualizados. Foi então que descobri o "tal" do `CAGED`, e fiquei impressionado com a quantidade de informações que ele disponibilizava gratuitamente. Estava muito além do que eu precisava para cumprir meu objetivo inicial. Desde então, sempre que preciso de dados sobre o mercado de trabalho, o `CAGED` é uma das minhas primeiras fontes de consulta. 

Neste artigo iremos explorar um pouco sobre os dados disponibilizados pelo `CAGED`, e como podemos utilizá-los para obter insights sobre as médias salariais em diferentes regiões e setores do mercado de trabalho. Vamos analisar como podemos obter os dados de admissões e desligamentos conforme o tempo, além de discutir outras possibilidades. Se você é um profissional de recursos humanos, um pesquisador ou simplesmente alguém interessado em entender melhor o mercado de trabalho, este artigo pode ser uma leitura interessante para você.

{/* truncate */}

## Sobre o CAGED

A base de microdados do CAGED é um conjunto de dados mantido pelo Ministério do Trabalho e Emprego (MTE) do Brasil, através do programa [PDET](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet), que reúne informações sobre os vínculos empregatícios formais no país. Ele é atualizado mensalmente e contém dados sobre admissões e desligamentos de trabalhadores registrados em carteira. Esses dados, podem ser utilizados como uma ferramenta para o acompanhamento do mercado de trabalho, permitindo análises sobre a evolução do emprego, setores mais dinâmicos, regiões com maior geração de empregos, entre outros aspectos para a economia, a sociedade, negócios e pesquisa. 

Em 2020, o _CAGED_ passou por uma reformulação (ficou conhecido a partir desta data como __NOVO CAGED__) com a implementação de um novo sistema de coleta e processamento de dados, utilizando o nosso queridinho `e-Social`. 

O MTE [divulga](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged) os dados consolidados mês a mês, permitindo que pesquisadores, analistas e o público em geral tenham acesso a informações atualizadas sobre o mercado de trabalho brasileiro. Entre as informações divulgadas pelo _CAGED_, estão o número de admissões e desligamentos, a média salarial dos trabalhadores, a distribuição por setor econômico, a localização geográfica dos empregos, entre outros dados para entender as dinâmicas do mercado de trabalho no país. Todos esses dados podem ser encontrados do site oficial do Ministério do Trabalho e Emprego, na [seção dedicada ao _Novo CAGED_](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged) e no [Painel de Informações do Novo CAGED](https://app.powerbi.com/view?r=eyJrIjoiNWI5NWI0ODEtYmZiYy00Mjg3LTkzNWUtY2UyYjIwMDE1YWI2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9&pageName=ReportSectionb52b07ec3b5f3ac6c749).

Apesar de existir uma divulgação rica de detalhes por parte do MTE, podemos extrair muito mais dos dados `brutos`, porém, os dados do _CAGED_ não são tão fáceis de serem manipulados, principalmente para quem não tem experiência com análise de dados. Os arquivos disponibilizados estão em formato `.csv`, e cada arquivo contém uma grande quantidade de informações, o que pode ser um desafio para quem deseja extrair insights específicos.

Todo mês os dados são disponibilizados no [ftp do MTE](ftp://ftp.mtps.gov.br/pdet/microdados/NOVO%20CAGED/) em diretórios separados por mês e ano. Cada diretório contém arquivos `.7z` que, quando descompactados, revelam arquivos `.txt` com os dados das movimentações. Os três arquivos disponibilizados mensalmente são:

### CAGEDMOV[YYYYMM]
Contêm os dados das movimentações (admissões e desligamentos) de trabalhadores registrados em carteira da competência (mês) correspondente. Cada linha do arquivo representa uma movimentação, e as colunas contêm informações como o tipo de movimentação (admissão ou desligamento), o salário do trabalhador, a data da movimentação, entre outros dados relevantes.

__Layout dos Microdados Não-Identificados do Novo CAGED - Base de Movimentações__
| Variável | Descrição | Código |
|---|---|---|
|competênciamov | Competência da movimentação (anteriormente competência) | &lt;AAAAMM&gt; |
|região | Região geográfica de acordo com o código do IBGE | &lt;99&gt; |
|uf | Unidade da federação de acordo com o código do IBGE | &lt;99&gt; |
|município | Código do Município | &lt;999999&gt; |
|seção | Código da seção da classificação nacional de atividade econômica (CNAE 2.0) | &lt;N&gt; |
|subclasse | Código da subclasse da classificação nacional de atividade econômica (CNAE 2.0) | &lt;9999999&gt; |
|saldomovimentação | Valor da movimentação em termos de saldo | &lt;99&gt; |
|categoria | Categoria de trabalhador | &lt;999&gt; |
|cbo2002ocupação | Código da ocupação do trabalhador de acordo com a Classificação Brasileira de Ocupações (CBO 2002) | &lt;999999&gt; |
|graudeinstrução | Grau de instrução do trabalhador | &lt;99&gt; |
|idade | Idade do trabalhador | &lt;999&gt; |
|horascontratuais | Horas contratuais semanais | &lt;99&gt; |
|raçacor | Raça ou cor do trabalhador | &lt;9&gt; |
|sexo | Sexo do trabalhador | &lt;9&gt; |
|tipoempregador | Tipo de empregador | &lt;9&gt; |
|tipoestabelecimento | Tipo de estabelecimento | &lt;9&gt; |
|tipomovimentação | Tipo de movimentação | &lt;99&gt; |
|tipodedeficiência | Tipo de deficiência do trabalhador | &lt;9&gt; |
|indtrabintermitente | Indicador de trabalhador intermitente | &lt;9&gt; |
|indtrabparcial | Indicador de trabalhador parcial | &lt;9&gt; |
|salário | Salário mensal declarado | &lt;999999999,99&gt; |
|tamestabjan | Faixa de Emprego no início de Janeiro do Estabelecimento | &lt;99&gt; |
|indicadoraprendiz | Indicador de trabalhador aprendiz | &lt;9&gt; |
|origemdainformação | Origem da informação da movimentação | &lt;9&gt; |
|competênciadec | Competência da declaração | &lt;AAAAMM&gt; |
|competênciaexc | Competência da exclusão | &lt;AAAAMM&gt; |
|indicadordeexclusão | Indicador de Exclusão | &lt;9&gt; |
|indicadordeforadoprazo | Indicador de informação declarada fora do prazo | &lt;9&gt; |
|unidadesaláriocódigo | Unidade de pagamento da parte fixa da remuneração | &lt;99&gt; |
|valorsaláriofixo | Salário base do trabalhador, correspondente à parte fixa da remuneração | &lt;999999999,99&gt; |

### CAGEDFOR[YYYYMM]
Contêm os dados das movimentações de trabalhadores que foram declarados como "fora do prazo" pelos empregadores. A estrutura desses arquivos é semelhante à dos arquivos `CAGEDMOV`, mas eles incluem um indicador específico para identificar as movimentações que foram declaradas fora do prazo. 

### CAGEDEXC[YYYYMM]
E por fim, os arquivos `CAGEDEXC` contêm os dados das movimentações de trabalhadores que foram declarados como "excluídos" pelos empregadores. Assim como os arquivos `CAGEDFOR`, eles possuem um indicador específico para identificar as movimentações que foram declaradas como excluídas.

## Tamanho dos arquivos
Os arquivos do _CAGED_ podem ser bastante grandes, dependendo do mês e do ano. A média de registros do arquivo principal (`CAGEDMOV`) é de aproximadamente 4.2 milhões de linhas por mês, levando em consideração os dados do último ano (ver tabela abaixo), o que pode resultar em arquivos com tamanhos que variam de 400 MB a 500 MB ou mais. Já os arquivos `CAGEDFOR` e `CAGEDEXC` tendem a ser menores, mas ainda assim podem conter alguns poucos milhares de registros. Devido ao tamanho dos arquivos, é importante utilizar ferramentas adequadas para processar e analisar os dados, como bancos de dados relacionais, ferramentas de análise de dados ou linguagens de programação com bibliotecas específicas para manipulação de grandes volumes de dados.

Eu, particularmente, gosto de manter a base atualizada em um banco de dados relacional, o que me permite realizar consultas complexas e obter insights de forma mais eficiente. Além disso, o uso de ferramentas de visualização de dados pode ajudar a identificar tendências e padrões nos dados do _CAGED_, facilitando a compreensão das dinâmicas do mercado de trabalho.

| Competência | Número de Registros |
|---|---|
| 202602 | 4508213 |
| 202601 | 4303726 |
| 202512 | 3664782 |
| 202511 | 3873940 |
| 202510 | 4457773 |
| 202509 | 4371982 |
| 202508 | 4332432 |
| 202507 | 4373105 |
| 202506 | 4111743 |
| 202505 | 4363458 |
| 202504 | 4306846 |
| 202503 | 4397748 |

<small>Fonte: Dados do CAGED</small>

## Modelagem dos dados

Ao baixar os dados do _CAGED_, é importante ler a documentação disponível, entender o layout dos arquivos e planejar a modelagem da base de dados para armazenar essas informações. A modelagem pode variar dependendo das necessidades específicas de análise, mas geralmente envolve a criação de tabelas para armazenar os dados das movimentações, informações sobre os municípios, estados, setores econômicos, ocupações, entre outros. 

Após um estudo inicial dos dados, optei por criar uma modelagem relacional que inclui tabelas para `Registros` (movimentações), `CBO` (Classificação Brasileira de Ocupações), `Municipios`, `Estados`, e outras várias tabelas auxiliares para armazenar as informações adicionais. Se o intuito dessa base fosse ser utilizado somente por Sistemas eu não teria criado muitas dessas tabelas e utilizaria `enums` no lugar, mas, como estou utlizando também para consultas diretas, optei por deixar esses dados em tabelas relacionadas para evitar o uso de `CASE X THEN Y` nas consultas. Dessa forma, a estrutura criada está servindo bem aos propósitos de análise e consulta dos dados e utilização em sistemas de apoio à decisão, como dashboards e relatórios.

<div class="img-center">![Modelagem da base de dados CAGED](/img/blog/caged/modelagem-novo-caged.png)</div>
<small>Fonte: Arquivo pessoal</small>


## Análise dos Dados
Ao analisar os dados do _CAGED_, observamos algumas tendências interessantes. Por exemplo, é possível identificar quais setores da economia estão gerando mais empregos, quais regiões do país estão se destacando em termos de contratações, e como as médias salariais estão evoluindo ao longo do tempo. Além disso, podemos comparar os dados de admissões e desligamentos para entender melhor a dinâmica do mercado de trabalho, identificando períodos de crescimento ou retração econômica.

Vou trazer aqui algumas consultas que realizo periodicamente para obter insights sobre as médias salariais, utilizando o SQL como exemplo. 

:::info
Todas as consultas a seguir são executadas contra um banco de dados relacional (SQL Server) onde os dados já foram importados e organizados em tabelas correspondentes aos arquivos do _CAGED_.
:::

### Média salarial por CBO e estado

```sql
/*
2524-05 - Analista de recursos humanos
35 - Código do estado de São Paulo
Competências de setembro de 2025 a fevereiro de 2026
*/

-- Consulta para obter a média salarial por cbo e estado

WITH percentiles as (
	SELECT 
		r.CBO, 
		r.EstadoId,
		r.MunicipioId, 
		r.SaldoMovimentacao,
		CAST(AVG(r.Salario) OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) AS FLOAT) [MediaSalarial],
		AVG(r.HorasContratuais) OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [MediaHoras],
		PERCENTILE_CONT(0) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_0],
		PERCENTILE_CONT(0.01) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_001],
		PERCENTILE_CONT(0.025) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_0025],
		PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_025],
		PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_050],
		PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_075],
		PERCENTILE_CONT(0.975) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_0975],
		PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_099],
		PERCENTILE_CONT(1) WITHIN GROUP (ORDER BY r.Salario) 
			OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Percentil_1],
		COUNT(*) OVER (PARTITION BY r.CBO, r.EstadoId, r.SaldoMovimentacao) [Amostragem]
	FROM Registros r
	WHERE 
		r.Competencia BETWEEN '202509' AND '202602' AND
		r.Exclusao IS NULL AND
		r.TrabalhoIntermitente <> 1 AND
		r.Salario BETWEEN (1518 * 0.3) AND (1518 * 100) AND
		r.CBO IN ('252405') AND
		r.EstadoId IN (35)
)

SELECT 
	m.UF,
	CASE r.SaldoMovimentacao 
		WHEN -1 THEN 'Desligamento' 
		ELSE 'Admissão' 
	END											 [Movimentação],
	FORMAT(MAX(r.MediaSalarial),	'N2', 'pt-BR') [Media],
	FORMAT(MAX(r.Percentil_0),	'N2', 'pt-BR') [Perc 0],
	FORMAT(MAX(r.Percentil_001),	'N2', 'pt-BR') [Perc 0.01],
	FORMAT(MAX(r.Percentil_0025),	'N2', 'pt-BR') [Perc 0.025],
	FORMAT(MAX(r.Percentil_025),	'N2', 'pt-BR') [Perc 0.25],
	FORMAT(MAX(r.Percentil_050),	'N2', 'pt-BR') [Perc 0.5],
	FORMAT(MAX(r.Percentil_075),	'N2', 'pt-BR') [Perc 0.75],
	FORMAT(MAX(r.Percentil_0975),	'N2', 'pt-BR') [Perc 0.975],
	FORMAT(MAX(r.Percentil_099),	'N2', 'pt-BR') [Perc 0.99],
	FORMAT(MAX(r.Percentil_1),	'N2', 'pt-BR') [Perc 1.00],
	MAX(r.Amostragem)			       [Amostragem]
FROM percentiles r
	JOIN CBO cbo ON r.CBO = cbo.CBO
	JOIN Municipios m ON m.MunicipioId = r.MunicipioId
GROUP BY r.SaldoMovimentacao, m.UF
ORDER BY m.Uf, r.SaldoMovimentacao

```

O retorno dessa consulta nos fornece a média salarial, os percentis e a amostragem para as movimentações de admissão e desligamento de analistas de recursos humanos no estado de São Paulo, considerando os dados dos últimos 6 meses. Com essas informações, podemos analisar as diferenças salariais entre admissões e desligamentos, identificar tendências e tomar decisões informadas sobre o mercado de trabalho para essa ocupação específica.

|                | Admissão     | Desligamento  |
|----------------|--------------|---------------|
| Média salarial | R$ 4.839,95  | R$ 4.767,05   |
| Perc 0	     | R$ 820,00    | R$ 820,00     |
| Perc 0.01	     | R$ 1.835,00  | R$ 1.817,57   |
| Perc 0.025     | R$ 2.031,71  | R$ 2.000,00   |
| Perc 0.25	     | R$ 3.150,00  | R$ 3.096,47   |
| Perc 0.5	     | R$ 4.000,50  | R$ 4.000,00   |
| Perc 0.75	     | R$ 5.565,00  | R$ 5.500,00   |
| Perc 0.975     | R$ 12.504,06 | R$ 12.000,11  |
| Perc 0.99	     | R$ 15.190,09 | R$ 15.000,00  |
| Perc 1.00	     | R$ 40.860,67 | R$ 52.531,00  |
| Amostragem     | 12.698       | 12.320        |

### Média salarial por ocupação

Com a mesma lógica, podemos realizar consultas semelhantes para outras ocupações, regiões ou períodos, e, se necessário, criar novos agrupamentos, como por exemplo por cidades e até mesmo retornar um conjunto com as médias de todos os estados do país. As possibilidades são inúmeras, e a riqueza dos dados do _CAGED_ nos permite explorar diversas facetas do mercado de trabalho brasileiro, fornecendo insights valiosos para profissionais de recursos humanos, pesquisadores, formuladores de políticas públicas e qualquer pessoa interessada em entender melhor as dinâmicas do emprego no país.

Por exemplo, na consulta anterior, removendo o filtro de estado e agrupando por estado, podemos obter as médias salariais para __analistas de recursos humanos__ em todos os estados do país, o que nos permite comparar as diferenças regionais e identificar quais estados estão oferecendo salários mais competitivos para essa ocupação.

| UF |	Movimentação |	Media |	Perc 0 | Perc 0.01 | Perc 0.025 | Perc 0.25 | Perc 0.5 | Perc 0.75 | Perc 0.975 | Perc 0.99 | Perc 1.00  | Amostragem |
|----|---------------|--------|--------|-----------|-------------|----------|----------|-----------|------------|-----------|------------|------------|
| AC | Desligamento  | 2.364,93 | 1.090,91 | 1.206,64 | 1.380,23 | 2.000,00 | 2.000,00 | 2.535,75 | 3.854,44 | 3.986,05 | 4.073,79 | 20 |
| AC | Admissão      | 2.059,18 | 1.090,91 | 1.129,35 | 1.187,01 | 1.543,75 | 1.975,00 | 2.450,00 | 3.182,78 | 3.249,46 | 3.293,91 | 10 |
| AL | Desligamento  | 3.007,22 | 1.600,00 | 1.621,00 | 1.657,41 | 2.260,22 | 2.923,60 | 3.394,25 | 5.365,79 | 7.413,09 | 9.140,73 | 106 |
| AL | Admissão      | 3.065,16 | 1.518,00 | 1.621,00 | 1.672,49 | 2.300,00 | 3.000,00 | 3.372,28 | 5.970,83 | 9.412,73 | 10.000,00 | 104 |
| AM | Desligamento | 3.833,28 | 810,50 | 1.616,80 | 1.751,69 | 2.650,00 | 3.344,00 | 4.514,04 | 7.832,05 | 9.950,23 | 15.450,00 | 385 |
| AM | Admissão | 3.841,03 | 1.265,00 | 1.600,00 | 1.800,00 | 2.683,08 | 3.343,36 | 4.626,12 | 8.240,92 | 9.135,00 | 16.000,00 | 374 |
| AP | Desligamento | 2.706,99 | 1.580,02 | 1.619,61 | 1.679,00 | 2.000,00 | 2.600,00 | 3.313,50 | 4.187,17 | 4.673,06 | 4.996,98 | 34 |
| AP | Admissão | 3.192,46 | 900,00 | 1.156,00 | 1.540,00 | 2.000,00 | 2.482,76 | 3.847,80 | 8.959,82 | 10.663,39 | 11.799,10 | 33 |
| BA | Desligamento | 3.791,51 | 1.518,00 | 1.608,82 | 1.675,99 | 2.500,00 | 3.159,44 | 4.099,80 | 9.762,20 | 13.984,78 | 26.977,37 | 614 |
| BA | Admissão | 3.513,13 | 759,00 | 1.518,00 | 1.605,18 | 2.500,00 | 3.100,00 | 4.000,00 | 8.000,00 | 11.000,00 | 21.008,00 | 667 |
| CE | Desligamento | 3.472,93 | 759,00 | 1.518,00 | 1.588,27 | 2.170,00 | 3.022,20 | 4.045,97 | 9.001,23 | 10.074,23 | 17.856,62 | 701 |
| CE | Admissão | 3.296,04 | 770,00 | 1.518,00 | 1.575,45 | 2.300,00 | 3.000,00 | 3.770,91 | 7.622,85 | 9.451,18 | 19.500,00 | 588 |
| DF | Desligamento | 4.418,97 | 1.302,00 | 1.521,00 | 1.622,56 | 2.842,80 | 3.500,00 | 5.078,95 | 9.802,43 | 14.800,00 | 29.066,45 | 444 |
| DF | Admissão | 5.392,96 | 1.518,00 | 1.566,24 | 1.650,00 | 3.000,00 | 4.000,00 | 8.000,00 | 14.800,00 | 14.800,00 | 39.160,01 | 518 |
| ES | Desligamento | 4.006,89 | 994,38 | 1.845,80 | 1.999,75 | 3.000,00 | 3.600,00 | 4.327,92 | 8.977,14 | 12.537,76 | 22.710,00 | 439 |
| ES | Admissão | 3.847,20 | 1.537,00 | 1.750,00 | 2.000,00 | 3.000,00 | 3.500,00 | 4.200,00 | 8.410,00 | 10.646,98 | 17.000,00 | 419 |
| GO | Desligamento | 3.690,23 | 1.210,40 | 1.598,95 | 1.635,87 | 2.600,00 | 3.288,27 | 4.252,42 | 7.814,79 | 9.312,83 | 14.569,48 | 816 |
| GO | Admissão | 3.678,26 | 996,90 | 1.518,63 | 1.621,00 | 2.600,00 | 3.344,81 | 4.400,00 | 7.814,79 | 9.985,12 | 26.000,00 | 808 |
| MA | Desligamento | 3.331,17 | 1.518,00 | 1.518,00 | 1.618,09 | 2.381,82 | 3.000,00 | 3.751,27 | 7.800,60 | 8.782,02 | 9.462,00 | 189 |
| MA | Admissão | 3.387,04 | 1.525,00 | 1.598,96 | 1.621,00 | 2.253,50 | 3.000,00 | 3.678,45 | 7.829,88 | 10.803,85 | 11.799,10 | 184 |
| MG | Desligamento | 4.083,36 | 497,00 | 1.518,00 | 1.700,00 | 2.727,05 | 3.500,00 | 4.664,39 | 10.230,10 | 13.059,90 | 23.612,05 | 2277 |
| MG | Admissão | 3.984,48 | 599,95 | 1.621,00 | 1.794,58 | 2.800,00 | 3.500,00 | 4.500,00 | 9.517,39 | 11.983,93 | 18.500,00 | 2309 |
| MS | Desligamento | 3.667,97 | 1.000,00 | 1.518,00 | 1.644,30 | 2.636,30 | 3.250,00 | 4.302,14 | 7.822,48 | 9.725,41 | 13.123,00 | 267 |
| MS | Admissão | 3.772,00 | 1.000,00 | 1.549,30 | 1.728,55 | 2.575,00 | 3.324,25 | 4.500,00 | 8.974,12 | 10.792,32 | 13.794,00 | 223 |
| MT | Desligamento | 3.948,63 | 1.518,00 | 1.600,00 | 1.743,33 | 2.798,75 | 3.561,00 | 4.662,98 | 7.960,69 | 11.785,43 | 19.976,50 | 487 |
| MT | Admissão | 3.859,27 | 870,11 | 1.521,23 | 1.630,00 | 2.567,96 | 3.500,00 | 4.500,00 | 8.000,00 | 10.695,71 | 16.500,00 | 506 |
| PA | Desligamento | 3.637,14 | 1.518,00 | 1.520,97 | 1.621,00 | 2.500,00 | 3.093,20 | 4.000,00 | 9.072,05 | 11.500,71 | 18.225,07 | 307 |
| PA | Admissão | 3.705,90 | 1.518,00 | 1.519,46 | 1.621,00 | 2.500,00 | 3.175,57 | 4.018,50 | 8.500,00 | 13.501,22 | 17.700,00 | 300 |
| PB | Desligamento | 2.959,84 | 1.035,00 | 1.035,00 | 1.035,00 | 2.000,00 | 2.687,82 | 3.396,70 | 7.113,59 | 8.825,00 | 10.582,78 | 148 |
| PB | Admissão | 2.849,64 | 1.075,00 | 1.213,32 | 1.518,00 | 2.140,28 | 2.730,00 | 3.281,94 | 5.370,74 | 6.221,66 | 7.018,70 | 118 |
| PE | Desligamento | 3.489,63 | 810,50 | 1.536,80 | 1.661,42 | 2.475,38 | 3.062,90 | 3.881,77 | 9.305,22 | 10.984,01 | 24.341,92 | 522 |
| PE | Admissão | 3.410,52 | 1.200,00 | 1.523,79 | 1.680,99 | 2.500,00 | 3.000,00 | 3.700,00 | 8.350,54 | 10.227,18 | 15.500,00 | 527 |
| PI | Desligamento | 2.859,97 | 1.518,00 | 1.518,00 | 1.518,00 | 2.064,35 | 2.620,75 | 3.202,27 | 5.970,88 | 7.195,70 | 8.030,00 | 82 |
| PI | Admissão | 2.954,40 | 1.475,00 | 1.511,98 | 1.518,00 | 2.040,00 | 2.717,00 | 3.482,50 | 5.585,00 | 6.501,41 | 11.799,10 | 87 |
| PR | Desligamento | 4.039,17 | 668,78 | 1.687,42 | 1.966,76 | 3.000,00 | 3.548,08 | 4.522,05 | 9.517,00 | 11.755,58 | 18.000,00 | 2201 |
| PR | Admissão | 3.974,16 | 500,00 | 1.800,00 | 2.000,00 | 3.000,00 | 3.500,00 | 4.500,00 | 9.000,00 | 11.899,75 | 18.000,00 | 2016 |
| RJ | Desligamento | 4.469,61 | 1.000,00 | 1.650,00 | 1.800,00 | 2.800,00 | 3.589,00 | 5.181,63 | 11.465,91 | 14.375,71 | 41.139,73 | 1617 |
| RJ | Admissão | 4.441,28 | 816,00 | 1.670,50 | 1.800,00 | 2.800,00 | 3.500,00 | 5.000,00 | 12.000,00 | 15.877,00 | 25.000,00 | 1642 |
| RN | Desligamento | 2.799,60 | 1.518,00 | 1.518,00 | 1.525,78 | 2.110,33 | 2.700,00 | 3.128,74 | 5.140,78 | 6.678,97 | 6.856,89 | 164 |
| RN | Admissão | 2.810,56 | 1.523,00 | 1.553,50 | 1.578,13 | 2.285,82 | 2.510,00 | 3.056,00 | 4.985,15 | 6.204,88 | 9.276,30 | 136 |
| RO | Desligamento | 3.209,39 | 1.621,00 | 1.705,51 | 1.753,66 | 2.500,00 | 2.947,73 | 3.646,96 | 6.066,75 | 6.481,19 | 7.087,78 | 78 |
| RO | Admissão | 3.233,61 | 900,00 | 1.440,75 | 1.621,00 | 2.176,59 | 2.830,00 | 3.502,44 | 8.601,10 | 11.799,10 | 11.799,10 | 76 |
| RR | Desligamento | 2.838,22 | 1.143,00 | 1.221,75 | 1.339,88 | 2.037,88 | 2.914,05 | 3.515,39 | 4.632,50 | 4.853,00 | 5.000,00 | 22 |
| RR | Admissão | 3.911,96 | 1.518,00 | 1.538,04 | 1.568,09 | 2.152,80 | 3.000,00 | 6.167,32 | 7.638,91 | 8.963,27 | 9.846,17 | 25 |
| RS | Desligamento | 4.259,08 | 613,00 | 1.767,45 | 1.900,00 | 3.000,00 | 3.715,50 | 4.800,00 | 10.033,66 | 13.997,85 | 32.661,34 | 1392 |
| RS | Admissão | 4.132,82 | 894,52 | 1.836,27 | 1.906,80 | 3.000,00 | 3.626,25 | 4.800,00 | 9.000,00 | 12.512,00 | 18.000,00 | 1265 |
| SC | Desligamento | 4.244,81 | 1.135,50 | 1.853,55 | 2.058,75 | 3.100,00 | 3.884,73 | 4.903,69 | 8.567,05 | 11.075,63 | 20.071,01 | 1754 |
| SC | Admissão | 4.190,77 | 600,00 | 1.842,25 | 2.071,70 | 3.000,00 | 3.850,00 | 4.800,00 | 8.291,74 | 11.145,00 | 20.000,00 | 1672 |
| SE | Desligamento | 3.671,61 | 1.047,94 | 1.232,23 | 1.518,00 | 2.300,00 | 2.542,87 | 3.150,00 | 13.291,51 | 35.000,00 | 35.000,00 | 89 |
| SE | Admissão | 3.004,04 | 1.518,00 | 1.616,88 | 1.670,00 | 2.398,24 | 2.800,00 | 3.500,00 | 5.409,20 | 5.567,04 | 9.000,00 | 97 |
| SP | Desligamento | 4.839,95 | 820,00 | 1.835,00 | 2.031,71 | 3.150,00 | 4.000,50 | 5.565,00 | 12.504,07 | 15.190,10 | 40.860,67 | 12698 |
| SP | Admissão | 4.767,05 | 820,00 | 1.817,57 | 2.000,00 | 3.096,47 | 4.000,00 | 5.500,00 | 12.000,12 | 15.000,00 | 52.531,00 | 12320 |
| TO | Desligamento | 3.175,79 | 1.518,00 | 1.518,00 | 1.518,00 | 2.264,61 | 2.967,53 | 4.000,00 | 6.085,80 | 6.448,88 | 6.500,00 | 73 |
| TO | Admissão | 3.445,42 | 1.621,00 | 1.653,48 | 1.732,35 | 2.500,00 | 3.200,00 | 4.000,00 | 6.500,00 | 7.298,84 | 8.401,99 | 59 |

## Conclusão
O _CAGED_ é uma fonte de dados extremamente valiosa para entender as dinâmicas do mercado de trabalho brasileiro. Com a migração para o novo formato, os dados estão mais acessíveis e detalhados, permitindo análises mais profundas e insights mais precisos sobre as tendências de emprego, salários e movimentações no mercado de trabalho. A modelagem adequada dos dados e o uso de ferramentas de análise são essenciais para aproveitar ao máximo as informações disponíveis e tomar decisões informadas com base nesses dados. A análise dos dados do _CAGED_ pode fornecer informações valiosas para profissionais de recursos humanos, pesquisadores, formuladores de políticas públicas e qualquer pessoa interessada em entender melhor o mercado de trabalho no Brasil. 

Se você gostou do conteúdo, não hesite em compartilhar e contribuir. Até a próxima!

## Referências
- [Novo CAGED](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged)
- [Programa de Disseminação de Estatísticas do Trabalho (PDET)](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet)
- [Calendário de divulgação do novo CAGED](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged)
- [Dados do CAGED - FEV 2026](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged/2026/fevereiro/pagina-inicial)
- [Painel de Informações do Novo CAGED](https://app.powerbi.com/view?r=eyJrIjoiNWI5NWI0ODEtYmZiYy00Mjg3LTkzNWUtY2UyYjIwMDE1YWI2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9&pageName=ReportSectionb52b07ec3b5f3ac6c749)