"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import type { Dictionary } from "@/lib/i18n";

export function FaqAccordion({ dict }: { dict: Dictionary }) {
  return (
    <Accordion className="mx-auto w-full max-w-3xl">
      {dict.faq.items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
