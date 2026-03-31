import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./consultativeCta.module.css";
import { LINKEDIN_URL } from "./constants/site";

export type ConsultativeAction = {
  label: string;
  href: string;
};

type ConsultativeCtaProps = {
  title?: string;
  subtitle?: string;
  note?: string;
  primaryAction?: ConsultativeAction;
  secondaryAction?: ConsultativeAction;
  compact?: boolean;
};

function renderAction(action: ConsultativeAction, className: string) {
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

export default function ConsultativeCta({
  title = "Quando isso precisa virar rotina confiável",
  subtitle = "Eu trabalho com times de produto, dados e operações para integrar, atualizar e sustentar dados públicos no fluxo real da operação.",
  note = "A conversa começa pelo seu contexto atual, pelos pontos de atrito e pelo que precisa continuar funcionando ao longo do tempo.",
  primaryAction = {
    label: "Conversar sobre o seu cenário",
    href: LINKEDIN_URL,
  },
  secondaryAction,
  compact = false,
}: ConsultativeCtaProps) {
  return (
    <div className={clsx(styles.wrapper, compact && styles.compact)}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Parceria contínua, não pacote fechado</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.buttons}>
          {renderAction(primaryAction, styles.primaryButton)}
          {secondaryAction ? renderAction(secondaryAction, styles.secondaryButton) : null}
        </div>
        <p className={styles.note}>{note}</p>
      </div>
    </div>
  );
}
