"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD, type FormState } from "@/lib/forms/fields";

/**
 * The parts every form on this site shares.
 *
 * `useFormStatus` has to read the pending state from inside the `<form>`, so
 * the submit button is its own component. That is the whole reason this file
 * exists rather than the button living in the form.
 */

export function SubmitButton({
  children,
  pending: label,
  className,
}: {
  children: string;
  pending: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      // `aria-disabled` rather than `disabled`: a disabled control drops out of
      // the tab order mid-interaction, which moves the focus somewhere the
      // visitor did not ask to go. The action itself ignores a second submit.
      aria-disabled={pending}
      className={cn("w-full sm:w-auto", className)}
    >
      <span
        aria-hidden
        className={cn(
          "bg-inverse/90 h-2 w-2 rounded-full transition-transform duration-[var(--duration-hover)] ease-out",
          pending ? "scale-100 animate-pulse" : "scale-0",
        )}
      />
      {pending ? label : children}
    </Button>
  );
}

/**
 * Two hidden fields, both anti-spam.
 *
 * The honeypot is a field a person never sees and a naive bot always fills.
 * The timestamp is written on mount, so a submission that arrives faster than
 * a human could type is rejected. Neither is a real defence — see the note in
 * lib/forms/fields.ts — and neither costs a visitor anything.
 */
export function FormGuards() {
  const stamp = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stamp.current) stamp.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`field-${HONEYPOT_FIELD}`}>Company</label>
        <input
          id={`field-${HONEYPOT_FIELD}`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={stamp} type="hidden" name={RENDERED_AT_FIELD} defaultValue="" />
    </>
  );
}

/**
 * The message above the form after a failed submit.
 *
 * Success is not rendered here — both forms replace themselves with a real
 * confirmation panel, because a green bar above a form still full of the text
 * somebody just sent reads as "not sent yet".
 */
export function FormError({ state }: { state: FormState }) {
  if (state.status !== "error" || !state.message) return null;

  return (
    <p
      role="alert"
      className="border-accent bg-accent-tint text-accent-text rounded-md border-l-[3px] px-4 py-3 text-sm"
    >
      {state.message}
    </p>
  );
}
