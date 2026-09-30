"use client";
import { useState } from "react";
import { GameArt } from "./GameArt";

// Uploaded image layered over generated artwork. If the upload is missing
// or fails to load, the artwork shows through instead of a broken image.
export function ArtImage({
  src,
  alt,
  seed,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  seed: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = !!src && !failed;
  return (
    <div className={`absolute inset-0 ${className}`}>
      <GameArt seed={seed} className="absolute inset-0 h-full w-full" />
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
