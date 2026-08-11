"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Route-level error boundary. Must be a Client Component.
 * Keep it calm and actionable — an error screen is not a place for motion.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the real reporter once one is wired up.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-center py-20">
      <div className="max-w-xl">
        <h1 className="text-h1 text-heading font-bold">Something broke</h1>
        <p className="text-muted mt-4 text-lg">
          This page failed to load. Trying again usually fixes it.
        </p>
        {error.digest ? (
          <p className="text-faint mt-3 text-sm">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </Container>
  );
}
