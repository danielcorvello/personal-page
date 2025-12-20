---
slug: edne-estrutura-da-base-de-ceps-dos-correios-parte-2
title: "e-DNE - Estrutura da Base de CEPs dos Correios - parte 2 de 3"
authors: ["corvello"]
date: 2025-12-17
tags: ["correios", "ceps", "banco-de-dados", "dotnet"]
draft: false
toc_max_heading_level: 3
image: /img/blog/estrutura-base-dados-cep/og-edne-parte-2.png
---

# e-DNE - Estrutura da Base de CEPs dos Correios - parte 2 de 3
Nesta segunda parte iremos continuar a explorar a estrutura da base de dados e-DNE dos Correios, focando na criação das tabelas com os dados dos arquivos TXT. Coninuaremos de onde paramos na [parte 1](../edne-estrutura-da-base-de-ceps-dos-correios-parte-1) e iniciaremos com o criação do projeto de importação, seguindo pelo mapeamento das classes para os arquivos TXT que serão lidos pelo [CSVHelper](https://joshclose.github.io/CsvHelper/) e salvos no banco pelo EF Core. 

<!-- truncate -->
## Criação do Projeto de Importação
Iniciaremos criando o projeto `Correios.DneBasico.Importer`, que será do tipo Console Application. Esse projeto será responsável por ler os arquivos TXT da base DNE Básico, mapear os dados para as classes do projeto Domain e salvar os dados no banco de dados PostgreSQL utilizando o DbContext que criamos na parte 1.

Iremos iniciar pela configuração dos Mappers do CSVHelper para cada uma das classes que criamos na parte 1. Esses mappers serão responsáveis por mapear os campos dos arquivos TXT para as propriedades das classes.

Adicione uma referência ao projeto `Correios.DneBasico.Domain` no projeto `Correios.DneBasico.Importer`, e instale o pacote NuGet `CsvHelper 33.1.0` no projeto `Correios.DneBasico.Importer`.

Adicione um arquivo `Global.Usings.cs` no projeto `Correios.DneBasico.Importer` com o seguinte conteúdo para facilitar o uso dos namespaces comuns:

```csharp title="Correios.DneBasico.Importer/Global.Usings.cs"
global using Correios.DneBasico.Domain.Entities;
global using Correios.DneBasico.Domain.Enums;
global using CsvHelper;
global using CsvHelper.Configuration;
global using CsvHelper.TypeConversion;
```

## Mapeadores do CSVHelper
Os mapeadores irão herdar da classe `ClassMap<T>` do CSVHelper, onde `T` é a classe que estamos mapeando. Cada mapeador irá mapear os campos do arquivo TXT para as propriedades da classe correspondente. O mapeador serve, em resumo, para indicarmos quais colunas do arquivo TXT correspondem a quais propriedades da classe. Esse passo é importante pois nos arquivos TXT os campos estão separados por arroba (@) e , principalmente, por não possuírem cabeçalho, ou seja, não possuem o nome das colunas. Caso queira entender melhor o funcionamento do CSVHelper e dos mapeadores, recomendo a leitura da documentação oficial do [CSVHelper - Reading a csv](https://joshclose.github.io/CsvHelper/getting-started/#reading-a-csv-file).

Vamos criar um diretório chamado `Mappings` dentro do projeto `Correios.DneBasico.Importer` e adicionar os mapeadores para cada uma das classes que criamos na parte 1.

### Bairros
```csharp title="Correios.DneBasico.Importer/Mappings/BairroMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class BairroMap : ClassMap<Bairro>
{
    public BairroMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.LocalidadeId).Index(2);
        Map(m => m.Nome).Index(3);
        Map(m => m.NomeAbreviado)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(4);
    }
}

```

Mapeamos cada propriedade da classe `Bairro` para o índice correspondente no arquivo TXT `LOG_BAIRRO.TXT`.

Na `NomeAbreviado`, utilizamos o método `TypeConverterOption.NullValues(string.Empty)` para indicar que, caso o campo esteja vazio no arquivo TXT, ele deve ser mapeado como `null` na propriedade `NomeAbreviado`.

Os próximos mapeadores seguem o mesmo padrão, mapeando cada propriedade para o índice correspondente no arquivo TXT, com algumas exceções. Quando houver uma exceção, irei explicar o motivo.

### Caixas Postais Comunitárias
```csharp title="Correios.DneBasico.Importer/Mappings/CaixaPostalComunitariaMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class CaixaPostalComunitariaMap : ClassMap<CaixaPostalComunitaria>
{
    public CaixaPostalComunitariaMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.LocalidadeId).Index(2);
        Map(m => m.Nome).Index(3);
        Map(m => m.Endereco).Index(4);
        Map(m => m.Cep).Index(5);
    }
}
```

### Faixa de Caixas Postais Comunitárias
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaCaixaPostalComunitariaMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaCaixaPostalComunitariaMap : ClassMap<FaixaCaixaPostalComunitaria>
{
    public FaixaCaixaPostalComunitariaMap()
    {
        Map(m => m.CaixaPostalComunitariaId).Index(0);
        Map(m => m.CaixaPostalInicial).Index(1);
        Map(m => m.CaixaPostalFinal).Index(2);
    }
}
```

### Faixa de Caixas Postais de Unidade Operacional
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaCaixaPostalUopMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaCaixaPostalUopMap : ClassMap<FaixaCaixaPostalUop>
{
    public FaixaCaixaPostalUopMap()
    {
        Map(m => m.UnidadeOperacionalId).Index(0);
        Map(m => m.CaixaPostalInicial).Index(1);
        Map(m => m.CaixaPostalFinal).Index(2);
    }
}
```

### Faixa de CEP de Bairro
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaCepBairroMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaCepBairroMap : ClassMap<FaixaCepBairro>
{
    public FaixaCepBairroMap()
    {
        Map(m => m.BairroId).Index(0);
        Map(m => m.CepInicial).Index(1);
        Map(m => m.CepFinal).Index(2);
    }
}
```

### Faixa de CEP de Estado
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaCepEstadoMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaCepEstadoMap : ClassMap<FaixaCepEstado>
{
    public FaixaCepEstadoMap()
    {
        Map(m => m.Uf).Index(0);
        Map(m => m.CepInicial).Index(1);
        Map(m => m.CepFinal).Index(2);
    }
}
```

### Faixa de CEP de Localidade
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaCepLocalidadeMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaCepLocalidadeMap : ClassMap<FaixaCepLocalidade>
{
    public FaixaCepLocalidadeMap()
    {
        Map(m => m.LocalidadeId).Index(0);
        Map(m => m.CepInicial).Index(1);
        Map(m => m.CepFinal).Index(2);
        Map(m => m.TipoFaixa)
            .TypeConverter<TipoFaixaConverter>()
            .Index(3);
    }
}

public class TipoFaixaConverter : ITypeConverter
{
    public object? ConvertFromString(
        string? text,
        IReaderRow row,
        MemberMapData memberMapData)
    {
        return text switch
        {
            "T" => TipoFaixaCep.TOTAL_DO_MUNICIPIO,
            "C" => TipoFaixaCep.EXCLUSIVA_SEDE_URBANA,
            _ => throw new InvalidOperationException($"Tipo de faixa desconhecido: {text}")
        };
    }
    public string? ConvertToString(
        object? value,
        IWriterRow row,
        MemberMapData memberMapData)
    {
        throw new NotImplementedException();
    }
}

```

No mapeador `FaixaCepLocalidadeMap`, temos uma propriedade `TipoFaixa` que é do tipo enum `TipoFaixaCep`. Para mapear esse campo corretamente, criamos um conversor personalizado `TipoFaixaConverter` que implementa a interface `ITypeConverter` do CSVHelper. Esse conversor mapeia os valores "T" e "C" para os valores correspondentes do enum.

### Faixa Numérica de Seccionamento
```csharp title="Correios.DneBasico.Importer/Mappings/FaixaNumericaSeccionamentoMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class FaixaNumericaSeccionamentoMap : ClassMap<FaixaNumericaSeccionamento>
{
    public FaixaNumericaSeccionamentoMap()
    {
        Map(m => m.LogradouroId).Index(0);
        Map(m => m.SeccionamentoInicial).Index(1);
        Map(m => m.SeccionamentoFinal).Index(2);
        Map(m => m.ParidadeLado)
            .TypeConverter<ParidadeLadoSeccionamentoConverter>()
            .Index(3);
    }
}

public class ParidadeLadoSeccionamentoConverter : ITypeConverter
{
    public object? ConvertFromString(
        string? text,
        IReaderRow row,
        MemberMapData memberMapData)
    {
        return text switch
        {
            "A" => ParidadeLadoSeccionamento.AMBOS,
            "P" => ParidadeLadoSeccionamento.PAR,
            "I" => ParidadeLadoSeccionamento.IMPAR,
            "D" => ParidadeLadoSeccionamento.DIREITO,
            "E" => ParidadeLadoSeccionamento.ESQUERDO,
            _ => throw new InvalidOperationException($"Paridade de lado desconhecida: {text}")
        };
    }
    public string? ConvertToString(
        object? value,
        IWriterRow row,
        MemberMapData memberMapData)
    {
        throw new NotImplementedException();
    }
}


```
Aqui, no mapeador `FaixaNumericaSeccionamentoMap`, temos uma propriedade `ParidadeLado` que também é do tipo enum `ParidadeLadoSeccionamento`. Criamos o conversor personalizado `ParidadeLadoSeccionamentoConverter` para mapear os valores "A", "P", "I", "D" e "E" para os valores correspondentes do enum.

### Grandes Usuários
```csharp title="Correios.DneBasico.Importer/Mappings/GrandeUsuarioMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class GrandeUsuarioMap : ClassMap<GrandeUsuario>
{
    public GrandeUsuarioMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.LocalidadeId).Index(2);
        Map(m => m.BairroId).Index(3);
        Map(m => m.LogradouroId).Index(4);
        Map(m => m.Nome).Index(5);
        Map(m => m.Endereco).Index(6);
        Map(m => m.Cep).Index(7);
        Map(m => m.NomeAbreviado)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(8);
    }
}
```

### Localidades
```csharp title="Correios.DneBasico.Importer/Mappings/LocalidadeMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class LocalidadeMap : ClassMap<Localidade>
{
    public LocalidadeMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.Nome).Index(2);
        Map(m => m.Cep)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(3);
        Map(m => m.Situacao).Index(4);
        Map(m => m.Tipo)
            .TypeConverter<TipoLocalidadeConverter>()
            .Index(5);
        Map(m => m.SubordinacaoId).Index(6);
        Map(m => m.NomeAbreviado).Index(7);
        Map(m => m.Ibge)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(8);
    }
}

public class TipoLocalidadeConverter : ITypeConverter
{
    public object? ConvertFromString(
        string? text,
        IReaderRow row,
        MemberMapData memberMapData)
    {
        return text switch
        {
            "D" => TipoLocalidade.DISTRITO,
            "P" => TipoLocalidade.POVOADO,
            "M" => TipoLocalidade.MUNICIPIO,
            _ => throw new InvalidOperationException($"Tipo de localidade desconhecido: {text}")
        };
    }
    public string? ConvertToString(
        object? value,
        IWriterRow row,
        MemberMapData memberMapData)
    {
        throw new NotImplementedException();
    }
}
```

Nesse mapeador `LocalidadeMap`, temos a propriedade `Tipo` que é do tipo enum `TipoLocalidade`.... e acredito que você entendeu o resto :)

### Logradouros
```csharp title="Correios.DneBasico.Importer/Mappings/LogradouroMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class LogradouroMap : ClassMap<Logradouro>
{
    public LogradouroMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.LocalidadeId).Index(2);
        Map(m => m.BairroId).Index(3);
        // Pulamos o BAI_NU_FIM
        Map(m => m.Nome).Index(5);
        Map(m => m.Complemento)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(6);
        Map(m => m.Cep).Index(7);
        Map(m => m.Tipo).Index(8);
        Map(m => m.StatusTipo)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(9);
        Map(m => m.NomeAbreviado)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(10);
    }
}
```

Na logradouro, pulamos o campo `BAI_NU_FIM` que está no índice 4 do arquivo TXT, pois não temos essa propriedade na nossa classe `Logradouro`.

### Países
```csharp title="Correios.DneBasico.Importer/Mappings/PaisMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class PaisMap : ClassMap<Pais>
{
    public PaisMap()
    {
        Map(m => m.Sigla).Index(0);
        Map(m => m.SiglaAlternativa).Index(1);
        Map(m => m.NomePortugues).Index(2);
        Map(m => m.NomeIngles).Index(3);
        Map(m => m.NomeFrances).Index(4);
        Map(m => m.Abreviatura)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(5);
    }
}
```

### Unidades Operacionais
```csharp title="Correios.DneBasico.Importer/Mappings/UnidadeOperacionalMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class UnidadeOperacionalMap : ClassMap<UnidadeOperacional>
{
    public UnidadeOperacionalMap()
    {
        Map(m => m.Id).Index(0);
        Map(m => m.Uf).Index(1);
        Map(m => m.LocalidadeId).Index(2);
        Map(m => m.BairroId).Index(3);
        Map(m => m.LogradouroId).Index(4);
        Map(m => m.Nome).Index(5);
        Map(m => m.Endereco).Index(6);
        Map(m => m.Cep).Index(7);
        Map(m => m.CaixasPostais).Index(8);
        Map(m => m.NomeAbreviado)
            .TypeConverterOption
            .NullValues(string.Empty)
            .Index(9);
    }
}
```

### Variações de Bairros
```csharp title="Correios.DneBasico.Importer/Mappings/VariacaoBairroMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class VariacaoBairroMap : ClassMap<VariacaoBairro>
{
    public VariacaoBairroMap()
    {
        Map(m => m.BairroId).Index(0);
        Map(m => m.Ordem).Index(1);
        Map(m => m.Denominacao).Index(2);
    }
}
```

### Variações de Localidades
```csharp title="Correios.DneBasico.Importer/Mappings/VariacaoLocalidadeMap.cs"

namespace Correios.DneBasico.Importer.Mappings;

public class VariacaoLocalidadeMap : ClassMap<VariacaoLocalidade>
{
    public VariacaoLocalidadeMap()
    {
        Map(m => m.LocalidadeId).Index(0);
        Map(m => m.Ordem).Index(1);
        Map(m => m.Denominacao).Index(2);
    }
}
```

### Variações de Logradouros
```csharp title="Correios.DneBasico.Importer/Mappings/VariacaoLogradouroMap.cs"
namespace Correios.DneBasico.Importer.Mappings;

public class VariacaoLogradouroMap : ClassMap<VariacaoLogradouro>
{
    public VariacaoLogradouroMap()
    {
        Map(m => m.LogradouroId).Index(0);
        Map(m => m.Ordem).Index(1);
        Map(m => m.Tipo).Index(2);
        Map(m => m.Denominacao).Index(3);
    }
}
```

Arquivos de mapeadores criados! No próximo passo, iremos criar a lógica para ler os arquivos TXT utilizando o CSVHelper e mapear os dados para as classes correspondentes.

A primeira coisa que vamos fazer é adicionar um arquivo `appsettings.json` no projeto `Correios.DneBasico.Importer` para armazenar a string de conexão com o banco de dados PostgreSQL:

```json title="Correios.DneBasico.Importer/appsettings.json"
{
  "ConnectionStrings": {
    "eDne": "Host=localhost;Database=edne;Username=seu_usuario;Password=sua_senha"
  },
  "RunOnStart":  false
}
```

Altere a conexão conforme o seu ambiente. No [Github do projeto](https://github.com/danielcorvello/Correios.DneBasico), disponibilizo o código completo do projeto `Correios.DneBasico.Importer` com a lógica para ler os arquivos TXT e salvar os dados no banco de dados que estará rodando em um container Docker. Não irei detalhar essa parte aqui no artigo para não ficar muito extenso, mas você pode conferir o código completo no repositório do projeto.

A configuração `RunOnStart` será utilizada para indicar se a importação dos dados deve ser executada automaticamente ao iniciar o aplicativo. Isso é útil para evitar execuções acidentais durante o desenvolvimento.

Adicione um diretório chamado `Arquivos` na raiz do projeto `Correios.DneBasico.Importer` e copie os arquivos TXT da base DNE Básico para esse diretório.

:::warning
Garanta que os arquivos estejam configurados para serem copiados para o diretório de saída. Para isso, selecione todos os arquivos TXT no Solution Explorer, clique com o botão direito e selecione "Properties". Em seguida, defina a propriedade "Copy to Output Directory" como "Copy if newer". Faça o mesmo para o arquivo `appsettings.json`.
:::

## Criando a migração inicial
Adicione os seguintes pacotes NuGet no projeto `Correios.DneBasico.Data`:
- `Microsoft.EntityFrameworkCore.Design 9.0.11`
- `Microsoft.EntityFrameworkCore.Relational 9.0.11`
- `Microsoft.Extensions.Configuration.Json 9.0.11`

No projeto `Correios.DneBasico.Data`, abra o terminal do Visual Studio (View > Terminal) e execute o seguinte comando para criar a migração inicial:

```bash
dotnet-ef migrations add Initial
```

Vixi! Deu ruim, não é? A grosso modo: O erro ocorre porque o EF Core não consegue encontrar o provedor do banco de dados PostgreSQL. Para resolver isso, precisaremmos realizar algumas configurações no projeto `Correios.DneBasico.Data`.

Crairemos nossas migrations no projeto `Correios.DneBasico.Data`, mas a string de conexão, por enquanto, está no projeto `Correios.DneBasico.Importer`. Para resolver isso, precisamos criar uma classe que implemente a interface `IDesignTimeDbContextFactory<TContext>` do EF Core, onde `TContext` é o nosso DbContext `DneBasicoDbContext`. Essa classe será responsável por criar uma instância do DbContext durante o processo de migração.

Primeiro, vamos criar um arquivo `appsettings.json` no projeto `Correios.DneBasico.Data` com a mesma configuração de conexão que criamos no projeto `Correios.DneBasico.Importer`:

```json title="Correios.DneBasico.Data/appsettings.json"
{
  "ConnectionStrings": {
    "eDne": "Host=localhost;Database=edne;Username=seu_usuario;Password=sua_senha"
  }
}
```

Lembre-se de marcar o arquivo para ser copiado para o diretório de saída, assim como fizemos no projeto `Correios.DneBasico.Importer`.

Agora, crie a classe `DneBasicoDbContextFactory` dentro do diretório `Contexts` no projeto `Correios.DneBasico.Data` com o seguinte conteúdo:


```csharp title="Correios.DneBasico.Data/Contexts/DneBasicoDbContextFactory.cs"
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Correios.DneBasico.Data.Contexts;

public class DneBasicoDbContextFactory : IDesignTimeDbContextFactory<DneBasicoDbContext>
{
    public DneBasicoDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<DneBasicoDbContext>();

        var connectionString = configuration.GetConnectionString("eDNE");

        optionsBuilder.UseNpgsql(connectionString);

        return new DneBasicoDbContext(optionsBuilder.Options);
    }
}
```

Essa classe lê a string de conexão do arquivo `appsettings.json` e cria uma instância do `DneBasicoDbContext` com as opções configuradas para o PostgreSQL.

Agora, volte ao terminal do Visual Studio e execute novamente o comando para criar a migração inicial:

```bash
dotnet-ef migrations add Initial
```

Dessa vez, a migração deve ser criada com sucesso. Não será necessário aplicar a migração agora, pois o projeto `Correios.DneBasico.Importer` irá garantir que o banco de dados esteja atualizado ao iniciar a importação dos dados.

## Bônus: Dados de Estados na migração
No artigo anterior, criamos a entidade `Estado` para armazenar os estados do Brasil. Podemos aproveitar a migração inicial para inserir os dados dos estados diretamente no banco de dados já que esses dados não são fornecidos nos arquivos TXT da base DNE Básico. Para isso, abra o arquivo com o DbContext `DneBasicoDbContext.cs` e adicione o seguinte código para o método `OnModelCreating`:

```csharp title="Correios.DneBasico.Data/Contexts/DneBasicoDbContext.cs"
// ... código existente ...
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(DneBasicoDbContext).Assembly);

    List<Estado> estados =
    [
        new Estado { Uf = "RO", Nome = "Rondônia", Ibge = "11" },
        new Estado { Uf = "AC", Nome = "Acre", Ibge = "12" },
        new Estado { Uf = "AM", Nome = "Amazonas", Ibge = "13" },
        new Estado { Uf = "RR", Nome = "Roraima", Ibge = "14" },
        new Estado { Uf = "PA", Nome = "Pará", Ibge = "15" },
        new Estado { Uf = "AP", Nome = "Amapá", Ibge = "16" },
        new Estado { Uf = "TO", Nome = "Tocantins", Ibge = "17" },
        new Estado { Uf = "MA", Nome = "Maranhão", Ibge = "21" },
        new Estado { Uf = "PI", Nome = "Piauí", Ibge = "22" },
        new Estado { Uf = "CE", Nome = "Ceará", Ibge = "23" },
        new Estado { Uf = "RN", Nome = "Rio Grande do Norte", Ibge = "24" },
        new Estado { Uf = "PB", Nome = "Paraíba", Ibge = "25" },
        new Estado { Uf = "PE", Nome = "Pernambuco", Ibge = "26" },
        new Estado { Uf = "AL", Nome = "Alagoas", Ibge = "27" },
        new Estado { Uf = "SE", Nome = "Sergipe", Ibge = "28" },
        new Estado { Uf = "BA", Nome = "Bahia", Ibge = "29" },
        new Estado { Uf = "MG", Nome = "Minas Gerais", Ibge = "31" },
        new Estado { Uf = "ES", Nome = "Espírito Santo", Ibge = "32" },
        new Estado { Uf = "RJ", Nome = "Rio de Janeiro", Ibge = "33" },
        new Estado { Uf = "SP", Nome = "São Paulo", Ibge = "35" },
        new Estado { Uf = "PR", Nome = "Paraná", Ibge = "41" },
        new Estado { Uf = "SC", Nome = "Santa Catarina", Ibge = "42" },
        new Estado { Uf = "RS", Nome = "Rio Grande do Sul", Ibge = "43" },
        new Estado { Uf = "MS", Nome = "Mato Grosso do Sul", Ibge = "50" },
        new Estado { Uf = "MT", Nome = "Mato Grosso", Ibge = "51" },
        new Estado { Uf = "GO", Nome = "Goiás", Ibge = "52" },
        new Estado { Uf = "DF", Nome = "Distrito Federal", Ibge = "53" }
    ];

    modelBuilder.Entity<Estado>().HasData(estados);
}
```
Crie uma nova migração após adicionar esse código:

```bash
dotnet-ef migrations add SeedEstados
```

Isso irá inserir os dados dos estados na tabela `Estados` quando a migração for aplicada.


## Classe EdneImporter
Criaremos uma classe chamada `EdneImporter` que será responsável por resolver toda a lógica de importação dos dados. Essa classe irá utilizar o CSVHelper e mapear os dados para salvarmos utilizando o DbContext.

Precisamos adicionar referências ao projeto `Correios.DneBasico.Data` no projeto `Correios.DneBasico.Importer`, e instalar os pacotes NuGet `EFCore.BulkExtensions 9.0.2` e `Microsoft.Extensions.Configuration 9.0.11` no projeto `Correios.DneBasico.Importer`.


```csharp title="Correios.DneBasico.Importer/EdneImporter.cs" showLineNumbers="true"
using Correios.DneBasico.Data.Contexts;
using EFCore.BulkExtensions;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Globalization;
using System.Text;

namespace Correios.DneBasico.Importer;

public class EdneImporter
{
    private readonly int BATCH_SIZE = 5000;
    private readonly string BASEDIR = Path.Combine(AppContext.BaseDirectory, "Arquivos");
    private readonly CsvConfiguration csvConfig = null!;
    private readonly IServiceProvider _serviceProvider;

    public EdneImporter(IServiceProvider serviceProvider)
    {
        csvConfig = new(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = false,
            Delimiter = "@",
            Encoding = Encoding.Latin1,
            BadDataFound = null,
            ShouldQuote = args => true
        };

        _serviceProvider = serviceProvider;
    }

    public void ImportarArquivoCsv<TEntity, TMap>(string nomeArquivo)
        where TEntity : class
        where TMap : ClassMap<TEntity>
    {
        Console.WriteLine($"==========================================================");
        Console.WriteLine($"IMPORTANDO {nomeArquivo.Replace(".TXT", "")}");
        Console.WriteLine($"==========================================================");

        var files = new DirectoryInfo(string.Format(@"{0}", BASEDIR)).GetFiles(nomeArquivo);
        if (files.Length > 0)
        {
            foreach (var arquivo in files)
            {
                var watch = Stopwatch.StartNew();

                int counter = 0;

                Console.WriteLine();
                Console.WriteLine($"==========================================================");
                Console.WriteLine($"ABRINDO O ARQUIVO {arquivo.Name}");
                Console.WriteLine($"==========================================================");
                Console.WriteLine();

                using (var reader = new StreamReader(arquivo.FullName, encoding: Encoding.Latin1))
                using (var csv = new CsvReader(reader, csvConfig))
                {
                    csv.Context.RegisterClassMap<TMap>();
                    var records = csv.GetRecords<TEntity>();

                    foreach (var batch in records.Chunk(BATCH_SIZE))
                    {
                        using var scope = _serviceProvider.CreateScope();
                        using var context = scope.ServiceProvider.GetRequiredService<DneBasicoDbContext>();

                        context.BulkInsert(batch.ToList());
                        counter += batch.Length;
                        Console.WriteLine("{0}", counter);
                    }
                }

                watch.Stop();
                TimeSpan t = TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds);
                string answer = string.Format("{0:D2}h:{1:D2}m:{2:D2}s:{3:D3}ms",
                                        t.Hours,
                                        t.Minutes,
                                        t.Seconds,
                                        t.Milliseconds);
                Console.WriteLine($"Tempo de execução: {answer}");

                Console.WriteLine($"Arquivo {arquivo.Name} processado com {counter} registros.");
            }

            Console.WriteLine("");
            Console.WriteLine("");
        }
        else
        {
            Console.WriteLine($"Arquivo {nomeArquivo} não encontrado.");
        }
    }
}
```

A classe `EdneImporter` possui um método genérico `ImportarArquivoCsv<TEntity, TMap>` que recebe o nome do arquivo a ser importado, onde `TEntity` é a classe que representa a entidade e `TMap` é o mapeador correspondente. Iremos utilizar essa classe no projeto `Correios.DneBasico.Importer`, no arquivo `Program.cs`, para importar cada um dos arquivos TXT da base DNE Básico.

O `csvConfig` define as configurações do CSVHelper, como o delimitador (@), a cultura (InvariantCulture), a codificação (Latin1) e outras opções.

O método `ImportarArquivoCsv` aceita o mapador e a entidade como parâmetros genéricos, lê o arquivo TXT, mapeia os dados utilizando o CSVHelper e salva os dados no banco de dados em lotes (batches) utilizando o `EFCore.BulkExtensions` para otimizar a performance da inserção. O tamanho do lote é definido pela constante `BATCH_SIZE`.

Dentro do método, utilizamos um loop para ler os arquivos que correspondem ao nome fornecido. Para cada arquivo, iniciamos um cronômetro para medir o tempo de execução. O único caso onde teremos vários arquivos é no caso dos logradouros, onde o arquivo é dividido em vários arquivos menores por Uf (Ex: LOG_LOGRADOURO_SP.TXT, LOG_LOGRADOURO_RJ.TXT, etc).

Classe de importação criada! No próximo passo, iremos utilizar essa classe no arquivo `Program.cs` para importar os dados.

Altere o arquivo `Program.cs` no projeto `Correios.DneBasico.Importer` para o seguinte conteúdo:

```csharp title="Correios.DneBasico.Importer/Program.cs"
using Correios.DneBasico.Data.Contexts;
using Correios.DneBasico.Importer;
using Correios.DneBasico.Importer.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

var configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();

var runOnStart = configuration["RunOnStart"];
if (string.IsNullOrEmpty(runOnStart) || runOnStart?.ToLower() != "true")
{
    Console.WriteLine("O importador está configurado para não ser executado automaticamente.");
    Console.WriteLine("Para executar automaticamente, defina a chave 'RunOnStart' como 'true' no arquivo appsettings.json.");
    Console.WriteLine("Pressione Enter para sair...");
    Console.ReadLine();
    return;
}

var serviceProvider = new ServiceCollection()
    .AddDbContext<DneBasicoDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("eDNE")))
    .BuildServiceProvider();

using (var scope = serviceProvider.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DneBasicoDbContext>();

    // Se precisar recriar o banco de dados, descomente a linha abaixo
    // CUIDADO! Apaga a base e todos os dados
    // dbContext.Database.EnsureDeleted();

    // Aplica as migrations
    dbContext.Database.Migrate();

    Console.WriteLine("Database inicializado e migrations aplicadas com sucesso!");
}

var watch = Stopwatch.StartNew();

var edne = new EdneImporter(serviceProvider);
edne.ImportarArquivoCsv<Pais, PaisMap>("ECT_PAIS.TXT");
edne.ImportarArquivoCsv<FaixaCepEstado, FaixaCepEstadoMap>("LOG_FAIXA_UF.TXT");
edne.ImportarArquivoCsv<Localidade, LocalidadeMap>("LOG_LOCALIDADE.TXT");
edne.ImportarArquivoCsv<VariacaoLocalidade, VariacaoLocalidadeMap>("LOG_VAR_LOC.TXT");
edne.ImportarArquivoCsv<FaixaCepLocalidade, FaixaCepLocalidadeMap>("LOG_FAIXA_LOCALIDADE.TXT");
edne.ImportarArquivoCsv<Bairro, BairroMap>("LOG_BAIRRO.TXT");
edne.ImportarArquivoCsv<VariacaoBairro, VariacaoBairroMap>("LOG_VAR_BAI.TXT");
edne.ImportarArquivoCsv<FaixaCepBairro, FaixaCepBairroMap>("LOG_FAIXA_BAIRRO.TXT");
edne.ImportarArquivoCsv<CaixaPostalComunitaria, CaixaPostalComunitariaMap>("LOG_CPC.TXT");
edne.ImportarArquivoCsv<FaixaCaixaPostalComunitaria, FaixaCaixaPostalComunitariaMap>("LOG_FAIXA_CPC.TXT");
edne.ImportarArquivoCsv<Logradouro, LogradouroMap>("LOG_LOGRADOURO_**.TXT");
edne.ImportarArquivoCsv<FaixaNumericaSeccionamento, FaixaNumericaSeccionamentoMap>("LOG_NUM_SEC.TXT");
edne.ImportarArquivoCsv<GrandeUsuario, GrandeUsuarioMap>("LOG_GRANDE_USUARIO.TXT");
edne.ImportarArquivoCsv<UnidadeOperacional, UnidadeOperacionalMap>("LOG_UNID_OPER.TXT");
edne.ImportarArquivoCsv<FaixaCaixaPostalUop, FaixaCaixaPostalUopMap>("LOG_FAIXA_UOP.TXT");

watch.Stop();

TimeSpan t = TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds);
string answer = string.Format("{0:D2}h:{1:D2}m:{2:D2}s:{3:D3}ms",
                        t.Hours,
                        t.Minutes,
                        t.Seconds,
                        t.Milliseconds);

Console.WriteLine($"Tempo de execução total: {answer}");

Console.WriteLine("Importação concluída");

Thread.Sleep(10000);

// Fim do programa
Environment.Exit(0);
```

Iniciamos o programa lendo a configuração do arquivo `appsettings.json` para verificar se a importação deve ser executada automaticamente. Caso a chave `RunOnStart` não esteja definida como `true`, o programa exibirá uma mensagem e aguardará o usuário pressionar Enter para sair.

Em seguida, configuramos o `IServiceProvider` para injetar o `DneBasicoDbContext` com a string de conexão do PostgreSQL.

Iniciamos um escopo para garantir que o DbContext seja descartado corretamente após o uso. Dentro desse escopo, garantimos que o banco de dados seja excluído (cuidado, isso apagará todos os dados) e aplicamos as migrations para criar a estrutura do banco de dados.

Depois, criamos uma instância do `EdneImporter` e chamamos o método `ImportarArquivoCsv` para cada um dos arquivos TXT da base DNE Básico, passando a entidade e o mapeador correspondentes.

O tempo total de execução é medido e exibido ao final do processo de importação.

## Hora de rodar!
Agora que tudo está pronto, vamos rodar o projeto `Correios.DneBasico.Importer` para importar os dados da base DNE Básico para o banco de dados PostgreSQL.

Antes de rodar, certifique-se de que o banco de dados PostgreSQL está rodando e que a string de conexão no arquivo `appsettings.json` está correta.

Execute o projeto `Correios.DneBasico.Importer`. O processo de importação começará e você verá o progresso no console. E voilá! Que `erro` é esse? 

```
Npgsql.PostgresException: '23503: insert or update on table "localidades" violates foreign key constraint "FK_localidades_localidades_loc_nu_sub"
```

Esse erro acontece porque na tabela `Localidades`, temos uma chave estrangeira `loc_nu_sub` que referencia a própria tabela `Localidades`. Isso significa que algumas localidades são subordinadas a outras localidades. Durante a importação, estamos tentando inserir uma localidade subordinada que referencia uma localidade que ainda não foi inserida no banco de dados. Para resolver esse problema, precisamos garantir que as localidades com subordinadas sejam inseridas antes das localidades que as referenciam.

Vamos solucionar isso incluindo uma checagem de tipo de entidade no método `ImportarArquivoCsv` da classe `EdneImporter`. Se a entidade for do tipo `Localidade`, iremos ordenar os registros de forma que as localidades com subordinadas sejam inseridas primeiro. No arquivo `EdneImporter.cs`, inclua a seguinte lógica dentro do método `ImportarArquivoCsv`, logo após `var records = csv.GetRecords<TEntity>();`:

```csharp
if (typeof(TEntity) == typeof(Localidade))
{
    // Ordena os registros de Localidade por SubordinadaId = null primeiro, para evitar problemas de FK e depois por Id
    records = records.OrderBy(r => ((Localidade)(object)r).SubordinacaoId.HasValue)
                         .ThenBy(r => ((Localidade)(object)r).SubordinacaoId)
                         .ThenBy(r => ((Localidade)(object)r).Id);
}
```

Não é a solução mais elegante, mas resolve o problema de forma rápida. Agora, rode novamente o projeto `Correios.DneBasico.Importer`. Cruze os dedos e torça para não aparecer mais nenhum erro!

1, 2, 3... Rodando .... e.... Novo erro!

```
Npgsql.PostgresException: '23503: insert or update on table "faixas_caixa_postal_uop" violates foreign key constraint "FK_faixas_caixa_postal_uop_unidades_operacionais_uop_nu"
```

Esse erro é semelhante ao anterior, mas agora está relacionado à tabela `FaixaCaixaPostalUop`, que possui uma chave estrangeira `uop_nu` que referencia a tabela `UnidadesOperacionais`. As unidades operacionais já estão sendo importadas antes das faixas de caixa postal UOP, então o problema pode estar relacionado a registros inválidos ou inconsistentes na base de dados. Para solucionar isso, iremos filtrar os registros de `FaixaCaixaPostalUop` para garantir que apenas aqueles que possuem uma unidade operacional válida sejam importados. Adicione a seguinte lógica dentro do método `ImportarArquivoCsv`, logo após o código que adicionamos anteriormente para `Localidade`: 

```csharp
if (typeof(TEntity) == typeof(FaixaCaixaPostalUop))
{
    using var scope = _serviceProvider.CreateScope();
    using var context = scope.ServiceProvider.GetRequiredService<DneBasicoDbContext>();

    var uops = context.UnidadesOperacionais.AsNoTracking().Select(u => u.Id).ToHashSet();

    records = records.Where(r => uops.Contains(((FaixaCaixaPostalUop)(object)r).UnidadeOperacionalId));
}
```

Novamente, não é a solução mais elegante, mas resolve o problema de forma rápida. Agora, rode novamente o projeto `Correios.DneBasico.Importer`. Torça para não aparecer mais nenhum erro!

Se você seguiu todos os passos corretamente, a importação deve ser concluída com sucesso!
Dependendo do desempenho do seu computador e do banco de dados, o processo pode levar algum tempo, pois estamos importando uma grande quantidade de dados. No meu caso, levou cerca de 30 segundos para importar todos os dados.

Neste momento, temos a base dos correios DNE Básico importada de forma estruturada em um banco de dados PostgreSQL.

Mas, ainda precisamos de um grande passo neste processo: criar uma view e ou tabela unificada que contenha todas as informações necessárias para consultar os CEPs e endereços de forma eficiente.

## Criando a tabela unificada de CEPs
Para facilitar a consulta dos dados importados, criaremos uma tabela unificada chamada `ceps` que irá agregar todas as informações relevantes sobre os CEPs e endereços. 

Nos arquivos de leiaute da base DNE Básico, os Correios fornecem um script SQL para consultar os dados de forma unificada, mas o script foi feito para ser utilizado com o Access que vem na base DNE Master. Iremos adaptar esse script para o PostgreSQL. Mas antes, vamos ler as `instruções` fornecidas pelos Correios para criarmos a validação do CEP.

:::info Regras para validação do CEP
__Como utilizar o DNE para validar o CEP__

Normalmente os usuários do DNE querem implantar uma rotina para validação do CEP que recupere automaticamente os dados de endereço de seus clientes. Os clientes da modalidade master poderão simplificar os procedimentos descrito abaixo, gerando  uma nova tabela através da consulta CONCATENA_CEPs disponível no MDB.

Para montar essa rotina iremos utilizar os seguintes arquivos do DNE:

LOG_LOCALIDADE;  
LOG_LOGRADOURO;  
LOG_GRANDE_USUARIO;  
LOG_UNID_OPER;  
LOG_CPC;  

Após o usuário informar o CEP, deve ser adotado os seguintes procedimentos:

1.	Verificar se o CEP existe na tabela LOG_LOCALIDADE.

2.	Se o CEP for encontrado, será retornado a UF(UFE_SG) e o nome da Localidade(LOC_NO). As demais informações(Logradouro, Bairro e Complemento) deverão ser solicitadas ao  usuário. Não será necessário pesquisar outras tabelas, pois trata-se de um CEP de uma localidade não codificada por logradouro -  CEP genérico geral.

3.	Se o CEP não foi encontrado, verificar se o CEP existe na tabela LOG_LOGRADOURO;

4.	Se o CEP for encontrado será retornado a UF(UFE_SG) o nome da Localidade(LOC_NO - relacionamento com LOG_LOCALIDADE), Tipo de Logradouro (TLO_TX), Logradouro( LOG_NO), Dados Adicionais(LOG_COMPLEMENTO), Bairro(BAI_NU_INI  relacionamento com a tabela LOG_BAIRRO, campo BAI_NU). O Complemento (nº casa, lote, apartamento, etc)  deverá ser solicitada ao usuário. 

5.	Se o CEP não foi encontrado, verificar se o CEP existe na tabela LOG_GRANDE_USUARIO;

6.	Se o CEP for encontrado será retornado a UF(UFE_SG) o nome da Localidade(LOC_NO - relacionamento com LOG_LOCALIDADE), Endereço( GRU_ENDERECO), Nome do Grande Usuário(GRU_NO), Bairro(BAI_NU - relacionamento com a tabela LOG_BAIRRO, campo BAI_NU).

7.	Se o CEP não foi encontrado, verificar se o CEP existe na tabela LOG_UNID_OPER;

8.	Se o CEP for encontrado será retornado a UF(UFE_SG) o nome da Localidade(LOC_NO - relacionamento com LOG_LOCALIDADE), Endereço( UOP_ENDERECO), Nome da Unidade dos Correios(UOP_NO), Bairro(BAI_NU - relacionamento com a tabela LOG_BAIRRO, campo BAI_NU);

9.	Se o CEP não foi encontrado, verificar se o CEP existe na tabela LOG_CPC;

10.	Se o CEP for encontrado será retornado a UF(UFE_SG) o nome da Localidade(LOC_NO - relacionamento com LOG_LOCALIDADE), Endereço( CPC_ENDERECO), Nome da CPC(CPC_NO).

11.	Se o CEP não foi encontrado, retornar mensagem de CEP INEXISTENTE.
:::

Juntamente com as instruções, os Correios fornecem o seguinte script SQL para criar a consulta unificada `CONCATENA_CEPs` no Access:

```sql
    select log_logradouro.ufe_sg,  log_localidade.loc_no,  log_bairro.bai_no, log_logradouro.tlo_tx+" " + log_logradouro.log_no as log_no, log_logradouro.cep,  log_logradouro.log_complemento,"" as nome
    from log_logradouro, log_localidade, log_bairro
    where log_logradouro.loc_nu= log_localidade.loc_nu  and log_logradouro.bai_nu_ini=log_bairro.bai_nu and log_logradouro.log_sta_tlo ="s"
union
    select log_logradouro.ufe_sg, log_localidade.loc_no,  log_bairro.bai_no,  log_logradouro.log_no as log_no, log_logradouro.cep,  log_logradouro.log_complemento,"" as nome
    from log_logradouro, log_localidade, log_bairro
    where log_logradouro.loc_nu= log_localidade.loc_nu  and log_logradouro.bai_nu_ini=log_bairro.bai_nu  and log_logradouro.log_sta_tlo ="n"
union 
    SELECT LOC.UFE_SG, LOC.LOC_NO AS LOC_NO, "" AS BAI_NO, "" AS LOG_NO, LOC.CEP, "" AS LOG_COMPLEMENTO, "" AS NOME
    FROM LOG_LOCALIDADE AS LOC
    WHERE LOC.CEP IS NOT NULL
    AND   LOC.LOC_NU_SUB IS NULL
UNION 
    SELECT LOC.UFE_SG, LOCSUB.LOC_NO AS LOC_NO, LOC.LOC_NO AS BAI_NO, "" AS LOG_NO, LOC.CEP, "" AS LOG_COMPLEMENTO, "" AS NOME
    FROM LOG_LOCALIDADE AS LOC, LOG_LOCALIDADE AS LOCSUB
    WHERE LOC.CEP IS NOT NULL
    AND   LOC.LOC_NU_SUB IS NOT NULL
    AND   LOC.LOC_NU_SUB= LOCSUB.LOC_NU
union 
    select log_cpc.ufe_sg, log_localidade.loc_no,"" as  bai_no, log_cpc.cpc_endereco as log_no, log_cpc.cep,"" as log_complemento,cpc_no as nome
    from log_cpc,  log_localidade
    where  log_cpc.loc_nu=log_localidade.loc_nu
union
    select  log_grande_usuario.ufe_sg, log_localidade.loc_no, log_bairro.bai_no as  bai_no,  log_grande_usuario.gru_endereco as log_no,  log_grande_usuario.cep,"" as log_complemento,gru_no as nome
    from log_grande_usuario,  log_localidade, log_bairro
    where  log_grande_usuario.loc_nu=log_localidade.loc_nu and  log_grande_usuario.bai_nu = log_bairro.bai_nu
union
    select  log_unid_oper.ufe_sg, log_localidade.loc_no, log_bairro.bai_no as  bai_no,  log_unid_oper.uop_endereco as log_no, log_unid_oper.cep,"" as log_complemento, uop_no as nome
    from log_unid_oper,  log_localidade, log_bairro
    where  log_unid_oper.loc_nu=log_localidade.loc_nu and  log_unid_oper.bai_nu = log_bairro.bai_nu;
```

Analisando o script, temos 7 consultas unidas por `UNION`, cada uma consultando uma das tabelas mencionadas nas instruções dos Correios. Iremos adotar uma estratégia um pouco diferente, criando uma tabela chamada `ceps` e populando essa tabela com os dados unificados. Dessa forma teremos uma tabela "estática" que poderá ser consultada de forma rápida e eficiente.

No projeto `Correios.DneBasico.Domain`, crie uma enumeração chamada `TipoCep` dentro do diretório `Enums`:

```csharp title="Correios.DneBasico.Domain/Enums/TipoCep.cs"
using System.ComponentModel;

namespace Correios.DneBasico.Domain.Enums;

public enum TipoCep
{
    /// <summary>
    /// Localidade
    /// </summary>
    [Description("Localidade")]
    LOC = 1,

    /// <summary>
    /// Logradouro
    /// </summary>
    [Description("Logradouro")]
    lOG = 2,

    /// <summary>
    /// Grande Usuário
    /// </summary>
    [Description("Grande Usuário")]
    GU = 3,

    /// <summary>
    /// Unidade Operacional
    /// </summary>
    [Description("Unidade Operacional")]
    UOP = 4,

    /// <summary>
    /// Caixa Postal Comunitária
    /// </summary>
    [Description("Caixa Postal Comunitária")]
    CPC = 5
}
```

e em seguida, crie a entidade `Cep` dentro do diretório `Entities`:

```csharp title="Correios.DneBasico.Domain/Entities/Cep.cs"
using Correios.DneBasico.Domain.Enums;

namespace Correios.DneBasico.Domain.Entities;

/// <summary>
/// CEP - Tabela unificada
/// </summary>
public class Cep
{
    /// <summary>
    /// CEP - Código de Endereçamento Postal
    /// </summary>
    public string Codigo { get; set; } = default!;

    /// <summary>
    /// Código do município IBGE
    /// </summary>
    public string Ibge { get; set; } = default!;

    /// <summary>
    /// Município
    /// </summary>
    public string Municipio { get; set; } = default!;

    /// <summary>
    /// Sigla da UF
    /// </summary>
    public string Uf { get; set; } = default!;

    /// <summary>
    /// Bairro
    /// </summary>
    public string? Bairro { get; set; } = default!;

    /// <summary>
    /// Distrito
    /// </summary>
    public string? Distrito { get; set; }

    /// <summary>
    /// Tipo de logradouro
    /// </summary>
    public string? TipoLogradouro { get; set; } = default!;

    /// <summary>
    /// Logradouro
    /// </summary>
    public string? Logradouro { get; set; } = default!;

    /// <summary>
    /// Logradouro completo
    /// </summary>
    public string? LogradouroCompleto { get; set; } = default!;

    /// <summary>
    /// Complemento do logradouro
    /// </summary>
    public string? Complemento { get; set; }

    /// <summary>
    /// Unidade (Grande Usuário ou Unidade Operacional)
    /// </summary>
    public string? Unidade { get; set; } = default!;

    /// <summary>
    /// Indicador de CEP Geral
    /// </summary>
    public bool Geral { get; set; } = default!;

    /// <summary>
    /// Tipo de CEP
    /// </summary>
    public TipoCep Tipo { get; set; } = default!;

    /// <summary>
    /// Latitude
    /// </summary>
    public double? Lat { get; set; } = default!;

    /// <summary>
    /// Longitude
    /// </summary>
    public double? Lng { get; set; } = default!;
}
```

No projeto `Correios.DneBasico.Data`, crie o arquivo de configuração `CepConfiguration` dentro do diretório `Configurations`:

```csharp title="Correios.DneBasico.Data/Configurations/CepConfiguration.cs"
namespace Correios.DneBasico.Data.Configurations;

public class CepConfiguration : IEntityTypeConfiguration<Cep>
{
    public void Configure(EntityTypeBuilder<Cep> builder)
    {
        builder.ToTable("ceps");

        builder.HasKey(c => c.Codigo);

        builder.Property(c => c.Codigo)
            .HasColumnName("codigo")
            .IsRequired()
            .HasMaxLength(8);

        builder.Property(c => c.Ibge)
            .IsRequired()
            .HasColumnName("ibge")
            .HasMaxLength(7);

        builder.Property(c => c.Municipio)
            .HasColumnName("municipio")
            .IsRequired()
            .HasMaxLength(72);

        builder.Property(c => c.Uf)
            .HasColumnName("uf")
            .IsRequired()
            .HasMaxLength(2);

        builder.Property(c => c.Bairro)
            .HasColumnName("bairro")
            .HasMaxLength(72);

        builder.Property(c => c.Distrito)
            .HasColumnName("distrito")
            .HasMaxLength(72);

        builder.Property(c => c.TipoLogradouro)
            .HasColumnName("tipo_logradouro")
            .HasMaxLength(36);

        builder.Property(c => c.Logradouro)
            .HasColumnName("logradouro")
            .HasMaxLength(100);

        builder.Property(c => c.LogradouroCompleto)
            .HasColumnName("logradouro_completo")
            .HasMaxLength(100);

        builder.Property(c => c.Complemento)
            .HasColumnName("complemento")
            .HasMaxLength(100);

        builder.Property(c => c.Unidade)
            .HasColumnName("unidade")
            .HasMaxLength(100);

        builder.Property(c => c.Geral)
            .HasColumnName("geral")
            .IsRequired();

        builder.Property(c => c.Tipo)
            .HasColumnName("tipo")
            .IsRequired();

        builder.Property(c => c.Lat)
            .HasColumnName("lat")
            .HasPrecision(10, 8);

        builder.Property(c => c.Lng)
            .HasColumnName("lng")
            .HasPrecision(11, 8);
    }
}
```

A estrutura da tabela `ceps` ficará com os seguintes campos:

| Campo                | Tipo         | Descrição                                                                                            |
|:---------------------|--------------|------------------------------------------------------------------------------------------------------|
| codigo               | varchar(8)   | Código de Endereçamento Postal (CEP)                                                                 |
| ibge                 | varchar(7)   | Código do município IBGE                                                                             |
| municipio            | varchar(72)  | Nome do município                                                                                    |
| uf                   | varchar(2)   | Sigla da Unidade Federativa                                                                          |
| bairro               | varchar(72)  | Nome do bairro                                                                                       |
| distrito             | varchar(72)  | Nome do distrito e/ou povoado                                                                        |
| tipo_logradouro      | varchar(36)  | Tipo do logradouro                                                                                   |
| logradouro           | varchar(100) | Nome do logradouro                                                                                   |
| logradouro_completo  | varchar(100) | Nome completo do logradouro                                                                          |
| complemento          | varchar(100) | Complemento do logradouro                                                                            |
| unidade              | varchar(100) | Nome da unidade (Grande Usuário ou Unidade Operacional)                                              |
| geral                | boolean      | Indicador de CEP Geral (true/false)                                                                  |
| tipo                 | integer      | Tipo de CEP (Enum: Geral, Logradouro, Grande Usuário, Unidade Operacional, Caixa Postal Comunitária) |

No arquivo `DneBasicoDbContext.cs`, adicione a propriedade DbSet para a entidade `Cep`:

```csharp title="Correios.DneBasico.Data/Contexts/DneBasicoDbContext.cs"
public DbSet<Cep> Ceps { get; set; } = default!;
```

Agora, crie uma nova migração para adicionar a tabela `ceps` ao banco de dados:

```bash
dotnet-ef migrations add CreateCepsTable
```

No nosso projeto `Correios.DneBasico.Importer`, iremos adicionar um método para popular a tabela `ceps` com os dados unificados. Adicione o seguinte método na classe `EdneImporter`:

```csharp title="Correios.DneBasico.Importer/EdneImporter.cs"
public async Task PovoarTabelaUnificadaAsync()
{
    Console.WriteLine($"==========================================================");
    Console.WriteLine($"POVOANDO TABELA UNIFICADA");
    Console.WriteLine($"==========================================================");

    string sql = """
    INSERT INTO ceps (codigo, ibge, municipio, uf, bairro, distrito, tipo_logradouro, logradouro, logradouro_completo, complemento, unidade, geral, tipo)
    SELECT 
    				  codigo, ibge, municipio, uf, bairro, distrito, tipo_logradouro, logradouro, logradouro_completo, complemento, unidade, geral, tipo
    FROM (

     	SELECT localidades.loc_cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, localidades.ufe_sg as uf, NULL as bairro, 
    	NULL as distrito, NULL as tipo_logradouro, 
    	NULL as logradouro, NULL as logradouro_completo, NULL as complemento, TRUE as geral, NULL as unidade, 1 as tipo
    	FROM localidades
    	WHERE localidades.loc_cep IS NOT NULL AND loc_nu_sub IS NULL

    	UNION

    	SELECT localidades.loc_cep as codigo, localidadesSub.mun_nu as ibge, localidadesSub.loc_no as municipio, localidades.ufe_sg as uf, NULL as bairro, 
    	CASE WHEN localidades.loc_in_tipo_loc = 1 OR localidades.loc_in_tipo_loc = 3 THEN localidades.loc_no ELSE NULL END as distrito, NULL as tipo_logradouro, 
    		NULL as logradouro, NULL as logradouro_completo, NULL as complemento, TRUE as geral, NULL as unidade, 1 as tipo
    	FROM localidades, localidades localidadesSub
    	WHERE localidades.loc_cep IS NOT NULL AND localidades.loc_nu_sub IS NOT NULL
    	AND localidades.loc_nu_sub = localidadesSub.loc_nu

    UNION

    	SELECT logradouros.cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, logradouros.ufe_sg as uf, bairros.bai_no as bairro, NULL as distrito, logradouros.tlo_tx as tipo, 
    	logradouros.log_no as municipio, (logradouros.tlo_tx || ' ' || logradouros.log_no) as logradouro_completo,  logradouros.log_complemento as complemento, FALSE as geral, NULL as unidade, 2 as tipo
    	FROM logradouros, localidades, bairros
    	WHERE logradouros.loc_nu = localidades.loc_nu  and logradouros.bai_nu_ini = bairros.bai_nu and logradouros.log_sta_tlo ='S'

    	UNION

    	SELECT logradouros.cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, logradouros.ufe_sg as uf, bairros.bai_no as bairro, NULL as distrito, logradouros.tlo_tx as tipo, 
    	logradouros.log_no as municipio, (logradouros.log_no) as logradouro_completo,  logradouros.log_complemento as complemento, FALSE as geral, NULL as unidade, 2 as tipo
    	FROM logradouros, localidades, bairros
    	WHERE logradouros.loc_nu = localidades.loc_nu and logradouros.bai_nu_ini = bairros.bai_nu and logradouros.log_sta_tlo ='N'

    UNION
    	SELECT grandes_usuarios.cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, localidades.ufe_sg as uf, bairros.bai_no as bairro, NULL as distrito, logradouros.tlo_tx as tipo, 
    	logradouros.log_no as logradouro, (grandes_usuarios.gru_endereco) as logradouro_completo, NULL as complemento, FALSE as geral, grandes_usuarios.gru_no as unidade, 3 as tipo
    	FROM grandes_usuarios grandes_usuarios
    	join localidades ON localidades.loc_nu = grandes_usuarios.loc_nu
    	join bairros ON bairros.bai_nu = grandes_usuarios.bai_nu
    	left join logradouros ON logradouros.log_nu = grandes_usuarios.log_nu
    	WHERE localidades.mun_nu IS NOT NULL

    	UNION

    	SELECT grandes_usuarios.cep as codigo, localidadesSub.mun_nu as ibge, localidadesSub.loc_no as municipio, localidadesSub.ufe_sg as uf, bairros.bai_no as bairro, 
    	CASE  WHEN localidades.loc_in_tipo_loc = 1 OR localidades.loc_in_tipo_loc = 3 THEN localidades.loc_no ELSE NULL END as distrito, logradouros.tlo_tx as tipo, logradouros.LOG_NO as logradouro, 
    		(grandes_usuarios.gru_endereco) as logradouro_completo, NULL as complemento, FALSE as geral, grandes_usuarios.gru_no as unidade, 3 as tipo
    	FROM grandes_usuarios grandes_usuarios
    	join localidades ON localidades.loc_nu = grandes_usuarios.loc_nu
    	join localidades localidadesSub ON localidadesSub.loc_nu = localidades.loc_nu_sub
    	join bairros ON bairros.bai_nu = grandes_usuarios.bai_nu
    	left join logradouros ON logradouros.log_nu = grandes_usuarios.log_nu
    	WHERE localidades.loc_nu_sub IS NOT NULL 

    UNION

    	SELECT unidades_operacionais.cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, localidades.ufe_sg as uf, bairro.bai_no as bairro, NULL as distrito, logradouro.tlo_tx as tipo, logradouro.log_no as logradouro, 
    		(unidades_operacionais.UOP_ENDERECO) as logradouro_completo, NULL as complemento, FALSE as geral, unidades_operacionais.uop_no as unidade, 4 as tipo
    	FROM unidades_operacionais 
    	join localidades ON localidades.loc_nu = unidades_operacionais.loc_nu
    	join bairros bairro ON bairro.bai_nu = unidades_operacionais.bai_nu
    	left join logradouros logradouro ON logradouro.log_nu = unidades_operacionais.log_nu
    	WHERE localidades.mun_nu IS NOT NULL

    	UNION

    	SELECT unidades_operacionais.cep as codigo, localidadesSub.mun_nu as ibge, localidadesSub.loc_no as municipio, localidadesSub.ufe_sg as uf, bairros.bai_no as bairro, 
    	CASE  WHEN localidades.loc_in_tipo_loc = 1 OR localidades.loc_in_tipo_loc = 3 THEN localidades.loc_no ELSE NULL END as distrito, logradouros.tlo_tx as tipo, logradouros.LOG_NO as logradouro, 
    		(unidades_operacionais.UOP_ENDERECO) as logradouro_completo, NULL as complemento, FALSE as geral, unidades_operacionais.uop_no as unidade, 4 as tipo
    	FROM unidades_operacionais
    	join localidades ON localidades.loc_nu = unidades_operacionais.loc_nu
    	join localidades localidadesSub ON localidadesSub.loc_nu = localidades.loc_nu_sub
    	join bairros ON bairros.bai_nu = unidades_operacionais.bai_nu
    	left join logradouros ON logradouros.log_nu = unidades_operacionais.log_nu
    	WHERE localidades.loc_nu_sub IS NOT NULL

    UNION

    	SELECT cpc.cep as codigo, localidades.mun_nu as ibge, localidades.loc_no as municipio, localidades.ufe_sg as uf, NULL as bairro, NULL as distrito, NULL as tipo, NULL as logradouro, 
    		(cpc.cpc_endereco) as logradouro_completo, NULL as complemento, FALSE as geral, cpc.cpc_no as unidade, 5 as tipo
    	FROM caixas_postais_comunitarias cpc
    	join localidades ON localidades.loc_nu = cpc.loc_nu
    	WHERE localidades.mun_nu IS NOT NULL 

    	UNION

    	SELECT cpc.cep as codigo, localidadesSub.mun_nu as ibge, localidadesSub.loc_no as municipio, localidadesSub.ufe_sg as uf, NULL as bairro, 
    	CASE  WHEN localidades.loc_in_tipo_loc = 1 OR localidades.loc_in_tipo_loc = 3 THEN localidades.loc_no ELSE NULL END as distrito, NULL as tipo, NULL as logradouro, 
    		(cpc.cpc_endereco) as logradouro_completo, NULL as complemento, FALSE as geral, cpc.cpc_no as unidade, 5 as tipo
    	FROM caixas_postais_comunitarias cpc
    	join localidades localidades ON localidades.loc_nu = cpc.loc_nu
    	join localidades localidadesSub ON localidadesSub.loc_nu = localidades.loc_nu_sub
    	WHERE localidades.loc_nu_sub IS NOT NULL
    ) as dne
    ORDER BY codigo
    """;

    var watch = Stopwatch.StartNew();

    using var scope = _serviceProvider.CreateScope();
    using var context = scope.ServiceProvider.GetRequiredService<DneBasicoDbContext>();
    context.Database.SetCommandTimeout(0);
    context.Database.ExecuteSqlRaw(sql);

    Console.WriteLine("TABELA CEP POVOADA COM OS DADOS DO E-DNE.");

    watch.Stop();

    TimeSpan t = TimeSpan.FromMilliseconds(watch.ElapsedMilliseconds);
    string answer = string.Format("{0:D2}h:{1:D2}m:{2:D2}s:{3:D3}ms",
                            t.Hours,
                            t.Minutes,
                            t.Seconds,
                            t.Milliseconds);

    Console.WriteLine($"Tempo de execução: {answer}");
}
```

No arquivo `Program.cs` do projeto `Correios.DneBasico.Importer`, após a importação dos arquivos TXT e antes da chamada para parar o cronômetro `watch.Stop()`, chame o método `PovoarTabelaUnificadaAsync`:

```csharp title="Correios.DneBasico.Importer/Program.cs"
await edne.PovoarTabelaUnificadaAsync();
```

Execute novamente o projeto `Correios.DneBasico.Importer`. A tabela `ceps` será criada e populada com os dados unificados.

![Tabela unificada](../../../static/img/blog/estrutura-base-dados-cep/tabela-unificada.png)


## Conclusão
Neste artigo, criamos um importador para a base DNE Básico dos Correios, utilizando C#, EF Core e PostgreSQL. Passamos por todo o processo de configuração do projeto, criação das entidades e mapeamentos, importação dos dados e criação de uma tabela unificada para facilitar as consultas de CEPs e endereços. Nosso próximo passo será criar uma API para consultar esses dados. Fique ligado para o próximo artigo da série!

## Outros artigos desta série
- [Estrutura da Base de CEPs dos Correios - parte 1 de 3](../edne-estrutura-da-base-de-ceps-dos-correios-parte-1)

## Código Fonte
O código fonte completo deste projeto está disponível no GitHub: [Correios.DneBasico](https://github.com/danielcorvello/Correios.DneBasico)

## Referências
- [Correios - Marketing Direto](https://www.correios.com.br/enviar/marketing-direto/marketing) 
- [Wikipédia - Código de Endereçamento Postal](https://pt.wikipedia.org/wiki/C%C3%B3digo_de_Endere%C3%A7amento_Postal) 
- [Correios - Tudo sobre CEP](https://www.correios.com.br/enviar/precisa-de-ajuda/tudo-sobre-cep) 
- [ViaCEP - Consulta CEP](https://viacep.com.br/)

## Changelog
| Data         |                    Atualização                    |
| :----------- | :---------------------------------------------- | 
| 23/12/2025 | Ajuste das nomenclaturas subordinada / subordinação. |