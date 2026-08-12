"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  FormError,
  FormGuards,
  RadioCards,
  SentPanel,
  SubmitButton,
  TextareaInput,
  TextInput,
} from "@/components/forms";
import { Reveal } from "@/components/motion";
import { contactTopics } from "@/content/contact";
import { sendContactMessage } from "@/lib/forms/actions";
import { idleState } from "@/lib/forms/fields";

import { ContactTable, type TableCard } from "./contact-table";

/**
 * The general contact form, and the table that reads it.
 *
 * One card per field. The card is dealt when the field holds something worth
 * sending and taken back when it does not, so the table is a running answer to
 * "how much of this is left". That is the whole reason the stage is here; it
 * is not scenery.
 *
 * The form works without JavaScript. `useActionState` hands back a `formAction`
 * that posts to the same server action, so a visitor with no client bundle gets
 * validation, a real send and a rendered result — they just do not get the
 * cards, which is the correct thing to lose first.
 */

const CARDS: readonly TableCard[] = [
  { field: "name", rank: "A", suit: "♠", label: "Name" },
  { field: "email", rank: "K", suit: "♥", label: "Email" },
  { field: "topic", rank: "Q", suit: "♦", label: "Topic" },
  { field: "message", rank: "J", suit: "♣", label: "Message" },
];

/**
 * What counts as played. Deliberately looser than the server's rules: this
 * decides whether a card is on the table, not whether the message can be
 * sent, and a card that flicks back and forth as somebody types their address
 * is worse than one that lands slightly early.
 */
function isFilled(field: string, value: string): boolean {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      return trimmed.length >= 2;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    case "message":
      return trimmed.length >= 10;
    default:
      return trimmed.length > 0;
  }
}

const same = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, idleState);
  const [played, setPlayed] = useState<readonly string[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);

  const sent = state.status === "success";
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  /** One handler for every control, so radios and text fields agree. */
  const readForm = () => {
    const element = form.current;
    if (!element) return;

    const data = new FormData(element);
    const next = CARDS.filter((card) =>
      isFilled(card.field, String(data.get(card.field) ?? "")),
    ).map((card) => card.field);

    setPlayed((previous) => (same(previous, next) ? previous : next));
  };

  // A rejected submit puts the focus on the first field that needs work.
  // Without this the message is announced and the visitor is left at the
  // bottom of the form with no idea which control it was about.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;

    const first = Object.keys(state.errors)[0];
    if (!first) return;

    const control = form.current?.querySelector<HTMLElement>(
      `[name="${first}"]`,
    );
    control?.focus();
  }, [state]);

  // Nothing re-reads the form after a rejection on purpose. The fields are
  // uncontrolled and the form is never unmounted, so the DOM still holds what
  // the visitor typed and the cards are already where they belong. The echoed
  // `values` exist for the no-JavaScript path, where the page is re-rendered
  // from scratch.

  return (
    // A grid at every width, not only from lg: `order` is what puts the table
    // above the form on a phone, and order does nothing outside a grid or flex
    // container.
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-12">
      <div className="lg:col-span-7">
        {sent ? (
          <SentPanel
            title="Message sent"
            message={state.message ?? ""}
            actionLabel="Send another"
          />
        ) : (
          <form
            ref={form}
            action={formAction}
            onChange={readForm}
            // React's focus events are focusin/focusout, so one pair on the
            // form covers every control inside it. The card for whichever
            // field the visitor is in lifts off the table while they are
            // in it.
            onFocus={(event) =>
              setFocused(event.target.getAttribute("name"))
            }
            onBlur={() => setFocused(null)}
            noValidate
            className="relative"
          >
            <FormGuards />

            <Reveal stagger as="div" y="base" className="flex flex-col gap-6">
              <TextInput
                label="Your name"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                defaultValue={values.name}
                error={errors.name}
                placeholder="Who is writing"
              />

              <TextInput
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={200}
                defaultValue={values.email}
                error={errors.email}
                placeholder="Where the reply should go"
              />

              <RadioCards
                label="What is this about"
                name="topic"
                options={contactTopics.map((topic) => ({
                  value: topic.value,
                  label: topic.label,
                  hint: topic.hint,
                }))}
                defaultValue={values.topic}
                error={errors.topic}
              />

              <TextareaInput
                label="Message"
                name="message"
                required
                maxLength={4000}
                rows={6}
                defaultValue={values.message}
                error={errors.message}
                placeholder="The more specific, the faster we can help."
              />

              <div className="flex flex-col gap-4">
                <FormError state={state} />
                <SubmitButton pending="Sending">Send message</SubmitButton>
              </div>
            </Reveal>
          </form>
        )}
      </div>

      {/* Above the form on a phone, beside it from lg. It is feedback on the
          form, so on a narrow screen it goes where it can be seen before the
          fields push it off the top. */}
      <div className="order-first lg:order-none lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:col-span-5">
        <ContactTable
          cards={CARDS}
          played={played}
          focused={focused}
          sent={sent}
        />
      </div>
    </div>
  );
}
