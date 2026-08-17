import {
  ContactChannels,
  ContactForm,
  ContactHero,
} from "@/components/contact";
import { Reveal, WordReveal } from "@/components/motion";
import { Section } from "@/components/ui";
import { routes } from "@/config/routes";
import { contactContent } from "@/content/contact";
import { createMetadata } from "@/lib/seo";

/**
 * The preserved WordPress contact URL.
 *
 * The form posts to a server action, so this page stays static: nothing here
 * is rendered per request and there is no route handler to keep warm. The only
 * dynamic thing on it is the action itself.
 *
 * No ContactPoint JSON-LD. The layout already emits Organization with the
 * company email, and a second contact point that repeats it with no phone
 * number, language or hours attached is markup for its own sake.
 */
export const metadata = createMetadata({
  title: "Contact us",
  description: contactContent.description,
  path: routes.contact.path,
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <Section id="message" tone="surface">
        <div className="max-w-xl">
          <WordReveal
            as="h2"
            text={contactContent.formTitle}
            className="text-h2 text-heading font-semibold tracking-tightest"
          />
          <Reveal as="p" y="lg" className="text-muted mt-4 text-lg">
            {contactContent.formHint}
          </Reveal>
        </div>

        <div className="mt-10 lg:mt-14">
          <ContactForm />
        </div>
      </Section>

      <ContactChannels />
    </>
  );
}
