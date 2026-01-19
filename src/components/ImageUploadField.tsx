"use client";
import { useRef, useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  accept?: string;
  previewHeight?: number;
};

export function ImageUploadField({
  id,
  name,
  label,
  accept = "image/*",
  previewHeight = 160,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        ref={inputRef}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
          } else {
            setPreview(null);
          }
        }}
      />
      <div
        className="mt-2 rounded-xl border border-zinc-800 bg-black overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ height: previewHeight }}
        role="button"
        tabIndex={0}
        aria-label={`Pilih ${label}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-xs text-zinc-500">Belum ada gambar dipilih</div>
        )}
      </div>
    </div>
  );
}
