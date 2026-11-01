import React, { useState } from 'react';
import { uploadMediaFile } from '@/lib/data/api';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Upload,
  Copy,
  Check,
  AlertCircle,
  Database
} from 'lucide-react';

export const MediaManagerPage: React.FC = () => {
  const { isSupabaseMode } = useAuth();
  const [folder, setFolder] = useState('projects/covers');
  const [uploading, setUploading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<{ path: string; url: string; time: string }[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      const res = await uploadMediaFile(file, folder);
      setUploadedItems((prev) => [
        {
          path: res.path,
          url: res.publicUrl,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Media upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Storage & Assets
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Media Manager
          </h1>
        </div>
      </div>

      {/* Storage Mode Notice */}
      <div className="p-4 rounded bg-surface border border-borderBase/15 flex items-start gap-3">
        <Database className="w-5 h-5 text-copper shrink-0 mt-0.5" />
        <div className="font-mono text-xs space-y-1">
          <p className="text-paper font-semibold">
            Target Bucket: <code className="text-copper">portfolio-media</code>
          </p>
          <p className="font-sans text-sage text-xs">
            {isSupabaseMode
              ? 'Connected to live Supabase Storage bucket. Uploaded images receive public CDN URLs.'
              : 'Local demo mode active. Uploaded images are converted to data URLs and cached for testing.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-8 rounded bg-surface border-2 border-dashed border-borderBase/25 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-forest border border-copper/40 flex items-center justify-center mx-auto text-copper">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-paper">
            Upload Image Asset
          </h3>
          <p className="font-sans text-xs text-sage mt-1">
            Accepts JPEG, PNG, WebP or SVG up to 5MB.
          </p>
        </div>

        <div className="max-w-xs mx-auto flex items-center gap-2 pt-2">
          <span className="font-mono text-xs text-sage whitespace-nowrap">Target Folder:</span>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
          >
            <option value="portrait">portrait/</option>
            <option value="projects/covers">projects/covers/</option>
            <option value="projects/gallery">projects/gallery/</option>
            <option value="general">general/</option>
          </select>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical cursor-pointer hover:bg-copper-dark transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Processing & Uploading...' : 'Select File to Upload'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Recently Uploaded Assets */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-paper">
          Session Upload History ({uploadedItems.length})
        </h2>

        {uploadedItems.length === 0 ? (
          <div className="p-8 rounded bg-surface border border-borderBase/10 text-center font-mono text-xs text-sage">
            No files uploaded during this session yet. Upload files above or from the Project / Content forms.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded bg-surface border border-borderBase/15 p-4 space-y-3"
              >
                <div className="aspect-video rounded overflow-hidden bg-forest border border-borderBase/10">
                  <img
                    src={item.url}
                    alt={item.path}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-xs text-paper truncate font-semibold">
                    {item.path}
                  </p>
                  <p className="font-mono text-[10px] text-sage">
                    Uploaded at {item.time}
                  </p>
                </div>

                <button
                  onClick={() => copyUrl(item.url)}
                  className="w-full py-1.5 px-3 rounded bg-surface-elevated border border-borderBase/20 text-sage hover:text-paper hover:border-copper/40 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedUrl === item.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-copper" />
                      <span className="text-copper">URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
