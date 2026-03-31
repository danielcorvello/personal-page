import React from "react";
import ServiceLandingPage from "../../ServiceLandingPage";
import { LINKEDIN_URL } from "../../constants/site";

const useCases = [
  {
    title: "Validação de endereço",
    desc: "Combinar CEP, logradouro, bairro e município com regras consistentes para cadastro, checkout e atendimento.",
  },
  {
    title: "Cálculo de frete",
    desc: "Usar recortes geográficos e coordenadas quando fizer sentido para cobertura, precificação e operação logística.",
  },
  {
    title: "Segmentação geográfica",
    desc: "Cruzar CEP com município, UF, DDD ou coordenadas para análises, campanhas e inteligência territorial.",
  },
  {
    title: "Roteirização logística",
    desc: "Reduzir atrito operacional em roteirização e janelas de entrega quando o endereço precisa ser tratado com mais contexto.",
  },
  {
    title: "Cobertura de serviço",
    desc: "Definir se um CEP entra ou não em determinada região, malha ou regra comercial antes de seguir no fluxo.",
  },
  {
    title: "Enriquecimento de dados",
    desc: "Recuperar contexto de endereço em bases legadas sem depender de processo manual sempre que uma nova demanda surgir.",
  },
];

const painPoints = [
  "O mesmo CEP passa por checkout, CRM, atendimento e logística com regras diferentes e resultados inconsistentes.",
  "A operação corrige endereço manualmente porque a base usada hoje não conversa bem com o fluxo real do negócio.",
  "Cobertura, frete e segmentação dependem de um dado geográfico que nunca está pronto quando a área precisa agir.",
  "Toda atualização vira esforço pontual, não uma rotina previsível de manutenção e integração.",
];

const partnershipSteps = [
  {
    title: "Leitura do fluxo atual",
    desc: "Mapeio onde o CEP entra na operação, quais regras já existem e onde estão os principais atritos entre cadastro, produto e logística.",
  },
  {
    title: "Normalização e estruturação",
    desc: "Organizo o dado para que ele faça sentido no seu contexto, com campos, chaves e enriquecimentos compatíveis com o uso real.",
  },
  {
    title: "Integração ao processo",
    desc: "A entrega pode apoiar rotinas de carga, consultas internas, regras de cobertura ou o desenho de endpoints e validações.",
  },
  {
    title: "Atualizações combinadas",
    desc: "A manutenção acompanha a cadência necessária para o seu caso, em vez de exigir recomeços toda vez que o dado muda.",
  },
];

export default function BaseCep() {
  return (
    <ServiceLandingPage
      title="Base CEP"
      description="Parceria contínua para estruturar CEP e endereço com foco em cadastro, logística, cobertura e geografia operacional."
      heroTitle="CEP confiável para operações que dependem de endereço sem improviso"
      heroTagline="Quando CEP, logradouro e cobertura interferem em cadastro, checkout, logística ou roteirização, o trabalho não termina em uma consulta. Ele precisa de atualização, normalização e integração ao fluxo da operação."
      heroNote="A proposta aqui é apoiar a construção de uma rotina estável para endereço e geografia operacional, com espaço para evolução conforme o processo amadurece."
      proofItems={[
        "Dados públicos tratados com foco operacional",
        "Atualizações alinhadas ao uso do time",
        "Integração pensada para produto, dados e operações",
      ]}
      intro={[
        "CEP parece simples até começar a afetar conversão, SLA, roteirização, cobertura comercial ou qualidade cadastral. A partir daí, o problema deixa de ser consultar um CEP e passa a ser manter um dado confiável ao longo de vários fluxos da empresa.",
        "Eu atuo estruturando esse dado para o seu contexto: definindo recortes, organizando campos úteis, apoiando a integração e mantendo uma cadência de atualização que faça sentido para produto, dados e operações.",
      ]}
      painPoints={painPoints}
      partnershipSteps={partnershipSteps}
      idealFor={[
        "Produto e checkout",
        "Operações logísticas",
        "Dados e analytics",
        "Atendimento e backoffice",
      ]}
      scopeExamples={[
        {
          title: "Base tratada para consumo recorrente",
          desc: "Entrega estruturada para banco, pipeline ou processo interno, com o recorte de campos que ajuda o seu time a operar melhor.",
        },
        {
          title: "Apoio em cobertura e regras",
          desc: "Uso do dado para suportar regras de entrega, segmentação geográfica, regiões atendidas ou leitura territorial da operação.",
        },
        {
          title: "Enriquecimento com contexto adicional",
          desc: "DDD, município, UF, código IBGE e coordenadas quando isso faz sentido para o caso e para a maturidade do fluxo.",
        },
        {
          title: "Rotina de atualização",
          desc: "Cadência combinada para manter consistência sem transformar atualização de base em projeto novo a cada ciclo.",
        },
      ]}
      useCases={useCases}
      relatedPosts={[
        {
          title: "Quando uma consulta de CEP deixa de ser suficiente para a operação",
          href: "/quando-uma-consulta-de-cep-deixa-de-ser-suficiente-para-a-operacao",
          description: "Um panorama das situações em que o CEP deixa de ser detalhe técnico e passa a afetar processo, SLA e conversão.",
        },
        {
          title: "e-DNE - Estrutura da Base de CEPs dos Correios - parte 1 de 3",
          href: "/edne-estrutura-da-base-de-ceps-dos-correios-parte-1",
          description: "Como a base dos Correios é organizada e por que ela exige modelagem antes de ser útil no dia a dia.",
        },
        {
          title: "e-DNE - Estrutura da Base de CEPs dos Correios - parte 2 de 3",
          href: "/edne-estrutura-da-base-de-ceps-dos-correios-parte-2",
          description: "O processo de importação, normalização e criação de uma tabela unificada para consulta recorrente.",
        },
        {
          title: "e-DNE - Estrutura da Base de CEPs dos Correios - parte 3 de 3",
          href: "/edne-estrutura-da-base-de-ceps-dos-correios-parte-3",
          description: "A camada de API e integração que transforma a base em algo mais útil para produto e operação.",
        },
      ]}
      ctaTitle="Se endereço já virou assunto recorrente no seu time, vale conversar antes de aumentar a complexidade"
      ctaSubtitle="A conversa parte do fluxo que existe hoje, do impacto operacional e do tipo de rotina que precisa continuar confiável no longo prazo."
      ctaNote="O objetivo não é encaixar sua operação em um pacote pronto, e sim definir um recorte inicial que faça sentido e possa evoluir junto com o uso."
      primaryCta={{
        label: "Conversar sobre o seu cenário",
        href: LINKEDIN_URL,
      }}
      secondaryCta={{
        label: "Ver artigos relacionados",
        href: "#artigos-relacionados",
      }}
    />
  );
}
