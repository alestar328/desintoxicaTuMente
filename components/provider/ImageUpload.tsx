"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  hint?: string;
  maxFiles?: number;
  value?: string[];          // URLs/base64 de imágenes ya cargadas
  onChange?: (files: string[]) => void;
  aspectRatio?: "square" | "landscape";
}

/**
 * Componente de subida de imágenes — UX mock con preview local.
 * TODO Supabase Storage: reemplazar el preview local (FileReader/base64) por:
 *   1. supabase.storage.from('activity-images').upload(path, file)
 *   2. supabase.storage.from('activity-images').getPublicUrl(path)
 * Las URLs resultantes se guardan en activities.image_urls (array en Supabase).
 */
export default function ImageUpload({
  label,
  hint,
  maxFiles = 3,
  value = [],
  onChange,
  aspectRatio = "landscape",
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref para acceso síncrono al valor actual sin depender del closure del updater
  const previewsRef = useRef<string[]>(value);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const toAdd = Array.from(files).slice(0, maxFiles - previewsRef.current.length);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const updated = [...previewsRef.current, url];
        previewsRef.current = updated;
        setPreviews(updated);
        onChange?.(updated);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    const updated = previews.filter((_, i) => i !== index);
    previewsRef.current = updated;
    setPreviews(updated);
    onChange?.(updated);
  }

  const aspectClass = aspectRatio === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink">{label}</label>
      {hint && <p className="text-xs text-ink-light -mt-2">{hint}</p>}

      {/* Imágenes existentes */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div key={i} className={`relative group rounded-xl overflow-hidden bg-sand ${aspectClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-7 h-7 bg-ink/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink focus:outline-none focus:opacity-100"
                aria-label="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zona de drop */}
      {previews.length < maxFiles && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 px-4 cursor-pointer transition-colors duration-200
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-sand/50"}
          `}
          role="button"
          aria-label="Subir imagen"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            {isDragging ? (
              <Upload className="w-5 h-5 text-primary" />
            ) : (
              <ImageIcon className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ink">
              {isDragging ? "Suelta aquí" : "Arrastra o haz clic para subir"}
            </p>
            <p className="text-xs text-ink-light mt-0.5">
              JPG, PNG o WebP · Máx. {maxFiles} {maxFiles === 1 ? "imagen" : "imágenes"}
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
