"use client";

import { useEffect } from "react";

type Embed = {
  id: number | string;
  code: string;
  placement: string; // Using string to match Prisma enum loosely
};

export function EmbedInjector({ embeds }: { embeds: Embed[] }) {
  useEffect(() => {
    embeds.forEach((e) => {
      try {
        const target = e.placement === "HEAD" ? document.head : document.body;
        // Match original logic:
        // HEAD -> beforeend
        // BODY -> afterbegin
        // FOOTER -> beforeend
        let position: InsertPosition = "beforeend";
        if (e.placement === "BODY") position = "afterbegin";
        
        target.insertAdjacentHTML(position, e.code);
      } catch (err) {
        console.error("Embed injection error:", err);
      }
    });
  }, [embeds]);

  return null;
}
