"use server";

import { buildMessage } from "@/lib/email/messages";
import { mailConfig } from "@/lib/email/resend";
import {
  choice,
  cv as cvField,
  email as emailField,
  headerSafe,
  isBot,
  link,
  text,
  type FieldErrors,
  type FormState,
} from "@/lib/forms/fields";
import { contactTopicValues } from "@/content/contact";
import { careersContent } from "@/content/careers";

/**
 * The two server actions behind the forms.
 *
 * Shape of every one of them:
 *   1. reject obvious bots silently, with the same success the visitor sees,
 *   2. validate, and return field errors without sending anything,
 *   3. send, and return a message the visitor can act on if it fails.
 *
 * A validation failure returns the submitted values so the form refills
 * itself. Nothing here ever logs a message body: what somebody wrote to
 * support is not ours to leave in a platform log.
 */

/** Bots get the success screen. Telling them they were caught teaches them. */
const PRETEND_SENT: FormState = {
  status: "success",
  message: "Thanks. Your message is on its way.",
};

function invalid(errors: FieldErrors, values: Record<string, string>): FormState {
  return {
    status: "error",
    message: "Have another look at the fields marked below.",
    errors,
    values,
  };
}

const UNCONFIGURED =
  "The message could not be sent right now. Please write to us directly at the address on this page.";

const FAILED =
  "Something went wrong sending that. Please try again, or write to us directly at the address on this page.";

export async function sendContactMessage(
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  if (isBot(form)) return PRETEND_SENT;

  const name = text(form, "name", { label: "Name", min: 2, max: 80 });
  const from = emailField(form, "email");
  const topic = choice(form, "topic", contactTopicValues, "Topic");
  const message = text(form, "message", {
    label: "Message",
    min: 10,
    max: 4000,
    multiline: true,
  });

  const values = {
    name: name.value,
    email: from.value,
    topic: topic.value,
    message: message.value,
  };

  const errors: FieldErrors = {};
  if (name.error) errors.name = name.error;
  if (from.error) errors.email = from.error;
  if (topic.error) errors.topic = topic.error;
  if (message.error) errors.message = message.error;

  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const config = mailConfig();
  if (!config) return { status: "error", message: UNCONFIGURED, values };

  const mail = buildMessage({
    title: `New ${topic.value.toLowerCase()} message`,
    subject: `[${headerSafe(topic.value)}] ${headerSafe(name.value)}`,
    fields: [
      { label: "From", value: name.value },
      { label: "Email", value: from.value },
      { label: "Topic", value: topic.value },
    ],
    bodyLabel: "Message",
    body: message.value,
  });

  try {
    const { error } = await config.client.emails.send({
      from: config.from,
      to: config.contactTo,
      // Hitting reply in the inbox answers the visitor, not the website.
      replyTo: `${headerSafe(name.value)} <${from.value}>`,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });

    if (error) {
      // The provider's message, not the visitor's message.
      console.error("contact: resend rejected the send", error);
      return { status: "error", message: FAILED, values };
    }
  } catch (cause) {
    console.error("contact: send threw", cause);
    return { status: "error", message: FAILED, values };
  }

  return {
    status: "success",
    message: "Thanks. Your message is with us and we will reply to that address.",
  };
}

const ROLE_TITLES = careersContent.jobs.map((job) => job.title);

export async function sendApplication(
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  if (isBot(form)) return PRETEND_SENT;

  const name = text(form, "name", { label: "Name", min: 2, max: 80 });
  const from = emailField(form, "email");
  const role = choice(form, "role", ROLE_TITLES, "Role");
  const portfolio = link(form, "portfolio", "Portfolio or CV link");
  const attachment = await cvField(form, "cv");
  const message = text(form, "message", {
    label: "Message",
    min: 10,
    max: 4000,
    multiline: true,
  });

  const values = {
    name: name.value,
    email: from.value,
    role: role.value,
    portfolio: portfolio.value,
    message: message.value,
  };

  const errors: FieldErrors = {};
  if (name.error) errors.name = name.error;
  if (from.error) errors.email = from.error;
  if (role.error) errors.role = role.error;
  if (portfolio.error) errors.portfolio = portfolio.error;
  if (attachment.error) errors.cv = attachment.error;
  if (message.error) errors.message = message.error;

  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const config = mailConfig();
  if (!config) return { status: "error", message: UNCONFIGURED, values };

  const mail = buildMessage({
    title: "New application",
    subject: `Application: ${headerSafe(role.value)} - ${headerSafe(name.value)}`,
    fields: [
      { label: "Name", value: name.value },
      { label: "Email", value: from.value },
      { label: "Role", value: role.value },
      { label: "Portfolio", value: portfolio.value, link: true },
      { label: "CV", value: attachment.value?.name ?? "" },
    ],
    bodyLabel: "About them",
    body: message.value,
  });

  try {
    const { error } = await config.client.emails.send({
      from: config.from,
      to: config.careersTo,
      replyTo: `${headerSafe(name.value)} <${from.value}>`,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      // Resend takes the raw bytes. The file is never written to disk, never
      // parsed and never served: it goes from the request straight onto the
      // email and out.
      attachments: attachment.value
        ? [
            {
              filename: attachment.value.name,
              content: Buffer.from(attachment.value.bytes),
            },
          ]
        : undefined,
    });

    if (error) {
      console.error("careers: resend rejected the send", error);
      return { status: "error", message: FAILED, values };
    }
  } catch (cause) {
    console.error("careers: send threw", cause);
    return { status: "error", message: FAILED, values };
  }

  return {
    status: "success",
    message: "Thanks for applying. We read every application and reply to that address.",
  };
}
