import React, { useState, useRef } from 'react';
import { uploadMediaFile } from '@/lib/data/api';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  placeholder = 'e.g. /hardware/esp32.svg or uploaded storage URL',
  description,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = previewUrl || value;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create immediate local object URL for snappy preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage(null);

    try {
      const res = await uploadMediaFile(file, folder);
      onChange(res.publicUrl);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3500);
    } catch (err: any) {
      setUploadStatus('error');
      setErrorMessage(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setPreviewUrl(null);
    setUploadStatus('idle');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] text-sage uppercase tracking-technical">
          {label}
        </label>
        {uploadStatus === 'success' && (
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Uploaded to Storage
          </span>
        )}
      </div>

      {description && (
        <p className="font-sans text-xs text-[#9299A3]">{description}</p>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview and Upload Action Card */}
      <div className="p-3.5 rounded-lg bg-surface border border-borderBase/20 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* Thumbnail Preview Area */}
          <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-md bg-[#08090B] border border-borderBase/30 overflow-hidden flex items-center justify-center shrink-0 group">
            {displayImage ? (
              <>
                <img
                  src={displayImage}
                  alt="Preview"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback visual on image loading error
                    (e.target as HTMLImageElement).src = '/favicon.svg';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-950/80 text-red-200 hover:bg-red-900 border border-red-500/50 transition-colors shadow-md"
                  title="Remove Image"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-sage text-center p-2">
                <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                <span className="font-mono text-[10px]">No Image</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-1 text-white z-10">
                <Loader2 className="w-5 h-5 animate-spin text-copper" />
                <span className="font-mono text-[9px]">Uploading...</span>
              </div>
            )}
          </div>

          {/* Action Controls & URL Input */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-1.5 rounded bg-copper/15 hover:bg-copper/25 text-copper border border-copper/30 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : displayImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>

              {displayImage && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded bg-red-950/30 hover:bg-red-950/50 text-red-400 border border-red-500/30 font-mono text-xs transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Direct URL input fallback */}
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setPreviewUrl(null);
              }}
              placeholder={placeholder}
              className="w-full px-3 py-1.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
            />
          </div>
        </div>

        {/* Error message banner */}
        {uploadStatus === 'error' && errorMessage && (
          <div className="p-2.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-[11px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-white underline hover:no-underline text-[10px]"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

