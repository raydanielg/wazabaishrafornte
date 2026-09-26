import { Section } from "./section";

/** Consistent page header for subpages. */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Section className="border-b border-border py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </Section>
  );
}
