import React from "react";
import Layout from "@theme/Layout";
import styles from "../css/servicos.module.css";

type Item = {
  label: string;
  desc?: string;
};

type Cta = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type ServiceLandingPageProps = {
  title: string;
  description: string;
  heroTitle: string;
  heroTagline: string;
  proofItems: string[];
  intro: string[];
  deliverables: Item[];
  idealFor: string[];
  useCases: Item[];
  reasons: Item[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaNote: string;
};

function renderCta(cta: Cta) {
  const className = cta.variant === "primary" ? styles.btnPrimary : styles.btnSecondary;

  return (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {cta.label}
    </a>
  );
}

export default function ServiceLandingPage({
  title,
  description,
  heroTitle,
  heroTagline,
  proofItems,
  intro,
  deliverables,
  idealFor,
  useCases,
  reasons,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  ctaTitle,
  ctaSubtitle,
  ctaNote,
}: ServiceLandingPageProps) {
  const heroCtas: Cta[] = [
    { label: primaryCtaLabel, href: primaryCtaHref, variant: "primary" },
    { label: secondaryCtaLabel, href: secondaryCtaHref, variant: "secondary" },
  ];

  const footerCtas: Cta[] = [
    { label: primaryCtaLabel, href: primaryCtaHref, variant: "primary" },
    { label: secondaryCtaLabel, href: secondaryCtaHref, variant: "secondary" },
  ];

  return (
    <Layout title={title} description={description}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroTagline}>{heroTagline}</p>
          <div className={styles.proofStrip}>
            {proofItems.map((item) => (
              <span key={item} className={styles.proofItem}>
                {item}
              </span>
            ))}
          </div>
          <div className={styles.heroCtas}>
            {heroCtas.map((cta) => (
              <React.Fragment key={`${cta.variant}-${cta.label}`}>{renderCta(cta)}</React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>O que é</h2>
          {intro.map((paragraph) => (
            <p key={paragraph} className={styles.description}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>O que você recebe</h2>
          <ul className={styles.checkList}>
            {deliverables.map((item) => (
              <li key={`${item.label}-${item.desc ?? ""}`}>
                <span className={styles.useCaseLabel}>{item.label}</span>
                {item.desc ? `: ${item.desc}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ideal para</h2>
          <div className={styles.pillGrid}>
            {idealFor.map((item) => (
              <div key={item} className={styles.pill}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Casos de uso</h2>
          <ul className={styles.useCasesList}>
            {useCases.map((item) => (
              <li key={item.label}>
                <span>
                  <span className={styles.useCaseLabel}>{item.label}:</span>{" "}
                  <span className={styles.useCaseDesc}>{item.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Por que contratar</h2>
          <div className={styles.cardsGrid}>
            {reasons.map((reason) => (
              <div key={`${reason.label}-${reason.desc ?? ""}`} className={styles.card}>
                <p className={styles.cardTitle}>{reason.label}</p>
                {reason.desc ? <p className={styles.cardText}>{reason.desc}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>{ctaTitle}</h2>
        <p className={styles.ctaSubtitle}>{ctaSubtitle}</p>
        <div className={styles.ctaButtons}>
          {footerCtas.map((cta) => (
            <React.Fragment key={`footer-${cta.variant}-${cta.label}`}>{renderCta(cta)}</React.Fragment>
          ))}
        </div>
        <p className={styles.ctaNote}>{ctaNote}</p>
      </div>
    </Layout>
  );
}
