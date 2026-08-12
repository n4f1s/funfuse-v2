import { Resend } from "resend";

/**
 * The mail transport.
 *
 * Resend is the one runtime dependency on this site beyond the framework and
 * GSAP. It is here because the two forms have to reach a person, and a hosted
 * API is a smaller commitment than an SMTP credential in the environment.
 *
 * Configuration is read at call time, never at module scope. Reading it at
 * import time would make a missing variable a build failure on a page that
 * only needs it when somebody presses submit.
 */

export type MailConfig = {
  client: Resend;
  /** Must be on a domain verified in Resend, or the API rejects the send. */
  from: string;
  contactTo: string;
  careersTo: string;
};

/**
 * Returns null when the environment is not configured. The caller turns that
 * into "write to us directly" rather than a stack trace: a form that says
 * nothing is worse than a form that says where else to go.
 */
export function mailConfig(): MailConfig | null {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const contactTo = process.env.CONTACT_TO_EMAIL;

  if (!key || !from || !contactTo) return null;

  return {
    client: new Resend(key),
    from,
    contactTo,
    // Applications go to HR when that inbox is set, and to the general
    // address when it is not. One missing variable must not lose a candidate.
    careersTo: process.env.CAREERS_TO_EMAIL || contactTo,
  };
}
