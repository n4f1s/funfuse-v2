/**
 * Form parsing and validation.
 *
 * Deliberately hand written. Both forms on this site have five fields between
 * them, and a schema library would be the second largest dependency in the
 * project for rules that fit on one screen. See AGENTS.md.
 *
 * Everything here runs on the server. Client-side validation is the browser's
 * own `required` / `type="email"`, which is a hint, not a gate — this file is
 * the gate.
 */

export type FieldErrors = Record<string, string>;

export type FormState = {
  status: "idle" | "success" | "error";
  /** Shown above the form. A sentence, not a field name. */
  message?: string;
  errors?: FieldErrors;
  /**
   * What the visitor typed, echoed back so a rejected submission does not
   * empty the form. Never includes the honeypot.
   */
  values?: Record<string, string>;
};

export const idleState: FormState = { status: "idle" };

/**
 * The name of the hidden field a human never sees and a naive bot always
 * fills. Named to look like something worth completing.
 */
export const HONEYPOT_FIELD = "company";

/** The hidden field carrying when the form was rendered, in epoch ms. */
export const RENDERED_AT_FIELD = "rendered_at";

/**
 * A submission faster than this is not a person reading a form. It is a speed
 * bump rather than a defence: the value is forgeable, so it stops scripted
 * mass posting and nothing more. Real rate limiting belongs at the edge, in
 * front of this application.
 */
const MIN_FILL_MS = 2500;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Collapses whitespace runs and trims. Leaves interior punctuation alone. */
function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Preserves paragraph breaks; only normalises line endings and trims. */
function cleanMultiline(value: FormDataEntryValue | null): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
    : "";
}

/**
 * Anything that reaches a mail header has to lose its line breaks first.
 * A newline in a subject or a display name is how a header injection starts.
 */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function isBot(form: FormData): boolean {
  if (clean(form.get(HONEYPOT_FIELD)) !== "") return true;

  const rendered = Number(form.get(RENDERED_AT_FIELD));
  if (!Number.isFinite(rendered)) return false;

  return Date.now() - rendered < MIN_FILL_MS;
}

type TextRule = {
  label: string;
  min?: number;
  max: number;
  multiline?: boolean;
  optional?: boolean;
};

export function text(
  form: FormData,
  name: string,
  rule: TextRule,
): { value: string; error?: string } {
  const value = rule.multiline
    ? cleanMultiline(form.get(name))
    : clean(form.get(name));

  if (!value) {
    return rule.optional
      ? { value }
      : { value, error: `${rule.label} is required.` };
  }
  if (rule.min && value.length < rule.min) {
    return { value, error: `${rule.label} needs at least ${rule.min} characters.` };
  }
  if (value.length > rule.max) {
    return { value, error: `${rule.label} has to stay under ${rule.max} characters.` };
  }

  return { value };
}

export function email(form: FormData, name: string): { value: string; error?: string } {
  const value = clean(form.get(name)).toLowerCase();

  if (!value) return { value, error: "Email is required." };
  if (value.length > 200) return { value, error: "That email is too long." };
  if (!EMAIL.test(value)) return { value, error: "That does not look like an email address." };

  return { value };
}

/**
 * A value that has to be one of a fixed list. Used for the contact topic and
 * the role on an application: both are rendered from a constant, so anything
 * else arriving here was not typed into our form.
 */
export function choice(
  form: FormData,
  name: string,
  allowed: readonly string[],
  label: string,
): { value: string; error?: string } {
  const value = clean(form.get(name));

  if (!value) return { value, error: `${label} is required.` };
  if (!allowed.includes(value)) return { value: "", error: `Choose a ${label.toLowerCase()} from the list.` };

  return { value };
}

/** Optional URL. Rejects anything that is not http(s) so a link is clickable. */
export function link(form: FormData, name: string, label: string): { value: string; error?: string } {
  const value = clean(form.get(name));
  if (!value) return { value };
  if (value.length > 500) return { value, error: `${label} is too long.` };

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { value, error: `${label} has to be a web address.` };
    }
    return { value: url.toString() };
  } catch {
    return { value, error: `${label} has to be a web address.` };
  }
}
