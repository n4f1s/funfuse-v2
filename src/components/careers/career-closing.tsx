import { Reveal } from "@/components/motion";
import { Button, Section } from "@/components/ui";

export function CareerClosing({
  email,
  description,
}: {
  email: string;
  description: string;
}) {
  return (
    <Section tone="sunken" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[32px] border-brand-100 sm:right-[8%]"
      />
      <Reveal as="div" y="lg" className="relative z-1 max-w-2xl">
        <h2
          id="apply-heading"
          className="text-h2 text-heading font-semibold tracking-tightest"
        >
          Apply to join our team
        </h2>
        <p className="text-muted mt-5 max-w-xl text-lg">{description}</p>
        <Button
          href={`mailto:${email}`}
          size="lg"
          className="mt-8 w-full sm:w-auto"
        >
          {email}
        </Button>
      </Reveal>
    </Section>
  );
}
