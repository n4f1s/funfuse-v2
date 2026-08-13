import { Container } from "@/components/ui";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo";

import { TermsDecor } from "../tos/terms-decor";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "At Funfuse Games, accessible from Funfusegames.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by Funfuse Games and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regard to the information that they share and/or collect in Funfuse Games. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the Free Privacy Policy Generator.",
  path: routes.privacy.path,
});

type LegalItem =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "list"; items: readonly string[] };

type LegalSection = {
  heading: string;
  items: readonly LegalItem[];
};

const sections = [
  {
    "heading": "Consent",
    "items": [
      {
        "type": "paragraph",
        "text": "The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide. When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number."
      }
    ]
  },
  {
    "heading": "Information we collect",
    "items": [
      {
        "type": "paragraph",
        "text": "For the purposes of these Terms and Conditions: Application means the software program provided by the Company downloaded by You on any electronic device, named Funfuse Games Application means the software program provided by the Company downloaded by You on any electronic device, named Funfuse Games Application Store means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded. Affiliate means an entity that controls, is controlled by or is under common control with a party, where “control” means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority. Country refers to: Delaware, United States Company (referred to as either “the Company”, “We”, “Us” or “Our” in this Agreement) refers to Funfuse Games, Wilmington, Delaware 28401, United States. Device means any device that can access the Service such as a computer, a cellphone or a digital tablet. Service refers to the Application. Terms and Conditions (also referred as “Terms”) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the TermsFeed Terms and Conditions Generator. Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service. You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
      }
    ]
  },
  {
    "heading": "How we use your information",
    "items": [
      {
        "type": "paragraph",
        "text": "We use the information we collect in various ways, including to:"
      },
      {
        "type": "list",
        "items": [
          "Provide, operate, and maintain our website",
          "Improve, personalize, and expand our website",
          "Understand and analyze how you use our website",
          "Develop new products, services, features, and functionality",
          "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes",
          "Send you emails"
        ]
      }
    ]
  },
  {
    "heading": "Log Files",
    "items": [
      {
        "type": "paragraph",
        "text": "Funfuse Games follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services’ analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information."
      }
    ]
  },
  {
    "heading": "Cookies and Web Beacons",
    "items": [
      {
        "type": "paragraph",
        "text": "Funfuse Games follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services’ analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information."
      }
    ]
  },
  {
    "heading": "Google DoubleClick DART Cookie",
    "items": [
      {
        "type": "paragraph",
        "text": "Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads"
      }
    ]
  },
  {
    "heading": "Our Advertising Partners",
    "items": [
      {
        "type": "paragraph",
        "text": "Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below."
      },
      {
        "type": "subheading",
        "text": "Google"
      },
      {
        "type": "link",
        "text": "https://policies.google.com/technologies/ads",
        "href": "https://policies.google.com/technologies/ads"
      }
    ]
  },
  {
    "heading": "Advertising Partners Privacy Policies",
    "items": [
      {
        "type": "paragraph",
        "text": "You may consult this list to find the Privacy Policy for each of the advertising partners of Funfuse Games. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Funfuse Games, which are sent directly to users’ browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note that Funfuse Games has no access to or control over these cookies that are used by third-party advertisers."
      }
    ]
  },
  {
    "heading": "Third Party Privacy Policies",
    "items": [
      {
        "type": "paragraph",
        "text": "Funfuse Games’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers’ respective websites."
      }
    ]
  },
  {
    "heading": "CCPA Privacy Rights (Do Not Sell My Personal Information)",
    "items": [
      {
        "type": "paragraph",
        "text": "Under the CCPA, among other rights, California consumers have the right to: Request that a business that collects a consumer’s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers. Request that a business delete any personal data about the consumer that a business has collected. Request that a business that sells a consumer’s personal data, not sell the consumer’s personal data. If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."
      }
    ]
  },
  {
    "heading": "GDPR Data Protection Rights",
    "items": [
      {
        "type": "paragraph",
        "text": "We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following: The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service. The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete. The right to erasure – You have the right to request that we erase your personal data, under certain conditions."
      },
      {
        "type": "paragraph",
        "text": "The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions. The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions. The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions. If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."
      }
    ]
  },
  {
    "heading": "Children’s Information",
    "items": [
      {
        "type": "paragraph",
        "text": "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Funfuse Games does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records."
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

export default function PrivacyPolicyPage() {
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
                {"Privacy Policy"}
              </h1>
              <p className="mt-4 text-sm font-medium text-accent-text sm:text-base">
                {"Last updated: July 28, 2024"}
              </p>
              <p className="mt-5 text-base leading-7 text-body sm:text-lg sm:leading-8">
                {"At Funfuse Games, accessible from Funfusegames.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by Funfuse Games and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regard to the information that they share and/or collect in Funfuse Games. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the Free Privacy Policy Generator."}
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
                    {section.items.map((item, index) => {
                      const key = `${section.heading}-${index}`;

                      if (item.type === "subheading") {
                        return (
                          <h3
                            key={key}
                            className="pt-1 text-lg font-semibold text-heading"
                          >
                            {item.text}
                          </h3>
                        );
                      }

                      if (item.type === "link") {
                        return (
                          <p
                            key={key}
                            className="text-[0.975rem] leading-7 sm:text-base sm:leading-8"
                          >
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all font-medium text-accent-text underline decoration-accent/35 underline-offset-4 transition-colors duration-[var(--duration-hover)] hover:text-accent-pressed"
                            >
                              {item.text}
                            </a>
                          </p>
                        );
                      }

                      if (item.type === "list") {
                        return (
                          <ul
                            key={key}
                            className="space-y-3 pl-5 text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8"
                          >
                            {item.items.map((entry) => (
                              <li
                                key={entry}
                                className="relative pl-2 marker:text-accent"
                              >
                                {entry}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      return (
                        <p
                          key={key}
                          className="text-[0.975rem] leading-7 text-body sm:text-base sm:leading-8"
                        >
                          {item.text}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
