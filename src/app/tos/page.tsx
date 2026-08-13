import { Container } from "@/components/ui";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo";

import { TermsDecor } from "./terms-decor";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Please read these terms and conditions carefully before using Our Service.",
  path: routes.terms.path,
});

type LegalItem =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string };

type LegalSection = {
  heading: string;
  items: readonly LegalItem[];
};

const sections = [
  {
    "heading": "Interpretation and Definitions",
    "items": [
      {
        "type": "subheading",
        "text": "Interpretation"
      },
      {
        "type": "paragraph",
        "text": "The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural."
      },
      {
        "type": "subheading",
        "text": "Definitions"
      },
      {
        "type": "paragraph",
        "text": "For the purposes of these Terms and Conditions: Application means the software program provided by the Company downloaded by You on any electronic device, named Funfuse Games Application means the software program provided by the Company downloaded by You on any electronic device, named Funfuse Games Application Store means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded. Affiliate means an entity that controls, is controlled by or is under common control with a party, where “control” means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority. Country refers to: Delaware, United States Company (referred to as either “the Company”, “We”, “Us” or “Our” in this Agreement) refers to Funfuse Games, Wilmington, Delaware 28401, United States. Device means any device that can access the Service such as a computer, a cellphone or a digital tablet. Service refers to the Application. Terms and Conditions (also referred as “Terms”) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the TermsFeed Terms and Conditions Generator. Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service. You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
      }
    ]
  },
  {
    "heading": "Acknowledgment",
    "items": [
      {
        "type": "paragraph",
        "text": "These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service. By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service. You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service. Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service."
      }
    ]
  },
  {
    "heading": "Links to Other Websites",
    "items": [
      {
        "type": "paragraph",
        "text": "Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services. We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit."
      }
    ]
  },
  {
    "heading": "Termination",
    "items": [
      {
        "type": "paragraph",
        "text": "We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately."
      }
    ]
  },
  {
    "heading": "Limitation of Liability",
    "items": [
      {
        "type": "paragraph",
        "text": "We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately."
      }
    ]
  },
  {
    "heading": "“AS IS” and “AS AVAILABLE” Disclaimer",
    "items": [
      {
        "type": "paragraph",
        "text": "The Service is provided to You “AS IS” and “AS AVAILABLE” and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected. Without limiting the foregoing, neither the Company nor any of the company’s provider makes any representation or warranty of any kind, express or implied:"
      },
      {
        "type": "paragraph",
        "text": "1. as to the operation or availability of the Service, or the information, content, and materials or products included thereon;"
      },
      {
        "type": "paragraph",
        "text": "1. that the Service will be uninterrupted or error-free;"
      },
      {
        "type": "paragraph",
        "text": "1. as to the accuracy, reliability, or currency of any information or content provided through the Service; or"
      },
      {
        "type": "paragraph",
        "text": "1. that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components."
      },
      {
        "type": "paragraph",
        "text": "Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law."
      }
    ]
  },
  {
    "heading": "Governing Law",
    "items": [
      {
        "type": "paragraph",
        "text": "The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws."
      }
    ]
  },
  {
    "heading": "Disputes Resolution",
    "items": [
      {
        "type": "paragraph",
        "text": "If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company."
      }
    ]
  },
  {
    "heading": "For European Union (EU) Users",
    "items": [
      {
        "type": "paragraph",
        "text": "If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in."
      }
    ]
  },
  {
    "heading": "United States Legal Compliance",
    "items": [
      {
        "type": "paragraph",
        "text": "You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a “terrorist supporting” country, and (ii) You are not listed on any United States government list of prohibited or restricted parties."
      }
    ]
  },
  {
    "heading": "Severability and Waiver",
    "items": [
      {
        "type": "subheading",
        "text": "Severability"
      },
      {
        "type": "paragraph",
        "text": "If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect."
      },
      {
        "type": "subheading",
        "text": "Waiver"
      },
      {
        "type": "paragraph",
        "text": "Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not effect a party’s ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach."
      }
    ]
  },
  {
    "heading": "Translation Interpretation",
    "items": [
      {
        "type": "paragraph",
        "text": "These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute."
      }
    ]
  },
  {
    "heading": "Changes to These Terms and Conditions",
    "items": [
      {
        "type": "paragraph",
        "text": "We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days’ notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service."
      }
    ]
  }
] as const satisfies readonly LegalSection[];

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    >
      <div className="relative h-10 w-10 sm:h-12 sm:w-12">
        <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-accent sm:h-[1.125rem] sm:w-[1.125rem]" />
        <span className="absolute bottom-0 left-0 h-3 w-3 rotate-45 rounded-[2px] bg-accent-tint-strong sm:h-3.5 sm:w-3.5" />
        <span className="absolute bottom-0 right-0 h-3 w-3 rotate-45 rounded-[2px] bg-accent-tint sm:h-3.5 sm:w-3.5" />
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="relative isolate overflow-clip bg-canvas">
      <TermsDecor />

      <Container className="relative z-10 py-12 sm:py-16 lg:py-24">
        <article className="relative mx-auto max-w-[58rem] overflow-hidden rounded-[2rem] border border-line bg-surface px-5 py-8 shadow-lg sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 rounded-[1.6rem] border border-accent-tint-strong sm:inset-3 sm:rounded-[2rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent sm:inset-x-14"
          />

          <CornerMark className="left-5 top-5 sm:left-7 sm:top-7" />
          <CornerMark className="bottom-5 right-5 rotate-180 sm:bottom-7 sm:right-7" />

          <div className="relative mx-auto max-w-prose">
            <header className="border-b border-line pb-8 sm:pb-10">
              <h1 className="text-h1 font-semibold tracking-tightest text-heading">
                {"Terms of Service"}
              </h1>
              <p className="mt-4 text-sm font-medium text-accent-text sm:text-base">
                {"Last updated: July 28, 2024"}
              </p>
              <p className="mt-5 text-base leading-7 text-body sm:text-lg sm:leading-8">
                {"Please read these terms and conditions carefully before using Our Service."}
              </p>
            </header>

            <div className="pt-2">
              {sections.map((section) => (
                <section
                  key={section.heading}
                  className="border-b border-line/80 py-9 last:border-b-0 sm:py-11"
                >
                  <h2 className="text-h4 font-semibold tracking-tight text-heading">
                    {section.heading}
                  </h2>

                  <div className="mt-5 space-y-5">
                    {section.items.map((item, index) =>
                      item.type === "subheading" ? (
                        <h3
                          key={`${section.heading}-${index}`}
                          className="pt-1 text-lg font-semibold text-heading"
                        >
                          {item.text}
                        </h3>
                      ) : (
                        <p
                          key={`${section.heading}-${index}`}
                          className="text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8"
                        >
                          {item.text}
                        </p>
                      ),
                    )}
                  </div>
                </section>
              ))}

              <p className="py-2 text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8">
                {"."}
              </p>

              <section className="mt-4 rounded-lg border border-accent-tint-strong bg-accent-tint px-5 py-6 sm:px-7 sm:py-7">
                <h2 className="text-h4 font-semibold tracking-tight text-heading">
                  {"Contact Us"}
                </h2>
                <p className="mt-4 text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8">
                  {"If you have any questions about these Terms and Conditions, You can contact us: By email:"}
                </p>
                <p className="mt-3">
                  <a
                    href="mailto:support@funfusegames.com"
                    className="break-all text-base font-semibold text-accent-text underline decoration-accent/35 underline-offset-4 transition-colors duration-[var(--duration-hover)] hover:text-accent-pressed"
                  >
                    {"support@funfusegames.com"}
                  </a>
                </p>
              </section>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
