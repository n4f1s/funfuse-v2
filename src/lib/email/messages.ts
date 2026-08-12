/**
 * The two emails this site sends.
 *
 * Both are built as text first and HTML second, and the HTML is a table of the
 * same fields rather than a designed template. These land in a support inbox
 * and get read on a phone between other things; the job is legibility and
 * being able to hit reply, not branding.
 *
 * Every interpolated value is visitor input, so every one of them is escaped.
 */

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type MessageField = { label: string; value: string; link?: boolean };

export type Message = { subject: string; text: string; html: string };

export function buildMessage({
  title,
  fields,
  body,
  bodyLabel,
  subject,
}: {
  /** The heading inside the email. */
  title: string;
  fields: readonly MessageField[];
  /** The free-text part, kept out of the table so paragraphs survive. */
  body: string;
  bodyLabel: string;
  subject: string;
}): Message {
  const rows = fields.filter((field) => field.value);

  const text = [
    title,
    "",
    ...rows.map((field) => `${field.label}: ${field.value}`),
    "",
    `${bodyLabel}:`,
    body,
    "",
    "Sent from the funfusegames.com website.",
  ].join("\n");

  const html = [
    `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#221a19">`,
    `<h2 style="font-size:17px;margin:0 0 16px">${escape(title)}</h2>`,
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">`,
    ...rows.map((field) => {
      const value = field.link
        ? `<a href="${escape(field.value)}" style="color:#aa1b2a">${escape(field.value)}</a>`
        : escape(field.value);

      return `<tr><td style="padding:4px 16px 4px 0;color:#635857;vertical-align:top">${escape(field.label)}</td><td style="padding:4px 0">${value}</td></tr>`;
    }),
    `</table>`,
    `<p style="margin:0 0 6px;color:#635857">${escape(bodyLabel)}</p>`,
    // `pre-wrap` keeps the visitor's own line breaks without turning the body
    // into monospace, which is what a <pre> would do.
    `<div style="white-space:pre-wrap;border-left:3px solid #ffc9c5;padding-left:14px">${escape(body)}</div>`,
    `<p style="margin:24px 0 0;font-size:13px;color:#817776">Sent from the funfusegames.com website.</p>`,
    `</div>`,
  ].join("");

  return { subject, text, html };
}
