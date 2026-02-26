---
slug: cnpj-alfanumerico-com-csharp
title: "CNPJ Alfanumérico com C#"
authors: ["corvello"]
date: 2026-02-26
tags: ["cnpj", "csharp"]
draft: false
toc_max_heading_level: 3
image: /img/blog/cnpj-alfanumerico/og-cnpj-alfanumerico.png
---

# CNPJ Alfanumérico com C#
Devido a escassez de números de CNPJ disponíveis, a Receita Federal do Brasil, em 2024, anunciou a introdução do CNPJ alfanumérico. Este novo formato de CNPJ utiliza uma combinação de letras e números, permitindo a expansão do número de registros disponíveis. A estimativa da RFB era de que a quantidade de números disponíveis no range númerico se esgotaria entre 4.5 e 6 anos, o que motivou a adoção do formato alfanumérico que será, segundo as previsões atuais, atribuído a partir de Julho de 2026.

Neste artigo, exploraremos como está estruturado o novo formato, como validar e gerar CNPJs alfanuméricos utilizando a linguagem de programação C# e os desafios relacionados com a mudança.
<!-- truncate -->

## Estrutura do CNPJ Alfanumérico
O formato do CNPJ alfanumérico é composto por 14 caracteres, onde os 8 primeiros caracteres, conhecidos como `cnpj básico`, podem ser alfanuméricos, seguidos por uma barra (`/`), os 4 caracteres seguintes, conhecidos como `nº de ordem`, também alfanuméricos, e por fim um hífen (`-`) seguido do dígito verificador (DV), que permanece numérico. A estrutura pode ser representada da seguinte forma:

```
AA.AAA.AAA/AAAA-DV
```

Onde:
- `AA.AAA.AAA`: CNPJ básico (8 caracteres alfanuméricos
- `/`: Separador
- `AAAA`: Nº de ordem (4 caracteres alfanuméricos)
- `-`: Separador
- `DV`: Dígito Verificador (2 caracteres numéricos)

Para termos um comparativo, o formato do CNPJ tradicional é:

```
NN.NNN.NNN/NNNN-DV
```
Onde:
- `NN.NNN.NNN`: CNPJ básico (8 caracteres numéricos)
- `/`: Separador
- `NNNN`: Nº de ordem (4 caracteres numéricos)
- `-`: Separador
- `DV`: Dígito Verificador (2 caracteres numéricos)

Para termos uma ideia do impacto da mudança, o formato tradicional do CNPJ permitia um total de `100 milhões` de combinações (10^8 para o cnpj básico e 10^4 para o nº de ordem), enquanto o formato alfanumérico expande esse número para 36^8 para o cnpj básico e 36^4 para o nº de ordem, resultando em um total de aproximadamente `2.8 trilhões` de combinações possíveis.

# Como é feita a validação do CNPJ
Para validar e gerar CNPJs alfanuméricos em C#, é necessário adaptar os algoritmos de validação e geração para lidar com os caracteres alfanuméricos. O módulo utilizado para validação do dígito verificador (DV) permanece o mesmo (Módulo 11), mas a forma de calcular os pesos e os valores para os caracteres alfanuméricos precisa ser ajustada. Para os caracteres alfanuméricos, podemos atribuir valores numéricos da seguinte forma:

| Caractere | Valor Ascii | Valor Numérico | Caractere | Valor Ascii | Valor Numérico |
|-----------|-------------|----------------|-----------|-------------|----------------|
| 0         | 48          | 0              | I         | 73          | 25             |
| 1         | 49          | 1              | J         | 74          | 26             |
| 2         | 50          | 2              | K         | 75          | 27             |
| 3         | 51          | 3              | L         | 76          | 28             |
| 4         | 52          | 4              | M         | 77          | 29             |
| 5         | 53          | 5              | N         | 78          | 30             |
| 6         | 54          | 6              | O         | 79          | 31             |
| 7         | 55          | 7              | P         | 80          | 32             |
| 8         | 56          | 8              | Q         | 81          | 33             |
| 9         | 57          | 9              | R         | 82          | 34             |
| A         | 65          | 17             | S         | 83          | 35             |
| B         | 66          | 18             | T         | 84          | 36             |
| C         | 67          | 19             | U         | 85          | 37             |
| D         | 68          | 20             | V         | 86          | 38             |
| E         | 69          | 21             | W         | 87          | 39             |
| F         | 70          | 22             | X         | 88          | 40             |
| G         | 71          | 23             | Y         | 89          | 41             |
| H         | 72          | 24             | Z         | 90          | 42             | 

Se prestarmos atenç~~ao, os valores numéricos atribuídos aos caracteres são o `valor ASCII` do caractere menos `48`.

A validação do CNPJ é feita através do cálculo dos dígitos verificadores utilizando o módulo 11, onde os pesos são aplicados aos caracteres alfanuméricos convertidos para seus valores numéricos correspondentes. Os 12 primeiros caracteres (8 do cnpj básico e 4 do nº de ordem) são utilizados para calcular os dígitos verificadores, que são então comparados com os dígitos verificadores fornecidos no CNPJ para determinar sua validade.

Na teoria, a validação acontece da seguinte forma:
1. Inicia o cálculo do primeiro dígito verificador utilizando os 12 primeiros caracteres do CNPJ (8 do cnpj básico e 4 do nº de ordem).
2. Atribuir valores numéricos aos caracteres alfanuméricos do CNPJ.
3. Aplicar os pesos correspondentes aos caracteres do CNPJ.
4. Calcular a soma dos produtos dos valores numéricos pelos pesos.
5. Calcular o módulo 11 da soma e determinar o primeiro dígito verificador com base no resultado do módulo 11.
7. Repetir o processo para calcular o segundo dígito verificador, utilizando os 13 primeiros caracteres do CNPJ (incluindo o primeiro dígito verificador calculado).
8. Comparar os dígitos verificadores calculados com os dígitos verificadores fornecidos no CNPJ para validar sua autenticidade. Se os dígitos verificadores calculados corresponderem aos dígitos verificadores fornecidos, o CNPJ é considerado válido; caso contrário, é inválido.

Vamos imaginar um exemplo de CNPJ alfanumérico: `PM.VT1.7GD/0001-44`. Para validar este CNPJ, o processo seria o seguinte:

__Extrair os 12 primeiros caracteres__

`PM.VT1.7GD/0001` -> `PMVT17GD0001`

__Atribuir valores numéricos__

| Caractere      | P | M | V | T | 1 | 7 | G | D | 0 | 0 | 0 | 1 |
| -------------- | - | - | - | - | - | - | - | - | - | - | - | - |
| Valor Numérico | 32| 29| 38| 36| 1 | 7 | 23| 20| 0 | 0 | 0 | 1 |

__Aplicar os pesos correspondentes__  
Sendo que devemos distribuir os pesos de 2 a 9 da direita para a esquerda (recomeçando depois do oitavo caracter)

| Caractere      | P | M | V | T | 1 | 7 | G | D | 0 | 0 | 0 | 1 |
| -------------- | - | - | - | - | - | - | - | - | - | - | - | - |
| Valor Numérico | 32| 29| 38| 36| 1 | 7 | 23| 20| 0 | 0 | 0 | 1 |
| Peso           | 5 | 4 | 3 | 2 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 |

__Calcular a soma dos produtos dos valores numéricos pelos pesos__

| Caractere      | P | M | V | T | 1 | 7 | G | D | 0 | 0 | 0 | 1 |
| -------------- | - | - | - | - | - | - | - | - | - | - | - | - |
| Valor Numérico | 32| 29| 38| 36| 1 | 7 | 23| 20| 0 | 0 | 0 | 1 |
| Peso           | 5 | 4 | 3 | 2 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 |
| Multiplicação  |160|116|114| 72| 9 | 56|161|120| 0 | 0 | 0 | 2 |

Somatório dos produtos: `160 + 116 + 114 + 72 + 9 + 56 + 161 + 120 + 0 + 0 + 0 + 2 = 810`

__Calcular o módulo 11 da soma__  
Obtendo o resultado da divisão inteira de `810` por `11`:
Se o resto da divisão for igual a 1 ou 0, o primeiro dígito será igual a 0 (zero).
Senão, o primeiro dígito será igual ao resultado de `11` – resto. 

No caso do nosso exemplo, o resultado da divisão inteira de `810` por 11 é `73` e o resto é `7`, portanto, o primeiro dígito verificador será `11 - 7 = 4`.

__Repetir o processo para calcular o segundo dígito verificador__  
Utilizando os 13 primeiros caracteres do CNPJ (incluindo o primeiro dígito verificador calculado):

| Caractere      | P | M | V | T | 1 | 7 | G | D | 0 | 0 | 0 | 1 | 5 |
| -------------- | - | - | - | - | - | - | - | - | - | - | - | - | - |
| Valor Numérico | 32| 29| 38| 36| 1 | 7 | 23| 20| 0 | 0 | 0 | 1 | 4 |
| Peso           | 6 | 5 | 4 | 3 | 2 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 |
| Multiplicação  |192|145|152|108| 2 | 63|184|140| 0 | 0 | 0 | 3 | 8 |

Somatório dos produtos: `192 + 145 + 152 + 108 + 2 + 63 + 184 + 140 + 0 + 0 + 0 + 3 + 8 = 997`

Calcular o módulo 11 da soma, obtendo o resultado da divisão inteira de 997 por 11:
Se o resto da divisão for igual a 1 ou 0, o segundo dígito será igual a 0 (zero).
Senão, o segundo dígito será igual ao resultado de 11 – resto.

No nosso caso, o resultado da divisão inteira de 997 por 11 é `90` e o resto é `7`, portanto, o segundo dígito verificador será `11 - 7 = 4`.

__Comparar os dígitos verificadores__ 
Comparamos os dígitos calculados com os dígitos verificadores fornecidos no CNPJ para validar sua autenticidade. No nosso exemplo, os dígitos verificadores calculados resultaram em `44`, que correspondem aos dígitos verificadores fornecidos no CNPJ (`44`), portanto, o CNPJ `PM.VT1.7GD/0001-44` é considerado válido.


## Validação e Geração de CNPJ Alfanumérico em C#
Está na hora de codificar a validação e geração de CNPJs alfanuméricos em C#. Para isso, iremos criar uma classe `CnpjHelper` que irá conter métodos para validar e gerar CNPJs alfanuméricos. Vamos iniciar criando a estrutura básica da classe e os métodos de validação e geração.

```csharp
public class CNPJ
{
    public static bool Validar(string cnpj)
    {
        // Implementação da validação do CNPJ
        return false;
    }

    public static string Gerar()
    {
        // Implementação da geração de um CNPJ válido
        return string.Empty;
    }
}
```
O método `Validar` irá receber uma string representando o CNPJ e retornar `true` se o CNPJ for válido ou `false` caso contrário. O método `Gerar` irá gerar um CNPJ alfanumérico válido e retorná-lo como uma string.

Vamos começar pelo método de validação. A implementação da validação do CNPJ alfanumérico seguirá os passos descritos anteriormente, adaptando o algoritmo para lidar com os caracteres alfanuméricos. Dentro do validar realizaremos os seguintes passos:
1. Verificar se o CNPJ é nulo ou vazio e retornar `false` se for o caso.
2. Remover os caracteres de formatação (pontos, barra e hífen) do CNPJ para obter apenas os caracteres alfanuméricos.
3. Verificar se o CNPJ possui exatamente 14 caracteres alfanuméricos após a remoção dos caracteres de formatação. Se não tiver, retornar `false`.
4. Verificar se o CNPJ informado não é uma sequência de caracteres repetidos (ex: `AAAAAAAAAAAAAA`, `11111111111111`, etc.) e retornar `false` se for o caso.
5. Calcular os dígitos verificadores utilizando o algoritmo de módulo 11 adaptado para caracteres alfanuméricos.
6. Comparar os dígitos verificadores calculados com os dígitos verificadores fornecidos no CNPJ para determinar sua validade. Se os dígitos verificadores calculados corresponderem aos dígitos verificadores fornecidos, retornar `true`; caso contrário, retornar `false`.

A implementação do método `Validar` pode ser feita da seguinte forma:

```csharp
private const int TamanhoCnpj = 14;
private const int TamanhoBase = 12;
private const int ValorAsciiZero = 48;
private const int ModuloCalculo = 11;
private const int LimiteResto = 2;
private static readonly Regex CnpjRegex = new Regex(@"^[0-9A-Z]{12}[0-9]{2}$", 
    RegexOptions.Compiled);
private static readonly Regex FormatacaoRegex = new Regex(@"[.\-/]", 
    RegexOptions.Compiled);

public static bool Validar(string cnpj)
{
    if (string.IsNullOrEmpty(cnpj))
        return false;

    cnpj = RemoverFormatacao(cnpj);

    if (!CnpjRegex.IsMatch(cnpj))
        return false;

    if (cnpj.All(c => c == cnpj[0]))
    return false;

    (int d1, int d2) = CalcularDigitos(cnpj);

    return cnpj.EndsWith($"{d1}{d2}");
}

public static string RemoverFormatacao(string cnpj)
{
    if (string.IsNullOrEmpty(cnpj))
        return cnpj;

    return FormatacaoRegex.Replace(cnpj, "").ToUpperInvariant();
}

private static (int digito1, int digito2) CalcularDigitos(string cnpjBase)
{
    int[] multiplicador1 = new int[TamanhoBase] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
    int[] multiplicador2 = new int[TamanhoBase + 1] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

    int soma = 0;
    for (int i = 0; i < TamanhoBase; i++)
        soma += (cnpjBase[i] - ValorAsciiZero) * multiplicador1[i];
    int resto = (soma % ModuloCalculo);
    resto = (resto < LimiteResto) ? 0 : ModuloCalculo - resto;
    int digito1 = resto;

    string cnpjComPrimeiroDigito = cnpjBase + digito1;

    soma = 0;
    for (int i = 0; i < TamanhoBase + 1; i++)
        soma += (cnpjComPrimeiroDigito[i] - ValorAsciiZero) * multiplicador2[i];
    resto = (soma % ModuloCalculo);
    resto = (resto < LimiteResto) ? 0 : ModuloCalculo - resto;
    int digito2 = resto;

    return (digito1, digito2);
}
```

O método `Validar` começa verificando se o CNPJ é nulo ou vazio, e retorna `false` se for o caso. Em seguida, ele remove os caracteres de formatação do CNPJ utilizando o método `RemoverFormatacao`. Depois disso, ele verifica se o CNPJ possui exatamente 14 caracteres alfanuméricos utilizando uma expressão regular. Se o CNPJ não corresponder ao formato esperado, ele retorna `false`. O `.All(c => c == cnpj[0])` é utilizado para verificar se o CNPJ é uma sequência de caracteres repetidos, retornando `false` se for o caso. Em seguida, ele calcula os dígitos verificadores utilizando o método `CalcularDigitos` e compara os dígitos calculados com os dígitos fornecidos no CNPJ para determinar sua validade.

O método `RemoverFormatacao` utiliza uma expressão regular para remover os caracteres de formatação (pontos, barra e hífen) do CNPJ e converte os caracteres para maiúsculos para garantir que a validação seja case-insensitive.

O método `CalcularDigitos` implementa o algoritmo de cálculo dos dígitos verificadores utilizando o módulo 11 adaptado para caracteres alfanuméricos. Ele utiliza dois arrays de multiplicadores para calcular os dígitos verificadores, aplicando os pesos correspondentes aos caracteres do CNPJ e realizando as operações necessárias para obter os dígitos verificadores. No primeiro cálculo, ele utiliza os 12 primeiros caracteres do CNPJ para calcular o primeiro dígito verificador, e no segundo cálculo, ele utiliza os 13 primeiros caracteres (incluindo o primeiro dígito verificador calculado) para calcular o segundo dígito verificador. O retorno do método é uma tupla contendo os dois dígitos verificadores calculados. Deixamos a implementação desse método fora do `Validar` para conseguirmos, sem duplicar código, reaproveita-lo no método de geração de CNPJs alfanuméricos. 

Vamos agora implementar o método `Gerar`, que irá gerar um CNPJ alfanumérico válido. A implementação do método `Gerar` seguirá os seguintes passos:
1. Gerar aleatoriamente os 12 primeiros caracteres do CNPJ (8 do cnpj básico e 4 do nº de ordem) utilizando uma combinação de letras e números.
2. Calcular os dígitos verificadores utilizando o método `CalcularDigitos`
3. Concatenar os 12 caracteres gerados com os dígitos verificadores calculados para formar o CNPJ completo.
4. Formatar (ou não) o CNPJ gerado no formato alfanumérico (AA.AAA.AAA/AAAA-DV) e retorná-lo como uma string.

A implementação do método `Gerar` pode ser feita da seguinte forma:

```csharp
// Incluir como campo de valores alfanuméricos para geração do CNPJ
private static readonly char[] ValoresAlfanumericos = new char[]
{
'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
'U', 'V', 'W', 'X', 'Y', 'Z'
};

public static string Gerar(bool gerarMatriz = true, bool comPontuacao = false)
{
    char[] cnpjArray = new char[TamanhoBase];

    // Gera os primeiros 8 caracteres (base do CNPJ)
    for (int i = 0; i < 8; i++)
        cnpjArray[i] = ValoresAlfanumericos[GerarNumeroAleatorio(0, ValoresAlfanumericos.Length)];

    // Gera os próximos 4 caracteres (número do estabelecimento)
    if (gerarMatriz)
    {
        // Matriz sempre usa "0001"
        cnpjArray[8] = '0';
        cnpjArray[9] = '0';
        cnpjArray[10] = '0';
        cnpjArray[11] = '1';
    }
    else
    {
        // Filial com número aleatório
        for (int i = 8; i < TamanhoBase; i++)
            cnpjArray[i] = ValoresAlfanumericos[GerarNumeroAleatorio(0, ValoresAlfanumericos.Length)];
    }

    string cnpjBase = new string(cnpjArray);
    (int d1, int d2) = CalcularDigitos(cnpjBase);

    string cnpjCompleto = cnpjBase + d1.ToString() + d2.ToString();

    return comPontuacao ? Formatar(cnpjCompleto)! : cnpjCompleto;
}

public static string? Formatar(string cnpj)
{
    if (string.IsNullOrEmpty(cnpj))
        return null;

    cnpj = RemoverFormatacao(cnpj);

    if (cnpj.Length != TamanhoCnpj)
        return null;

    return $"{cnpj[..2]}.{cnpj.Substring(2, 3)}.{cnpj.Substring(5, 3)}/{cnpj.Substring(8, 4)}-{cnpj.Substring(12, 2)}";
}

private static int GerarNumeroAleatorio(int min, int max)
{
    using var rng = RandomNumberGenerator.Create();
    byte[] data = new byte[4];
    rng.GetBytes(data);
    int value = Math.Abs(BitConverter.ToInt32(data, 0));
    return min + (value % (max - min));
}
```

O método `Gerar` começa criando um array de caracteres para armazenar os 12 primeiros caracteres do CNPJ. Ele gera aleatoriamente os 8 caracteres do cnpj básico e os 4 caracteres do número do estabelecimento utilizando o array `ValoresAlfanumericos` para selecionar caracteres alfanuméricos aleatórios. O método `GerarNumeroAleatorio` é utilizado para gerar números aleatórios utilizando a classe `RandomNumberGenerator` (Agradeço ao [`Github Copilot`](https://github.com/features/copilot?locale=pt-BR) por me ajudar com a criação desse método). O método `Gerar` também possui um parâmetro `gerarMatriz` que, quando definido como `true`, gera um CNPJ com número de estabelecimento fixo (`0001`), representando a matriz da empresa. Se `gerarMatriz` for definido como `false`, ele gera um número de estabelecimento aleatório. O método também possui um parâmetro `comPontuacao` que, quando definido como `true`, formata o CNPJ gerado no formato alfanumérico (AA.AAA.AAA/AAAA-DV) utilizando o método `Formatar`. O método retorna o CNPJ gerado como uma string.

:::info Sobre os valores alfanuméricos
Os valores alfanuméricos incluem os dígitos de 0 a 9 e as letras de A a Z, totalizando 36 caracteres possíveis para cada posição alfanumérica do CNPJ. Caso você queira retirar os caracteres O, I, L e B, por exemplo, para evitar confusões com os números 0, 1 e 8 em sistemas OCR, você pode simplesmente remover esses caracteres do array `ValoresAlfanumericos`.
:::

## Desafios e Considerações
O principal desafio com a introdução do CNPJ alfanumérico é a necessidade de atualização dos sistemas que processam e validam CNPJs. Isso inclui sistemas de faturamento, bancos de dados, sistemas de validação e qualquer aplicação que utilize o CNPJ como identificador. A mudança exigirá uma revisão do código para garantir que ele possa lidar com o novo formato alfanumérico. Sistemas que tratam um CNPJ como um número inteiro ou que possuem validações específicas para o formato numérico precisarão ser atualizados para aceitar caracteres alfanuméricos implicando, provavelmente, em mudanças estruturais de bancos de dados, interfaces de usuário e integrações com outros sistemas. 

Os CNPJs existentes não serão convertidos para o formato alfanumérico, ou seja, os CNPJs tradicionais continuarão válidos e em uso. O novo formato alfanumérico será atribuído apenas a novos registros a partir de Julho de 2026. Isso significa que os sistemas precisarão ser capazes de lidar com ambos os formatos simultaneamente por um período indeterminado, o que pode aumentar a complexidade da implementação.

## Conclusão
A introdução do CNPJ alfanumérico é uma resposta necessária à escassez de números de CNPJ disponíveis, permitindo a expansão do número de registros e garantindo a continuidade dos negócios. Para quem não trata CNPJ como `texto`, a adaptação dos sistemas para lidar com o novo formato alfanumérico exigirá um esforço significativo. Este artigo apresentou uma visão geral do formato do CNPJ alfanumérico, os desafios relacionados à validação e uma implementação em C# para validar e gerar CNPJs alfanuméricos. Considere esse artigo e seu código fonte como um ponto de partida para a adaptação dos seus sistemas e para garantir que eles estejam prontos para lidar com o novo formato de CNPJ quando ele for introduzido em Julho de 2026. Se você gostou do conteúdo, não hesite em compartilhar e contribuir. Até a próxima!

## Código Fonte
O código fonte completo deste projeto, incluindo alguns testes unitários, está disponível no GitHub: [Cvllo.Cnpj](https://github.com/danielcorvello/Cvllo.Cnpj)

## Referências
- [CNPJ Alfanumérico - Receita Federal](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- [CNPJ do Futuro](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/apresentacoes/outros-eventos/cnpj-alfanumerico-escolha-tecnica.pdf)
- [Cálculo do DV do CNPJ Alfanumérico](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj)
