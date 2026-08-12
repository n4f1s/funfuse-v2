import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The form controls.
 *
 * Three rules hold this together:
 *   - the label is a real `<label>` wired to a real id. Placeholder-as-label
 *     disappears the moment somebody starts typing, which is exactly when they
 *     need to know what the field was.
 *   - an error is announced, not just coloured. `aria-invalid` plus
 *     `aria-describedby` is what makes the message reach a screen reader, and
 *     the message text never relies on the red to make sense.
 *   - focus keeps the global outline from globals.css. The border colour is an
 *     addition to it, never a replacement.
 *
 * `data-field` marks the blocks a form staggers in. Nothing else reads it.
 */

const control = [
  "w-full rounded-md border bg-surface px-4 py-3",
  "text-base text-body placeholder:text-faint",
  "border-line hover:border-line-strong",
  "transition-[border-color,background-color] duration-[var(--duration-hover)] ease-out",
  "aria-[invalid=true]:border-accent-strong",
  "disabled:opacity-60",
].join(" ");

function Shell({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div data-field>
      <label
        htmlFor={id}
        className="text-heading flex items-baseline gap-2 text-sm font-medium"
      >
        {label}
        {optional ? (
          <span className="text-faint text-xs font-normal">Optional</span>
        ) : null}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="text-muted mt-1 text-sm">
          {hint}
        </p>
      ) : null}

      <div className="mt-2">{children}</div>

      {/* Polite, not assertive: the message appears as the visitor moves on,
          and interrupting them mid-field to read it is worse than waiting. */}
      <p
        id={`${id}-error`}
        role="status"
        aria-live="polite"
        className={cn(
          "text-accent-text mt-2 text-sm",
          error ? "block" : "hidden",
        )}
      >
        {error}
      </p>
    </div>
  );
}

/** ids the control points at, once, so the two can never disagree. */
function described(id: string, error?: string, hint?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );

  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  };
}

type Common = { label: string; error?: string; hint?: string };

export function TextInput({
  label,
  error,
  hint,
  name,
  className,
  ...rest
}: Common & ComponentPropsWithRef<"input">) {
  const id = `field-${name}`;

  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={!rest.required}>
      <input
        {...described(id, error, hint)}
        name={name}
        className={cn(control, className)}
        {...rest}
      />
    </Shell>
  );
}

export function TextareaInput({
  label,
  error,
  hint,
  name,
  className,
  ...rest
}: Common & ComponentPropsWithRef<"textarea">) {
  const id = `field-${name}`;

  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={!rest.required}>
      <textarea
        {...described(id, error, hint)}
        name={name}
        // `field-sizing: content` grows the box with the text on browsers that
        // have it, and `rows` is the floor everywhere else.
        className={cn(control, "min-h-36 resize-y [field-sizing:content]", className)}
        {...rest}
      />
    </Shell>
  );
}

export function SelectInput({
  label,
  error,
  hint,
  name,
  options,
  className,
  ...rest
}: Common & {
  options: readonly { value: string; label: string }[];
} & ComponentPropsWithRef<"select">) {
  const id = `field-${name}`;

  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={!rest.required}>
      <select
        {...described(id, error, hint)}
        name={name}
        className={cn(control, "appearance-none pr-10", className)}
        // The chevron is a background image rather than an inline SVG element,
        // so the native control keeps its own keyboard and picker behaviour on
        // every platform. See AGENTS.md on hand-drawn icons.
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23635857' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 8 5 5 5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.85rem center",
          backgroundSize: "1.1rem",
        }}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

/**
 * The CV upload.
 *
 * A real `<input type="file">`, styled through `::file-selector-button` rather
 * than hidden behind a decorative button. Keeping the native control means the
 * platform's own file picker, its keyboard behaviour and its drag-and-drop all
 * arrive for free, and there is no state to get out of step with the form.
 *
 * `accept` and the size note are conveniences. The rules that decide are in
 * lib/forms/fields.ts, on the server, where a POST cannot skip them.
 */
export function FileInput({
  label,
  error,
  hint,
  name,
  className,
  ...rest
}: Common & ComponentPropsWithRef<"input">) {
  const id = `field-${name}`;

  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={!rest.required}>
      <input
        {...described(id, error, hint)}
        type="file"
        name={name}
        className={cn(
          "border-line hover:border-line-strong w-full rounded-md border border-dashed bg-transparent p-3",
          "text-muted text-sm",
          "duration-[var(--duration-hover)] transition-[border-color,background-color] ease-out",
          "aria-[invalid=true]:border-accent-strong",
          "file:bg-surface-muted file:text-heading file:mr-4 file:cursor-pointer file:rounded-full file:border-0",
          "file:px-4 file:py-2 file:text-sm file:font-medium",
          "file:duration-[var(--duration-press)] file:transition-colors file:ease-out",
          "hover:file:bg-accent-tint hover:file:text-accent-text",
          className,
        )}
        {...rest}
      />
    </Shell>
  );
}

/**
 * A radio group drawn as pressable cards.
 *
 * Used where the choice is the routing decision rather than a detail — the
 * contact topic decides which inbox reads the message, so it is worth the
 * vertical space a select would have saved. Real radios underneath: the label
 * wraps the input, so a click anywhere on the card selects it and the keyboard
 * behaviour is the platform's.
 */
export function RadioCards({
  label,
  error,
  name,
  options,
  defaultValue,
}: Common & {
  name: string;
  options: readonly { value: string; label: string; hint?: string }[];
  defaultValue?: string;
}) {
  const id = `field-${name}`;

  return (
    <fieldset data-field>
      <legend className="text-heading text-sm font-medium">{label}</legend>

      <div
        className="mt-3 grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "group border-line bg-surface relative cursor-pointer rounded-md border p-4",
              "duration-[var(--duration-hover)] transition-[border-color,background-color,transform] ease-out",
              "hover:border-line-strong hover:bg-surface-muted active:scale-[0.99]",
              "has-[:checked]:border-accent has-[:checked]:bg-accent-tint",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-focus)]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="sr-only"
            />
            <span className="text-heading block text-sm font-medium">
              {option.label}
            </span>
            {option.hint ? (
              <span className="text-muted mt-1 block text-sm">{option.hint}</span>
            ) : null}
          </label>
        ))}
      </div>

      <p
        id={`${id}-error`}
        role="status"
        aria-live="polite"
        className={cn("text-accent-text mt-2 text-sm", error ? "block" : "hidden")}
      >
        {error}
      </p>
    </fieldset>
  );
}
