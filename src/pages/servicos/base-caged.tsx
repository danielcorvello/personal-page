import React from "react";
import ServiceLandingPage from "../../ServiceLandingPage";
import { LINKEDIN_URL } from "../../constants/site";

const useCases = [
  {
    title: "Benchmark salarial",
    desc: "Apoiar leituras de remuneração, movimentação e dinâmica regional com recortes mais próximos da realidade do negócio.",
  },
  {
    title: "Movimentação de temporários",
    desc: "Acompanhar sazonalidade e aquecimento de setores com alta sensibilidade a admissões e desligamentos.",
  },
  {
    title: "Mapeamento de talentos",
    desc: "Cruzar função, setor e região para entender onde existe concentração ou escassez de perfis relevantes.",
  },
  {
    title: "Indicadores de RH",
    desc: "Gerar painéis e recortes de mercado que sirvam de apoio a planejamento, expansão ou decisões de people analytics.",
  },
  {
    title: "Estudos econômicos",
    desc: "Transformar um histórico complexo em insumo mais legível para leitura de mercado, região e setor.",
  },
  {
    title: "Prospecção B2B",
    desc: "Identificar mercados aquecidos, regiões em expansão ou setores com sinais úteis para abordagem comercial.",
  },
];

const painPoints = [
  "O CAGED existe como fonte, mas o time não consegue usá-lo sem gastar energia demais limpando, relacionando e explicando o dado bruto.",
  "Toda análise importante começa de novo porque histórico, dicionários e recortes não estão prontos para BI ou decisão.",
  "Planejamento e inteligência de mercado dependem de uma fonte rica, mas difícil de transformar em leitura rápida para o negócio.",
  "A equipe precisa de contexto por função, setor e região, porém o caminho entre o arquivo oficial e o insight ainda é longo demais.",
];

const partnershipSteps = [
  {
    title: "Leitura do objetivo analítico",
    desc: "Começo entendendo quais decisões o time quer apoiar e quais recortes fazem diferença de verdade para BI, planejamento ou pesquisa.",
  },
  {
    title: "Tratamento e histórico coerente",
    desc: "Organizo competências, dicionários, recortes e histórico para o dado ficar mais legível e reutilizável ao longo do tempo.",
  },
  {
    title: "Entrega para consumo real",
    desc: "A estrutura acompanha a forma como o time trabalha hoje, seja em banco, arquivos preparados, camadas analíticas ou apoio a painéis.",
  },
  {
    title: "Atualização com continuidade",
    desc: "A rotina considera publicação oficial, ajustes de recorte e novas perguntas que surgem conforme o uso do dado amadurece.",
  },
];

export default function BaseCaged() {
  return (
    <ServiceLandingPage
      title="Base CAGED"
      description="Parceria contínua para estruturar CAGED com foco em BI, planejamento, people analytics e inteligência de mercado."
      heroTitle="CAGED tratado para virar insumo recorrente de BI, planejamento e leitura de mercado"
      heroTagline="Quando o mercado de trabalho precisa entrar na tomada de decisão, o desafio não é só ter acesso ao CAGED. É transformar um histórico complexo em algo legível, consistente e útil para o seu ritmo de análise."
      heroNote="A ideia é apoiar a construção dessa camada analítica com continuidade, para que o dado acompanhe novas perguntas e recortes em vez de virar retrabalho a cada estudo."
      proofItems={[
        "Histórico oficial tratado para leitura recorrente",
        "Recortes úteis para BI, RH e planejamento",
        "Integração alinhada ao processo analítico do time",
      ]}
      intro={[
        "O CAGED concentra um volume enorme de informação útil sobre movimentações formais do mercado de trabalho, mas a fonte oficial não costuma chegar pronta para quem precisa tomar decisão. Boa parte do esforço fica escondida em limpeza, histórico, dicionários e recortes.",
        "Eu atuo para encurtar esse caminho: estruturando o dado para o contexto do time, deixando a leitura mais rápida e preservando espaço para evoluir conforme BI, planejamento e inteligência de mercado passam a fazer novas perguntas.",
      ]}
      painPoints={painPoints}
      partnershipSteps={partnershipSteps}
      idealFor={[
        "BI e planejamento",
        "People analytics e RH",
        "Consultorias e estudos econômicos",
        "Inteligência comercial e expansão",
      ]}
      scopeExamples={[
        {
          title: "Camada tratada para BI",
          desc: "Estruturação do histórico e dos recortes mais úteis para painéis, análises recorrentes e exploração mais rápida do mercado.",
        },
        {
          title: "Dicionários e cruzamentos relevantes",
          desc: "Normalização de CBO, CNAE, município, UF e outras dimensões necessárias para a leitura não depender do arquivo bruto.",
        },
        {
          title: "Recortes aderentes ao objetivo do time",
          desc: "Modelagem orientada ao tipo de decisão que precisa ser tomada: expansão, benchmarking, atração de talentos ou leitura setorial.",
        },
        {
          title: "Rotina de atualização e continuidade",
          desc: "Ajuste da cadência de atualização e do formato de entrega para que o dado continue servindo conforme o uso se torna mais sofisticado.",
        },
      ]}
      useCases={useCases}
      relatedPosts={[
        {
          title: "Como transformar CAGED bruto em insumo útil para BI e planejamento",
          href: "/como-transformar-caged-bruto-em-insumo-util-para-bi-e-planejamento",
          description: "Os principais pontos de estruturação para tirar o CAGED do campo do retrabalho e aproximá-lo do uso analítico.",
        },
        {
          title: "O custo oculto de depender de dados públicos brutos",
          href: "/o-custo-oculto-de-depender-de-dados-publicos-brutos",
          description: "Uma leitura mais ampla sobre o custo de operar com fonte pública sem camada de tratamento compatível com o negócio.",
        },
      ]}
      ctaTitle="Se o CAGED já entrou na conversa de planejamento, vale tratar o dado como ativo recorrente"
      ctaSubtitle="A conversa parte da decisão que você quer apoiar, do tipo de recorte que hoje ainda dá trabalho demais e do formato de consumo que faz mais sentido para o time."
      ctaNote="O objetivo é construir um ponto de partida útil agora, sem travar a evolução do escopo conforme o uso analítico amadurece."
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
