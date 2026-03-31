import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import ConsultativeCta from "../ConsultativeCta";
import styles from "../servicePages.module.css";
import { LINKEDIN_URL } from "../constants/site";

const recurringSignals = [
  "O time resolve endereço, cadastro ou bases públicas no improviso sempre que surge uma nova demanda.",
  "Produto, dados e operação usam regras diferentes para o mesmo dado e os conflitos aparecem no dia a dia.",
  "Atualizações viram tarefa manual, consulta unitária ou carga emergencial em vez de rotina previsível.",
  "Existe valor no dado, mas falta uma estrutura estável para integrá-lo ao fluxo real da empresa.",
];

const partnershipSteps = [
  {
    title: "1. Diagnóstico do contexto",
    desc: "A conversa começa pelo processo que já existe, pelos pontos de atrito e pelo que precisa permanecer confiável no longo prazo.",
  },
  {
    title: "2. Estruturação do dado",
    desc: "Organizo a base, as regras e os recortes necessários para que o dado seja útil de verdade para produto, dados e operações.",
  },
  {
    title: "3. Integração ao fluxo",
    desc: "A entrega é pensada para o modo como o seu time já trabalha: carga em banco, pipeline, arquivos ou apoio ao desenho da API.",
  },
  {
    title: "4. Evolução contínua",
    desc: "Atualizações, ajustes de escopo e novas necessidades entram como parte do trabalho, não como surpresa a cada mudança.",
  },
];

const serviceCards = [
  {
    title: "CEP e endereço confiável",
    href: "/servicos/base-cep",
    meta: "CEP",
    desc: "Para operações em que cadastro, checkout, logística e geografia operacional dependem de normalização e atualização constantes.",
  },
  {
    title: "Inteligência cadastral com CNPJ",
    href: "/servicos/cnpj",
    meta: "CNPJ",
    desc: "Para enrichment, monitoramento cadastral, CRM e processos B2B que precisam de contexto confiável e recorrente.",
  },
  {
    title: "Leitura de mercado com CAGED",
    href: "/servicos/base-caged",
    meta: "CAGED",
    desc: "Para BI, planejamento e análise de mercado de trabalho com dados tratados, históricos e recortes úteis para decisão.",
  },
];

const featuredPosts = [
  {
    title: "Quando uma consulta de CEP deixa de ser suficiente para a operação",
    href: "/quando-uma-consulta-de-cep-deixa-de-ser-suficiente-para-a-operacao",
    description: "Onde a consulta isolada falha e por que rotina de dados passa a importar mais do que o endpoint em si.",
  },
  {
    title: "Checklist técnico para sistemas que vão conviver com o CNPJ alfanumérico",
    href: "/checklist-tecnico-para-sistemas-que-vao-conviver-com-o-cnpj-alfanumerico",
    description: "Um roteiro prático para revisar cadastro, integrações e validações antes que a mudança gere atrito operacional.",
  },
  {
    title: "Como transformar CAGED bruto em insumo útil para BI e planejamento",
    href: "/como-transformar-caged-bruto-em-insumo-util-para-bi-e-planejamento",
    description: "Os cuidados de modelagem, histórico e recorte que tornam o CAGED útil para análise de verdade.",
  },
  {
    title: "O custo oculto de depender de dados públicos brutos",
    href: "/o-custo-oculto-de-depender-de-dados-publicos-brutos",
    description: "Um panorama dos custos invisíveis que aparecem quando o dado entra na operação sem tratamento consistente.",
  },
];

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ServicesHub() {
  return (
    <Layout
      title="Serviços"
      description="Parceria contínua em dados públicos, integração e rotinas confiáveis para produto, dados e operações.">
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Dados públicos com contexto operacional</span>
          <h1 className={styles.heroTitle}>Parceria contínua para transformar dado bruto em rotina confiável</h1>
          <p className={styles.heroTagline}>
            Eu ajudo times de produto, dados e operações a estruturar, integrar e sustentar o uso de dados
            públicos quando isso já deixou de ser detalhe técnico e passou a afetar cadastro, análise,
            compliance, logística ou decisão.
          </p>
          <p className={styles.heroNote}>
            O foco não é vender um pacote genérico. É construir uma base de trabalho aderente ao seu fluxo,
            com espaço para evolução, atualização e continuidade.
          </p>
          <div className={styles.proofStrip}>
            <span className={styles.proofItem}>Integração ao fluxo real da empresa</span>
            <span className={styles.proofItem}>Atualizações combinadas ao uso</span>
            <span className={styles.proofItem}>Foco em produto, dados e operações</span>
          </div>
          <div className={styles.heroCtas}>
            <Link className={styles.heroActionPrimary} to={LINKEDIN_URL}>
              Conversar sobre o seu cenário
            </Link>
            <button
              type="button"
              className={styles.heroActionSecondary}
              onClick={() => scrollToSection("conteudos-relacionados")}>
              Ver artigos relacionados
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sinais de dor recorrente</h2>
          <div className={styles.signalGrid}>
            {recurringSignals.map((signal) => (
              <div key={signal} className={styles.signalItem}>
                {signal}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Como a parceria funciona</h2>
          <div className={styles.cardsGrid}>
            {partnershipSteps.map((step) => (
              <div key={step.title} className={styles.card}>
                <p className={styles.cardTitle}>{step.title}</p>
                <p className={styles.cardText}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Áreas atendidas</h2>
          <div className={styles.pillGrid}>
            <div className={styles.pill}>Produto</div>
            <div className={styles.pill}>Dados e analytics</div>
            <div className={styles.pill}>Operações e logística</div>
            <div className={styles.pill}>CRM e revenue ops</div>
            <div className={styles.pill}>Compliance e processos B2B</div>
            <div className={styles.pill}>Planejamento e inteligência de mercado</div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Frentes de trabalho</h2>
          <div className={styles.serviceGrid}>
            {serviceCards.map((service) => (
              <Link key={service.href} to={service.href} className={styles.serviceCard}>
                <span className={styles.serviceCardMeta}>{service.meta}</span>
                <p className={styles.serviceCardTitle}>{service.title}</p>
                <p className={styles.serviceCardText}>{service.desc}</p>
                <span className={styles.serviceCardLink}>Ver detalhes do serviço</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="conteudos-relacionados" className={styles.section}>
          <h2 className={styles.sectionTitle}>Conteúdo que sustenta esse trabalho</h2>
          <p className={styles.sectionLead}>
            O conteúdo do site existe para mostrar como eu penso o problema e como esses dados se comportam na
            prática, não para empurrar uma solução genérica.
          </p>
          <div className={styles.relatedPostsGrid}>
            {featuredPosts.map((post) => (
              <Link key={post.href} to={post.href} className={styles.relatedPostCard}>
                <p className={styles.relatedPostTitle}>{post.title}</p>
                <p className={styles.relatedPostDescription}>{post.description}</p>
                <span className={styles.relatedPostLink}>Ler artigo</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ConsultativeCta
        title="Se esse tipo de problema já aparece de forma recorrente, vale conversar cedo"
        subtitle="A melhor forma de começar é olhando para o seu processo atual, para o dado que mais dói hoje e para a cadência que precisa continuar fazendo sentido depois da primeira entrega."
        note="O objetivo é sair com clareza sobre o escopo inicial e sobre o que precisa evoluir junto com a operação."
      />
    </Layout>
  );
}
