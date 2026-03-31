import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import ConsultativeCta, { type ConsultativeAction } from "./ConsultativeCta";
import styles from "./servicePages.module.css";
import { LINKEDIN_URL } from "./constants/site";

type Item = {
  title: string;
  desc: string;
};

type RelatedPost = {
  title: string;
  href: string;
  description: string;
};

type ServiceLandingPageProps = {
  title: string;
  description: string;
  heroTitle: string;
  heroTagline: string;
  heroNote: string;
  proofItems: string[];
  intro: string[];
  painPoints: string[];
  partnershipSteps: Item[];
  scopeExamples: Item[];
  idealFor: string[];
  useCases: Item[];
  relatedPosts: RelatedPost[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaNote: string;
  primaryCta?: ConsultativeAction;
  secondaryCta?: ConsultativeAction;
};

function renderHeroAction(action: ConsultativeAction, isPrimary: boolean) {
  const className = isPrimary ? styles.heroActionPrimary : styles.heroActionSecondary;

  if (action.href.startsWith("#")) {
    const targetId = action.href.slice(1);

    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })
        }>
        {action.label}
      </button>
    );
  }

  return (
    <Link className={className} to={action.href}>
      {action.label}
    </Link>
  );
}

export default function ServiceLandingPage({
  title,
  description,
  heroTitle,
  heroTagline,
  heroNote,
  proofItems,
  intro,
  painPoints,
  partnershipSteps,
  scopeExamples,
  idealFor,
  useCases,
  relatedPosts,
  ctaTitle,
  ctaSubtitle,
  ctaNote,
  primaryCta,
  secondaryCta,
}: ServiceLandingPageProps) {
  const primaryAction = primaryCta ?? {
    label: "Conversar sobre o seu cenário",
    href: LINKEDIN_URL,
  };
  const secondaryAction = secondaryCta ?? {
    label: "Ver artigos relacionados",
    href: "#artigos-relacionados",
  };

  return (
    <Layout title={title} description={description}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Parceria contínua para dados públicos e operações</span>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroTagline}>{heroTagline}</p>
          <p className={styles.heroNote}>{heroNote}</p>
          <div className={styles.proofStrip}>
            {proofItems.map((item) => (
              <span key={item} className={styles.proofItem}>
                {item}
              </span>
            ))}
          </div>
          <div className={styles.heroCtas}>
            {renderHeroAction(primaryAction, true)}
            {renderHeroAction(secondaryAction, false)}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Visão geral</h2>
          {intro.map((paragraph) => (
            <p key={paragraph} className={styles.description}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quando isso vira gargalo</h2>
          <div className={styles.signalGrid}>
            {painPoints.map((item) => (
              <div key={item} className={styles.signalItem}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Como eu apoio sua operação</h2>
          <div className={styles.cardsGrid}>
            {partnershipSteps.map((item) => (
              <div key={`${item.title}-${item.desc}`} className={styles.card}>
                <p className={styles.cardTitle}>{item.title}</p>
                <p className={styles.cardText}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Áreas atendidas</h2>
          <div className={styles.pillGrid}>
            {idealFor.map((item) => (
              <div key={item} className={styles.pill}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Exemplos de escopo</h2>
          <div className={styles.cardsGrid}>
            {scopeExamples.map((item) => (
              <div key={`${item.title}-${item.desc}`} className={styles.card}>
                <p className={styles.cardTitle}>{item.title}</p>
                <p className={styles.cardText}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Casos de uso</h2>
          <ul className={styles.useCasesList}>
            {useCases.map((item) => (
              <li key={item.title}>
                <span className={styles.useCaseLabel}>{item.title}:</span>{" "}
                <span className={styles.useCaseDesc}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="artigos-relacionados" className={styles.section}>
          <h2 className={styles.sectionTitle}>Artigos relacionados</h2>
          <div className={styles.relatedPostsGrid}>
            {relatedPosts.map((post) => (
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
        title={ctaTitle}
        subtitle={ctaSubtitle}
        note={ctaNote}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />
    </Layout>
  );
}
