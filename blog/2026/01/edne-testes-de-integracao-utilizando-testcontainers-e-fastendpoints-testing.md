---
slug: edne-testes-de-integracao-utilizando-testcontainers-e-fastendpoints-testing
title: "e-DNE - Testes de Integração utilizando Testcontainers e FastEndpoints.Testing"
authors: ["corvello"]
date: 2026-01-19
tags: ["correios", "ceps", "banco-de-dados", "dotnet", "fastendpoints", "vsa", "testcontainers", "testes-de-integracao", "x-unit", "shouldly"]
draft: false
toc_max_heading_level: 3
image: /img/blog/edne-testes-de-integracao/og-edne-integration-test.png
---

# e-DNE - Testes de Integração utilizando Testcontainers e FastEndpoints.Testing
Neste artigo, vamos explorar como implementar testes de integração utilizando as bibliotecas [Testcontainers](https://dotnet.testcontainers.org/), [FastEndpoints.Testing](https://fast-endpoints.com/docs/integration-unit-testing#integration-testing), [xUnit](https://xunit.net/) e [Shouldly](https://docs.shouldly.org/) no nosso projeto [e-DNE](../edne-estrutura-da-base-de-ceps-dos-correios-parte-1), uma API RESTful desenvolvida em .NET com [FastEndpoints](https://fast-endpoints.com/docs/) para consulta de endereços via CEP, integrada a um banco de dados PostgreSQL. O código fonte completo deste projeto está disponível no GitHub: [Correios.DneBasico](https://github.com/danielcorvello/Correios.DneBasico)
<!-- truncate -->

## Introdução ao Testcontainers
[Testcontainers](https://dotnet.testcontainers.org/) é uma biblioteca que facilita a criação e o gerenciamento de containers Docker para testes automatizados. Ela permite que você crie ambientes de teste isolados, garantindo que seus testes sejam executados em condições controladas e reproduzíveis. Podemos utilizar os módulos pré-construídos para bancos de dados, como PostgreSQL, ou criar containers personalizados conforme necessário.

## Pré-Configuração do Projeto
Para começar, certifique-se de que você tenha o Docker instalado e em execução na sua máquina e faça um clone do repositório do projeto e crie uma branch para testes de integração a partir da tag `v1.0.0`. Você pode fazer isso executando os seguintes comandos no terminal:

```bash
# Clone o repositório
git clone https://github.com/danielcorvello/Correios.DneBasico.git
# Acesse o diretório do projeto
cd Correios.DneBasico
# Crie e acesse a branch de testes de integração a partir da v1.0.0
git checkout -b testes-integracao v1.0.0
```

Iremos atualizar alguns pacotes nos projeto da API para aproveitarmos de algumas melhorias e correções introduzidas nas versões mais recentes. No projeto `Correios.DneBasico.Api`, atualize os seguintes pacotes para as versões indicadas:
- FastEndpoints 7.2.0
- FastEndpoints.Swagger 7.2.0
- MicroElements.NSwag.FluentValidation 7.0.3

```bash
dotnet add package FastEndpoints --version 7.2.0
dotnet add package FastEndpoints.Swagger --version 7.2.0
dotnet add package MicroElements.NSwag.FluentValidation --version 7.0.3
```

## Criando o projeto de Testes de Integração
Vamos criar um novo projeto de testes de integração utilizando xUnit. No Visual Studio, adicione um novo projeto do tipo "xUnit.net v3 Test Project" à solução e nomeie-o como `Correios.DneBasico.Api.IntegrationTests`. 

:::info
Caso você não esteja visualizando a opção de projeto "xUnit.net v3 Test Project", use o seguinte comando no terminal para instalar o template globalmente:

```bash
dotnet new install xunit.v3.templates
```
:::

Em seguida, adicione as seguintes referências de projeto e pacotes NuGet:
- Referência ao projeto `Correios.DneBasico.Api`
- Refência ao projeto `Correios.DneBasico.Importer`
- Testcontainers.PostgreSql 4.10.0
- FastEndpoints.Testing 7.2.0
- Shouldly 4.3.0

```bash
dotnet add package Testcontainers.PostgreSql --version 4.10.0
dotnet add package FastEndpoints.Testing --version 7.2.0
dotnet add package Shouldly --version 4.3.0
```

Para poupar algumas repetições de `using` em nossos testes, crie um arquivo chamado `Global.Usings.cs` no projeto de testes com o seguinte conteúdo:

```csharp title="Global.Usings.cs"
global using Correios.DneBasico.Api.Constants;
global using Correios.DneBasico.Api.IntegrationTests.Setup;
global using Correios.DneBasico.Api.Models;
global using FastEndpoints;
global using FastEndpoints.Testing;
global using Shouldly;
global using System.Net;
global using System.Net.Http.Json;
global using System.Text;
```

No projeto de testes, crie um diretório chamado `Setup` e adicione uma classe chamada `Sut.cs` que será responsável por configurar o ambiente de testes, incluindo a inicialização do container PostgreSQL e a preparação do banco de dados.

```csharp title="Setup/Sut.cs"
using Correios.DneBasico.Data.Contexts;
using FastEndpoints.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using Testcontainers.PostgreSql;

namespace Correios.DneBasico.Api.IntegrationTests.Setup;

public class Sut : AppFixture<Program>
{
    private PostgreSqlContainer? postgreSqlContainer;

    protected readonly CancellationToken CancellationToken = TestContext.Current.CancellationToken;

    protected override async ValueTask PreSetupAsync()
    {
        postgreSqlContainer = new PostgreSqlBuilder("postgres:16")
            .WithDatabase("dnebasico_tests")
            .WithUsername("db")
            .WithPassword("db")
            .Build();

        await postgreSqlContainer.StartAsync();

        var connectionString = postgreSqlContainer.GetConnectionString();

        Environment.SetEnvironmentVariable("ConnectionStrings__eDne", connectionString);

        var serviceCollection = new ServiceCollection();

        serviceCollection.AddDbContext<DneBasicoDbContext>(options =>
            options.UseNpgsql(connectionString));

        using var serviceProvider = serviceCollection.BuildServiceProvider();
        using var dbContext = serviceProvider.GetRequiredService<DneBasicoDbContext>();
        await dbContext.Database.MigrateAsync();        
    }
}

public class SutCollection : TestCollection<Sut>;
```

Essa é a configuração necessária para criarmos nosso `System Under Test (SUT)` que será utilizado em nossos testes de integração. Reparem que não foi necessário adicionarmos nenhuma configuração adicional na API para suportar os testes, tudo foi feito de forma transparente utilizando o [`FastEndpoints.Testing`](https://fast-endpoints.com/docs/integration-unit-testing#integration-testing).

 A `FastEndpoints.Testing` facilita a criação de testes para endpoints FastEndpoints abstraindo boa parte da complexidade envolvida na configuração do ambiente de teste. A classe `AppFixture`, da qual nossa classe `Sut` herda, se encarrega de inicializar nossa `WebApplicationFactory` e configurar o ambiente de teste para que possamos enviar requisições HTTP diretamente para nossos endpoints, ao mesmo tempo que expõe, via `override`, métodos para que possamos personalizar o comportamento do ambiente de teste, como fizemos no método `PreSetupAsync`.

 Dentro do método `PreSetupAsync`, criamos e iniciamos o container PostgreSQL utilizando o Testcontainers, configuramos a string de conexão como uma variável de ambiente (para que a API possa utilizá-la) e aplicamos as migrações do Entity Framework para garantir que o banco de dados esteja no estado esperado para os testes. A seguir, iremos modificar o nosso projeto de importação para que possamos utilizar a lógica de importação de dados em nossos testes de integração.


## Modificando o Projeto de Importação
No projeto `Correios.DneBasico.Importer`, modifique a classe `EdneImporter` adicionando um novo método assíncrono chamado `ImportarTudoAsync`

```csharp title="EdneImporter.cs"
//...
public async Task ImportarTudoAsync()
{
    ImportarArquivoCsv<Pais, PaisMap>("ECT_PAIS.TXT");
    ImportarArquivoCsv<FaixaCepEstado, FaixaCepEstadoMap>("LOG_FAIXA_UF.TXT");
    ImportarArquivoCsv<Localidade, LocalidadeMap>("LOG_LOCALIDADE.TXT");
    ImportarArquivoCsv<VariacaoLocalidade, VariacaoLocalidadeMap>("LOG_VAR_LOC.TXT");
    ImportarArquivoCsv<FaixaCepLocalidade, FaixaCepLocalidadeMap>("LOG_FAIXA_LOCALIDADE.TXT");
    ImportarArquivoCsv<Bairro, BairroMap>("LOG_BAIRRO.TXT");
    ImportarArquivoCsv<VariacaoBairro, VariacaoBairroMap>("LOG_VAR_BAI.TXT");
    ImportarArquivoCsv<FaixaCepBairro, FaixaCepBairroMap>("LOG_FAIXA_BAIRRO.TXT");
    ImportarArquivoCsv<CaixaPostalComunitaria, CaixaPostalComunitariaMap>("LOG_CPC.TXT");
    ImportarArquivoCsv<FaixaCaixaPostalComunitaria, FaixaCaixaPostalComunitariaMap>("LOG_FAIXA_CPC.TXT");
    ImportarArquivoCsv<Logradouro, LogradouroMap>("LOG_LOGRADOURO_**.TXT");
    ImportarArquivoCsv<FaixaNumericaSeccionamento, FaixaNumericaSeccionamentoMap>("LOG_NUM_SEC.TXT");
    ImportarArquivoCsv<GrandeUsuario, GrandeUsuarioMap>("LOG_GRANDE_USUARIO.TXT");
    ImportarArquivoCsv<UnidadeOperacional, UnidadeOperacionalMap>("LOG_UNID_OPER.TXT");
    ImportarArquivoCsv<FaixaCaixaPostalUop, FaixaCaixaPostalUopMap>("LOG_FAIXA_UOP.TXT");

    await PovoarTabelaUnificadaAsync();
}
```
No arquivo `Program.cs` do Importer, substitua as chamadas para o método `ImportarArquivoCsv` e para `PovoarTabelaUnificadaAsync` pelo novo método `ImportarTudoAsync`:

```csharp title="Program.cs"
//...
var edne = new EdneImporter(serviceProvider);
await edne.ImportarTudoAsync();
//...
```

Iremos reutilizar essa lógica de importação em nossos testes de integração para garantir que o banco de dados esteja populado com os dados necessários antes da execução dos testes.

No projeto de testes, no arquivo `Sut.cs`, adicione o seguinte código ao final do método `PreSetupAsync`, logo após a aplicação das migrações:

```csharp title="Setup/Sut.cs"
var edneImporter = new EdneImporter(serviceProvider);
await edneImporter.ImportarTudoAsync();
```
Isso garantirá que o banco de dados esteja populado com os dados do e-DNE antes da execução dos testes de integração.

:::warning
Lembre-se de que a importação dos dados pode levar algum tempo! Sempre que algum teste for executado, o banco de dados será recriado e os dados serão importados novamente.

Em nosso projeto, nossos enpoints são todos de leitura, e, para `FINS DIDÁTICOS`, podemos nos dar ao luxo de esperar o tempo necessário para a importação dos dados para que os testes sejam executados em um ambiente consistente e com dados reais.

Em cenários mais complexos, onde o tempo de importação dos dados seja um fator crítico, uma abordagem alternativa seria criar um snapshot do banco de dados já populado e restaurá-lo antes da execução dos testes, ou, se possível, realizar os testes contra o banco de dados vazio, criando apenas os dados necessários para cada teste específico.
:::

:::important
No projeto da API `Correios.DneBasico.Api`, no arquivo `Program.cs`, inclua a seguinte linha no final do arquivo, após app.Run();

```csharp title="Correios.DneBasico.Api/Program.cs"
// Necessário para testes de integração
public partial class Program { } 
```
Essa linha cria uma classe parcial `Program` que é necessária para que o `WebApplicationFactory` utilizado pela `FastEndpoints.Testing` possa localizar o ponto de entrada da aplicação durante os testes de integração.
:::

## Implementando os Testes de Integração
Agora que temos o ambiente de testes configurado, podemos começar a implementar nossos primeiros testes de integração. Iremos começar pelo endpoint de consulta de Bairros. Crie um diretório chamado `Features` no projeto de testes e, dentro dele, crie outro diretório chamado `Bairros`. Em seguida, adicione uma classe chamada `GetBairrosEndpointTests.cs` com o seguinte conteúdo:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
using Correios.DneBasico.Api.Features.Bairros;

namespace Correios.DneBasico.Api.IntegrationTests.Features.Bairros;

[Collection<SutCollection>]
public class GetBairrosEndpointTests(Sut sut) : TestBase
{
    // Testes para o endpoint GET /bairros   
}
```

Dentro dessa classe, vamos testar o endpoint `GET /bairros` para garantir que ele esteja funcionando corretamente. Realizaremos as seguintes verificações:
1. Endpoint deve retornar uma lista de bairros paginada.
2. Endpoint deve retornar a lista ordenada.
3. Endpoint deve retornar um bairro específico quando filtrado pelo nome.
4. Endpoint deve retornar um bairro específico quando filtrado pela localidade.
5. Endpoint deve retornar um erro 400 quando o filtro é inválido.
6. Endpoint deve retornar um erro 400 quando a paginação é inválida.
7. Endpoint deve retornar um erro 400 quando a ordenação é inválida.

### Teste 1: Lista de bairros paginada

O endpoint `GetBairrosEndpoint` recebe uma requisição do tipo `GetBairrosRequest` que contém os parâmetros de paginação, ordenação e filtros. O endpoint retorna uma resposta do tipo `PagedResponse<GetBairrosResponse>`, que contém a lista de bairros paginada, juntamente com informações sobre a paginação. Vamos incluir o seguinte teste na classe `GetBairrosEndpointTests` para verificar se o endpoint retorna os bairros paginados corretamente:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar os bairros paginados (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Bairros_Paginados_FastEndpoints()
{
    var pageNumber = 1;
    var pageSize = 10;

    var request = new GetBairrosRequest()
    {
        PageNumber = pageNumber,
        PageSize = pageSize
    };

    var (response, bairros) = await sut.Client
        .GETAsync<GetBairrosEndpoint, GetBairrosRequest, PagedResponse<GetBairrosResponse>>(request);

    // Assert
    response.EnsureSuccessStatusCode();

    bairros.ShouldNotBeNull();
    bairros.Data.Count.ShouldBeGreaterThan(0);
    bairros.Data.Count.ShouldBeLessThanOrEqualTo(10);
    bairros.Data.ShouldNotBeNull();
    bairros.TotalCount.ShouldBeGreaterThan(0);
    bairros.TotalPages.ShouldBeGreaterThan(0);
    bairros.PageNumber.ShouldBe(pageNumber);
    bairros.PageSize.ShouldBe(pageSize);
}
```
Esse teste envia uma requisição para o endpoint `GET /bairros` com os parâmetros de paginação definidos e verifica se a resposta contém a lista de bairros paginada corretamente. Novamente, utilizamos o método `GETAsync` fornecido pela `FastEndpoints.Testing` (O `Verbo GET` é maiúsculo, diferenciando do método `GetAsync` da classe `HttpClient`) para enviar a requisição e obter a resposta de forma simplificada. O método utilizado recebe como parâmetros o tipo do endpoint (`GetBairrosEndpoint`), o tipo da requisição (`GetBairrosRequest`) e o tipo da resposta esperada (`PagedResponse<GetBairrosResponse>`) como genéricos e a requisição (`GetBairrosRequest`) como argumento. O retorno é uma tupla contendo a resposta HTTP e o objeto de resposta desserializado. 

Novamente, FastEndpoints.Testing abstrai boa parte da complexidade envolvida na configuração do ambiente de teste e no envio das requisições, permitindo que foquemos na lógica dos testes em si. Em casos onde a abstração não seja suficiente, ainda é possível utilizar o `HttpClient` diretamente para enviar as requisições. Veja o mesmo teste implementado utilizando o `HttpClient` diretamente:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar os bairros paginados")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Bairros_Paginados_HttpClient()
{
    var pageNumber = 1;
    var pageSize = 10;

    var url = new StringBuilder();
    url.Append($"{ApiConstants.RouteNames.BAIRROS}?");
    url.Append($"{ApiConstants.RouteNames.PAGE_NUMBER_QUERY}={pageNumber}&");
    url.Append($"{ApiConstants.RouteNames.PAGE_SIZE_QUERY}={pageSize}");

    // Arrange & Act
    var request = new HttpRequestMessage(HttpMethod.Get, url.ToString());
    var response = await sut.Client.SendAsync(request, sut.Cancellation);

    // Assert
    response.EnsureSuccessStatusCode();

    var bairros = await response.Content.ReadFromJsonAsync<PagedResponse<GetBairrosResponse>>(cancellationToken: sut.Cancellation);
    bairros.ShouldNotBeNull();
    bairros.Data.Count.ShouldBeGreaterThan(0);
    bairros.Data.Count.ShouldBeLessThanOrEqualTo(10);
    bairros.Data.ShouldNotBeNull();
    bairros.TotalCount.ShouldBeGreaterThan(0);
    bairros.TotalPages.ShouldBeGreaterThan(0);
    bairros.PageNumber.ShouldBe(pageNumber);
    bairros.PageSize.ShouldBe(pageSize);
}
```

:::info
Note que, ao utilizar o `HttpClient` diretamente, precisamos construir a URL da requisição manualmente, criar o objeto `HttpRequestMessage`, enviar a requisição e desserializar a resposta. Embora essa abordagem funcione perfeitamente, ela envolve mais código e complexidade em comparação com o uso da `FastEndpoints.Testing`. A escolha entre as duas abordagens dependerá das necessidades específicas do seu projeto e do nível de abstração desejado.
:::

Antes de rodar esses testes, inclua as seguintes constantes para `RouteNames` no arquivo `ApiConstants.cs` para facilitar a construção das URLs:

```csharp title="Constants/ApiConstants.cs"
public const string PAGE_SIZE_QUERY = "pageSize";
public const string PAGE_NUMBER_QUERY = "pageNumber";
public const string FILTER_QUERY = "filter";
public const string ORDERBY_QUERY = "orderBy";
```

### Teste 2: Lista ordenada
Agora, vamos adicionar um teste para verificar se o endpoint retorna a lista de bairros ordenada corretamente:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar a lista de bairros ordenada por id (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Lista_De_Bairros_Ordenada_Por_Id_FastEndpoints()
{
    var orderBy = "Id desc";

    var request = new GetBairrosRequest()
    {
        OrderBy = orderBy,
        PageNumber = 1,
        PageSize = 20
    };

    var (response, bairros) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, PagedResponse<GetBairrosResponse>>(request);

    // Assert     
    response.EnsureSuccessStatusCode();
    bairros.ShouldNotBeNull();
    bairros.Data.Count.ShouldBeGreaterThan(0);

    var bairrosOrdenados = bairros.Data.OrderByDescending(b => b.Id).ToList();
    bairros.Data.ShouldBe(bairrosOrdenados);
}
```
Realizamos um teste para verificar a ordenação dos bairros pelo Id. No teste, enviamos uma requisição para o endpoint `GET /bairros` com o parâmetro de ordenação definido e verificamos se a lista retornada está ordenada corretamente.

### Teste 3: Filtro por nome
Vamos adicionar um teste para verificar se o endpoint retorna o bairro correto quando filtrado pelo nome:
```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar os bairros de acordo com o filtro (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Bairros_De_Acordo_Com_O_Filtro_FastEndpoints()
{
    var filter = "Nome=*Centro";
    var request = new GetBairrosRequest()
    {
        Filter = filter,
        PageNumber = 1,
        PageSize = 100
    };

    var (response, bairros) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, PagedResponse<GetBairrosResponse>>(request);

    // Assert
    response.EnsureSuccessStatusCode();
    bairros.ShouldNotBeNull();
    bairros.Data.Count.ShouldBeGreaterThan(0);
    bairros.Data.ShouldAllBe(b => b.Nome.Contains("Centro", StringComparison.OrdinalIgnoreCase));
}
```
Esse teste envia uma requisição para o endpoint `GET /bairros` com um filtro que busca bairros cujo nome contenha a palavra "Centro". Em seguida, verificamos se todos os bairros retornados na resposta atendem ao critério de filtro.

### Teste 4: Filtro por localidade
Vamos adicionar um teste para verificar se o endpoint retorna os bairros corretos quando filtrado pela localidade:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar os bairros de acordo com o filtro de localidade (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Bairros_De_Acordo_Com_O_Filtro_De_Localidade_FastEndpoints()
{
    var localidadeId = 9703; // Id da localidade Suzano/SP

    var filter = $"LocalidadeId={localidadeId}";

    var request = new GetBairrosRequest()
    {
        Filter = filter
    };

    var (response, bairros) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, PagedResponse<GetBairrosResponse>>(request);

    // Assert
    response.EnsureSuccessStatusCode();
    bairros.ShouldNotBeNull();
    bairros.Data.Count.ShouldBeGreaterThan(0);
    bairros.Data.ShouldAllBe(b => b.LocalidadeId == localidadeId);
}
```

Esse teste envia uma requisição para o endpoint `GET /bairros` com um filtro que busca bairros pertencentes à localidade com o ID especificado. Em seguida, verificamos se todos os bairros retornados na resposta pertencem à localidade correta.

### Teste 5: Filtro inválido
Vamos adicionar um teste para verificar se o endpoint retorna um erro 400 quando o filtro é inválido:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar erro 400 para propriedade inválida no filtro (FastEndpoints)")]    
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Erro_400_Para_Filtro_Invalido_FastEndpoints()
{
    var filter = "PropriedadeInexistente=0";

    var request = new GetBairrosRequest()
    {
        Filter = filter
    };

    var (response, res) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, ErrorResponse>(request);

    // Assert
    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    res.Errors.ShouldAllBe(e => e.Value.Contains(ApiConstants.GRIDYFY_INVALID_QUERY));
}
```

Este teste envia uma requisição para o endpoint `GET /bairros` com um filtro que utiliza uma propriedade inexistente. Em seguida, verificamos se a resposta retorna um status code 400 (Bad Request) e se a mensagem de erro está correta. Atualmente a mensagem de erro retornada pelo Gridify é genérica pois o GridiFy `v2.17.2` apenas retorna `true` ou `false` para indicar se a query é válida ou não, sem fornecer detalhes adicionais sobre o erro. Em breve, conforme podemos ver no [repositório do Gridify](https://github.com/alirezanet/Gridify), teremos a possibilidade de obter mensagens de erro mais detalhadas, o que permitirá melhorar a assertiva deste teste :rocket:.

### Teste 6: Paginação inválida
Vamos adicionar um teste para verificar se o endpoint retorna um erro 400 quando a paginação é inválida:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar erro 400 para paginação inválida (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Erro_400_Para_Paginacao_Invalida_FastEndpoints()
{
    var request = new GetBairrosRequest()
    {
        PageNumber = 0,
        PageSize = -5
    };

    var (response, res) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, ErrorResponse>(request);

    // Assert
    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    res.Errors.ShouldContainKey(ApiConstants.RouteNames.PAGE_NUMBER_QUERY);
    res.Errors.ShouldContainKey(ApiConstants.RouteNames.PAGE_SIZE_QUERY);
}
```

Este teste envia uma requisição para o endpoint `GET /bairros` com valores inválidos para os parâmetros de paginação (número da página e tamanho da página). Em seguida, verificamos se a resposta retorna um status code 400 (Bad Request) e se as mensagens de erro indicam os parâmetros inválidos.

### Teste 7: Ordenação inválida
Vamos adicionar um teste para verificar se o endpoint retorna um erro 400 quando a ordenação é inválida:

```csharp title="Features/Bairros/GetBairrosEndpointTests.cs"
[Fact(DisplayName = "Deve retornar erro 400 para ordenação inválida (FastEndpoints)")]
[Trait("Integração", nameof(GetBairrosEndpoint))]
public async Task Deve_Retornar_Erro_400_Para_Ordenacao_Invalida_FastEndpoints()
{
    var request = new GetBairrosRequest()
    {
        OrderBy = "PropriedadeInexistente asc"
    };

    var (response, res) = await sut.Client.GETAsync<GetBairrosEndpoint, GetBairrosRequest, ErrorResponse>(request);

    // Assert
    response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    res.Errors.ShouldAllBe(e => e.Value.Contains(ApiConstants.GRIDYFY_INVALID_QUERY));
}
```

Este teste envia uma requisição para o endpoint `GET /bairros` com um parâmetro de ordenação que utiliza uma propriedade inexistente. Em seguida, verificamos se a resposta retorna um status code 400 (Bad Request) e se a mensagem de erro está correta.

Execute todos os testes implementados para garantir que o endpoint `GET /bairros` esteja funcionando corretamente em diferentes cenários. Lembre-se de que, como estamos utilizando o Testcontainers para criar um ambiente de teste isolado com um banco de dados PostgreSQL, os testes podem levar algum tempo para serem executados devido à inicialização do container e à importação dos dados.

## Conclusão
Neste artigo, exploramos como implementar testes de integração utilizando a biblioteca Testcontainers em um projeto .NET com FastEndpoints. Configuramos um ambiente de testes isolado utilizando containers Docker para o banco de dados PostgreSQL e implementamos diversos testes para o endpoint de consulta de bairros, verificando funcionalidades como paginação, ordenação e filtros. A utilização do Testcontainers nos permitiu criar um ambiente de teste consistente e reproduzível, garantindo a confiabilidade dos nossos testes de integração. Além disso, a biblioteca FastEndpoints.Testing facilitou a criação e execução dos testes, abstraindo boa parte da complexidade envolvida na configuração do ambiente de teste e no envio das requisições HTTP. Com essa abordagem, podemos garantir que nossa API esteja funcionando corretamente em diferentes cenários, aumentando a qualidade e a confiabilidade do nosso software.

Fique a vontade para explorar mais funcionalidades do Testcontainers e do FastEndpoints.Testing em seus próprios projetos de testes de integração! Treine a sua criatividade implementando testes para outros endpoints e cenários, garantindo a qualidade da sua aplicação. Se você gostou do conteúdo, não hesite em compartilhar e contribuir. Até a próxima!

## Artigos relacionados
- [Estrutura da Base de CEPs dos Correios - parte 1 de 3](../edne-estrutura-da-base-de-ceps-dos-correios-parte-1)
- [Estrutura da Base de CEPs dos Correios - parte 2 de 3](../edne-estrutura-da-base-de-ceps-dos-correios-parte-2)
- [Estrutura da Base de CEPs dos Correios - parte 2 de 3](../edne-estrutura-da-base-de-ceps-dos-correios-parte-3)

## Código Fonte
O código fonte completo deste projeto está disponível no GitHub: [Correios.DneBasico](https://github.com/danielcorvello/Correios.DneBasico)

## Referências
- [FastEndpoints Documentation](https://fast-endpoints.com/docs/)
- [Testcontainers for .NET Documentation](https://dotnet.testcontainers.org/)
- [xUnit Documentation](https://xunit.net/)
- [Shouldly Documentation](https://docs.shouldly.org/)
- [Gridify Documentation](https://alirezanet.github.io/Gridify/)