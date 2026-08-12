/**
 * Contact page content.
 *
 * The topics are ours to choose, but they are not decoration: the value is
 * what the subject line of the email says, so it is what decides how quickly
 * the right person picks a message up. Keep the list short. A topic nobody
 * routes on is a field the visitor has to think about for nothing.
 *
 * Everything else on the page (address, email, social profiles) comes from
 * `src/config/site.ts` so there is one copy of every company fact.
 */

export type ContactTopic = {
  /** Stored in the form and printed in the subject line. */
  value: string;
  /** What the visitor reads. */
  label: string;
  /** One line under the label, so the choice can be made without guessing. */
  hint: string;
};

export const contactTopics = [
  {
    value: "Player support",
    label: "Player support",
    hint: "A problem in one of our games.",
  },
  {
    value: "Business",
    label: "Business",
    hint: "Partnerships, publishing, licensing.",
  },
  {
    value: "Press",
    label: "Press",
    hint: "Interviews, assets, company details.",
  },
  {
    value: "Something else",
    label: "Something else",
    hint: "Anything the three above do not cover.",
  },
] as const satisfies readonly ContactTopic[];

export const contactTopicValues = contactTopics.map((topic) => topic.value);

export const contactContent = {
  eyebrow: "Contact",
  title: "Deal us in",
  description:
    "Tell us what you need and the message reaches the person who can answer it. We read everything that arrives here.",
  formTitle: "Send a message",
  formHint:
    "Four fields. Every one you finish plays a card onto the table beside it.",
} as const;
