import { headers } from "next/headers";

/**
 * Render one or more JSON-LD blocks with the CSP nonce.
 * Pass either a single object or an array of objects.
 */
export async function JsonLd({ data }: { data: unknown | unknown[] }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
