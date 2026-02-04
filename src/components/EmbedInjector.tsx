"use client";

import { useEffect, useRef } from "react";

type Embed = {
  id: number | string;
  code: string;
  placement: string;
};

export function EmbedInjector({ embeds, nonce }: { embeds: Embed[]; nonce?: string }) {
  const injectedRef = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    embeds.forEach((e) => {
      if (injectedRef.current.has(e.id)) return;

      try {
        const target = e.placement === "HEAD" ? document.head : document.body;
        
        // Create a temporary container to parse the string
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = e.code;

        // Convert childNodes to an array to iterate safely while moving them
        const nodes = Array.from(tempDiv.childNodes);

        nodes.forEach((node) => {
          if (node.nodeName === "SCRIPT") {
            const originalScript = node as HTMLScriptElement;
            const newScript = document.createElement("script");
            
            // Copy all attributes
            Array.from(originalScript.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            
            if (nonce) {
              newScript.setAttribute("nonce", nonce);
            }

            // Copy content
            newScript.textContent = originalScript.textContent;
            
            // Special handling for inline scripts to ensure they run
            // (Setting textContent usually works, but src scripts are handled by attributes)
            
            // Determine insertion point
            if (e.placement === "BODY") {
              target.insertBefore(newScript, target.firstChild);
            } else {
              target.appendChild(newScript);
            }
          } else {
            // Non-script nodes (styles, divs, comments) can be moved directly
            // Clone to be safe, though moving works if we don't need the tempDiv anymore
            if (e.placement === "BODY") {
               target.insertBefore(node, target.firstChild);
            } else {
               target.appendChild(node);
            }
          }
        });

        injectedRef.current.add(e.id);
      } catch (err) {
        console.error("Embed injection error:", err);
      }
    });
  }, [embeds]);

  return null;
}
