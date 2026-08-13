import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";

import logo from "@/assets/brand/funfuse-games-logo.webp";
import { IntroGate, SiteIntro } from "@/components/intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Media } from "@/components/media";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import { jsonLdGraph, organizationSchema, websiteSchema } from "@/lib/jsonld";

import "./globals.css";

/**
 * Bricolage Grotesque carries the headline voice. Its optical-size axis makes
 * the letterforms tighten as they scale up, which is why display type here
 * needs almost no manual tracking. No Cyrillic or Arabic coverage — native
 * game titles render in Geist instead.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

/** Reading surfaces and UI. Covers Cyrillic and Vietnamese for game titles. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: site.defaultTitle,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.lang}
      className={`${geist.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* First, and before the overlay below is parsed. See intro-gate.tsx. */}
        <IntroGate />

        <noscript>
          <style>{`
            .will-reveal,
            .reveal-stagger > *,
            .will-draw,
            .will-draw-y {
              visibility: visible !important;
            }
          `}</style>
        </noscript>

        {/* `contents`, so this adds a handle without adding a box: the header,
            main and footer stay direct flex children of the body. The intro
            marks it `inert` while it runs, which is the only thing keeping the
            keyboard out of a page nobody can see yet. */}
        <div id="site-shell" className="contents">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>

        {/* The lockup is passed in rather than imported by the island, so the
            image system stays on the server side of the boundary. Same asset
            the header already fetches, so this costs no extra request. */}
        <SiteIntro
          lockup={
            <Media
              src={logo}
              decorative
              aspect="intrinsic"
              sizes="lockup"
              fit="contain"
              tone="none"
              rounded="none"
              priority="eager"
              className="w-24 shrink-0"
            />
          }
        />

        <JsonLd data={jsonLdGraph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
