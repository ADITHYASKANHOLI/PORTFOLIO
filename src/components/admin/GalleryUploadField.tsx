import React, { useState, useRef } from 'react';
import { uploadMediaFile } from '@/lib/data/api';
import { X, Loader2, Plus, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface GalleryUploadFieldProps {
  label: string;
  values?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  description?: string;
}

export const GalleryUploadField: React.FC<GalleryUploadFieldProps> = ({
  label,
  values = [],
  onChange,
  folder = 'general/gallery',
  description,
}) => {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage(null);

    const newUrls: string[] = [];
    let uploadErrors = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadMediaFile(file, folder);
        newUrls.push(res.publicUrl);
      } catch (err: any) {
        console.error('Gallery file upload failed:', err);
        uploadErrors++;
      }
    }

    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
    }

    if (uploadErrors > 0) {
      setErrorMessage(`${uploadErrors} file(s) failed to upload.`);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'prev' | 'next') => {
    if (
      (direction === 'prev' && index === 0) ||
      (direction === 'next' && index === values.length - 1)
    ) {
      return;
    }

    const updated = [...values];
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setManualUrl('');
    setShowManualInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] text-sage uppercase tracking-technical">
          {label} ({values.length})
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="font-mono text-[10px] text-copper hover:text-white transition-colors"
        >
          {showManualInput ? '− Hide URL input' : '+ Add via URL'}
        </button>
      </div>

      {description && (
        <p className="font-sans text-xs text-[#9299A3]">{description}</p>
      )}

      {/* Hidden file input supporting multiple files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/gif"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Optional direct URL input */}
      {showManualInput && (
        <div className="flex items-center gap-2 p-2 rounded bg-surface border border-borderBase/30">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 bg-background text-paper font-mono text-xs px-2.5 py-1.5 rounded border border-borderBase/30 focus:border-copper focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddManualUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            disabled={!manualUrl.trim()}
            className="px-3 py-1.5 rounded bg-copper/20 text-copper border border-copper/30 font-mono text-xs hover:bg-copper/30 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      {/* Gallery Grid & Upload Trigger */}
      <div className="p-3 rounded-lg bg-surface border border-borderBase/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {values.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group aspect-[4/3] rounded-md bg-[#08090B] border border-borderBase/30 overflow-hidden flex items-center justify-center"
            >
              <img
                src={url}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.svg';
                }}
              />

              {/* Action buttons on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-10">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-white/80 bg-black/50 px-1 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 rounded bg-red-950/80 text-red-200 hover:bg-red-800 border border-red-500/50"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex justify-center gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'prev')}
                      className="p-1 rounded bg-black/70 text-white hover:bg-black border border-white/20"
                      title="Move backward"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {idx < values.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'next')}
                      className="p-1 rounded bg-black/70 text-white hover:bg-black border border-white/20"
                      title="Move forward"
                    >
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add More Photos Card */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-[4/3] rounded-md border-2 border-dashed border-borderBase/40 hover:border-copper/60 bg-background/50 hover:bg-copper/5 flex flex-col items-center justify-center gap-1.5 text-sage hover:text-copper transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-copper" />
                <span className="font-mono text-[10px]">Uploading...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="font-mono text-[10px] text-center px-1">Add Image(s)</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-2.5 p-2 rounded bg-red-950/30 border border-red-500/30 flex items-center gap-2 text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
