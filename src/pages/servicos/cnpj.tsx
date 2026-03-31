import React from "react";
import ServiceLandingPage from "../../ServiceLandingPage";
import { LINKEDIN_URL } from "../../constants/site";

const useCases = [
  {
    title: "Enriquecimento de CRM",
    desc: "Completar cadastro de empresas com contexto confiável para vendas, onboarding e operação B2B.",
  },
  {
    title: "Validação cadastral",
    desc: "Conferir situação cadastral, CNAE, porte e endereço antes de seguir com processos críticos.",
  },
  {
    title: "Monitoramento de carteira",
    desc: "Acompanhar mudanças relevantes em CNPJs de clientes, fornecedores ou parceiros ao longo do relacionamento.",
  },
  {
    title: "Segmentação B2B",
    desc: "Filtrar empresas por CNAE, porte, localidade ou situação cadastral para ações comerciais e analíticas.",
  },
  {
    title: "KYC e compliance",
    desc: "Usar o dado cadastral como apoio a due diligence, cadastro de parceiros e processos internos de verificação.",
  },
  {
    title: "Adequação ao CNPJ alfanumérico",
    desc: "Revisar fluxos, bases e integrações para conviver com formatos novos sem quebrar a operação.",
  },
];

const painPoints = [
  "A empresa tem muito CNPJ em fluxo, mas pouca consistência entre o cadastro que entra, o CRM que usa e a operação que depende dele.",
  "Toda validação importante vira consulta unitária, planilha ou correção manual porque o dado não está integrado ao processo.",
  "Mudanças cadastrais afetam prospecção, compliance ou relacionamento com parceiros e ninguém percebe no momento certo.",
  "A chegada do CNPJ alfanumérico expõe sistemas, validações e modelos antigos que ainda tratam documento como número fixo.",
];

const partnershipSteps = [
  {
    title: "Diagnóstico do uso do cadastro",
    desc: "Identifico onde o CNPJ entra na operação, quais campos realmente importam e onde o processo perde consistência hoje.",
  },
  {
    title: "Estruturação para enrichment e monitoramento",
    desc: "Organizo o dado para que ele sirva a rotinas recorrentes de CRM, validação, análise ou acompanhamento cadastral.",
  },
  {
    title: "Integração ao fluxo do time",
    desc: "A entrega acompanha o formato de consumo que reduz atrito para o time, seja em lote, pipeline interno ou apoio ao desenho da integração.",
  },
  {
    title: "Evolução contínua do escopo",
    desc: "Novos campos, revisões de regra e mudanças de cenário entram como parte natural da parceria conforme a necessidade aparece.",
  },
];

export default function Cnpj() {
  return (
    <ServiceLandingPage
      title="Base CNPJ"
      description="Parceria contínua para estruturar CNPJ, enrichment e monitoramento cadastral com foco em CRM, compliance e operação B2B."
      heroTitle="CNPJ confiável para rotinas de enrichment, monitoramento e operação B2B"
      heroTagline="Quando cadastro de empresa interfere em vendas, compliance, onboarding ou inteligência comercial, o problema não é só consultar um CNPJ. É manter contexto, consistência e atualização no ritmo da operação."
      heroNote="A proposta é apoiar o uso contínuo do dado cadastral, reduzindo dependência de processos manuais e deixando espaço para evolução conforme as necessidades do time mudam."
      proofItems={[
        "Cadastro estruturado a partir de fonte oficial",
        "Pensado para enrichment e monitoramento recorrente",
        "Integração alinhada a CRM, compliance e operação",
      ]}
      intro={[
        "O cadastro de CNPJ é um ponto de apoio para muitos processos críticos, mas quase sempre entra na empresa de forma fragmentada: uma consulta aqui, uma planilha ali, um enriquecimento manual quando o volume aperta. Isso gera inconsistência e limita o uso do dado.",
        "Eu atuo para transformar esse cadastro em rotina confiável, com estrutura útil para CRM, validação, monitoramento e análise. O foco é integrar o dado ao processo e manter margem para evolução, inclusive diante de mudanças como o CNPJ alfanumérico.",
      ]}
      painPoints={painPoints}
      partnershipSteps={partnershipSteps}
      idealFor={[
        "Vendas e revenue ops",
        "Fintechs e plataformas B2B",
        "Compliance e KYC",
        "Dados, CRM e onboarding",
      ]}
      scopeExamples={[
        {
          title: "Enriquecimento recorrente de base",
          desc: "Estruturação do dado para complementar cadastros internos com os campos que realmente sustentam as rotinas do time.",
        },
        {
          title: "Monitoramento de mudanças cadastrais",
          desc: "Apoio para acompanhar situação, atividade, endereço e outros sinais úteis em carteiras de clientes, parceiros ou fornecedores.",
        },
        {
          title: "Preparação para CNPJ alfanumérico",
          desc: "Revisão das premissas técnicas e dos pontos de quebra mais comuns em sistemas que ainda estão presos ao formato antigo.",
        },
        {
          title: "Integração compatível com o processo",
          desc: "Entrega pensada para o formato que reduz atrito hoje e permite ganhar maturidade sem recomeçar do zero depois.",
        },
      ]}
      useCases={useCases}
      relatedPosts={[
        {
          title: "CNPJ Alfanumérico com C#",
          href: "/cnpj-alfanumerico-com-csharp",
          description: "A base técnica da mudança de formato e os impactos práticos para quem trata CNPJ em sistemas reais.",
        },
        {
          title: "Checklist técnico para sistemas que vão conviver com o CNPJ alfanumérico",
          href: "/checklist-tecnico-para-sistemas-que-vao-conviver-com-o-cnpj-alfanumerico",
          description: "Um roteiro objetivo para revisar modelos, validações e integrações antes que a mudança gere problema.",
        },
        {
          title: "O custo oculto de depender de dados públicos brutos",
          href: "/o-custo-oculto-de-depender-de-dados-publicos-brutos",
          description: "Por que o atrito operacional quase sempre aparece depois, quando o dado entra sem tratamento no processo.",
        },
      ]}
      ctaTitle="Se o cadastro da empresa já afeta o ritmo do time, vale olhar para isso como processo contínuo"
      ctaSubtitle="A conversa parte do uso que você já tem hoje, dos riscos mais visíveis e de como o dado precisa circular entre CRM, operação e compliance sem depender de improviso."
      ctaNote="O escopo inicial pode ser pequeno, mas precisa nascer com espaço para atualização, monitoramento e novas necessidades ao longo do contrato."
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
