"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  FileInput,
  FormError,
  FormGuards,
  SelectInput,
  SentPanel,
  SubmitButton,
  TextareaInput,
  TextInput,
} from "@/components/forms";
import { Reveal } from "@/components/motion";
import { sendApplication } from "@/lib/forms/actions";
import { CV_ACCEPT, idleState } from "@/lib/forms/fields";

import { applyHash } from "./role-id";

/**
 * The application form at the foot of the careers page.
 *
 * Deliberately not the contact form. An application and a support message are
 * read by different people and answered on different timescales, so they are
 * separate actions posting to separate inboxes, and this one asks for the two
 * things a hiring reply actually needs: which role, and something to look at.
 *
 * No card table here either. The stage on the contact page is progress
 * feedback on a form somebody is filling in on impulse; an application is not
 * a game and dealing cards at a candidate would be the animation that fails
 * the "what does this communicate" question.
 *
 * **The role preselects itself from the hash.** An Apply button in the role
 * switcher links to `#apply-<slug>`, and this reads that back on arrival and
 * on every later hash change, so pressing Apply on a role lands here with that
 * role already chosen. Without JavaScript the link still scrolls the form into
 * view and the select is simply left on its first option.
 */

export function ApplyForm({ roles }: { roles: readonly string[] }) {
  const [state, formAction] = useActionState(sendApplication, idleState);
  const form = useRef<HTMLFormElement>(null);
  const role = useRef<HTMLSelectElement>(null);

  const sent = state.status === "success";
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  useEffect(() => {
    const select = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const match = roles.find((title) => applyHash(title) === hash);
      if (match && role.current) role.current.value = match;
    };

    select();
    window.addEventListener("hashchange", select);
    return () => window.removeEventListener("hashchange", select);
  }, [roles]);

  // A rejected submit puts the focus on the first field that needs work.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;

    const first = Object.keys(state.errors)[0];
    if (!first) return;

    form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  if (sent) {
    return (
      <SentPanel
        title="Application received"
        message={state.message ?? ""}
        actionLabel="Apply for another role"
      />
    );
  }

  return (
    <form ref={form} action={formAction} noValidate className="relative">
      <FormGuards />

      <Reveal stagger as="div" y="base" className="flex flex-col gap-6">
        <SelectInput
          label="Role"
          name="role"
          required
          ref={role}
          defaultValue={values.role}
          error={errors.role}
          options={roles.map((title) => ({ value: title, label: title }))}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="Your name"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            defaultValue={values.name}
            error={errors.name}
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
          />
        </div>

        <TextInput
          label="Portfolio link"
          name="portfolio"
          type="url"
          inputMode="url"
          autoComplete="url"
          maxLength={500}
          defaultValue={values.portfolio}
          error={errors.portfolio}
          hint="Something we can open. GitHub, ArtStation, a personal site."
          placeholder="https://"
        />

        {/* A file input cannot be repopulated by the browser, so a rejected
            submit clears this one and only this one. The hint says so rather
            than letting somebody press send twice before noticing. */}
        <FileInput
          label="CV"
          name="cv"
          accept={CV_ACCEPT}
          error={errors.cv}
          hint="PDF, DOC or DOCX, up to 5MB. Reattach it if the form comes back with a correction."
        />

        <TextareaInput
          label="Tell us about you"
          name="message"
          required
          maxLength={4000}
          rows={6}
          defaultValue={values.message}
          error={errors.message}
          placeholder="What you have built, and what you want to build next."
        />

        <div className="flex flex-col gap-4">
          <FormError state={state} />
          <SubmitButton pending="Sending">Send application</SubmitButton>
        </div>
      </Reveal>
    </form>
  );
}
