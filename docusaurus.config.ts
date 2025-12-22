import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Daniel Corvello",
  tagline: ".NET Developer",
  favicon: "img/favicon.ico",

  themes: ["@docusaurus/theme-mermaid"],
  // In order for Mermaid code blocks in Markdown to work,
  // you also need to enable the Remark plugin with this option
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownImages: "warn",
      onBrokenMarkdownLinks: "warn",
    },
  },

  plugins: [
    "plugin-image-zoom",
    ['@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/fastendpoints-simplificando-o-desenvolvimento-de-apis-em-dotnet',
            from: ['/2025/11/fastendpoints-simplificando-o-desenvolvimento-de-apis-em-dotnet'],
          },
        ],
      },
    ],
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://corvello.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "danielcorvello", // Usually your GitHub org/user name.
  projectName: "personal-page", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        // docs: {
        //   path: "docs",
        //   routeBasePath: "projetos",
        //   sidebarPath: "./sidebars.ts",
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   // editUrl:
        //   //   "https://github.com/danielcorvello/personal-page/tree/main/",
        // },
        blog: {
          routeBasePath: "/", // Serve the blog at the site's root
          blogSidebarTitle: " ",
          blogSidebarCount: 5,
          postsPerPage: 2,

          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/danielcorvello/personal-page/tree/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-F8PLKWH24G",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: "Daniel Corvello",
        src: "img/logo-color-dark.svg",
        srcDark: "img/logo-color-white.svg",
      },
      items: [
        { to: "/", label: "Blog", position: "left" },
        {
          to: "/sobre-mim",
          label: "Sobre mim",
          position: "left",
        },
        {
          href: "https://github.com/danielcorvello",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Sobre mim",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/danielcorvello",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/danielcorvello/",
            },
            {
              label: "Blog",
              to: "/",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Daniel Corvello. Feito com <a href="https://docusaurus.io">Docusaurus</a>, hospedado no <a href="https://pages.github.com">GitHub Pages</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "csharp", "aspnet", "powershell", "http"],
    },
    imageZoom: {
      // CSS selector to apply the plugin to, defaults to '.markdown img'
      selector: ".markdown :not(em) > img",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
