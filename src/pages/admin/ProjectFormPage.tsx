import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProjectById, saveProject, uploadMediaFile } from '@/lib/data/api';
import { Project } from '@/types';
import { slugify } from '@/lib/utils';
import { LiquidActionButton, LiquidActionLink } from '@/components/ui';
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';

export const ProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Hardware & Embedded');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().slice(0, 10));
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(false);

  // Uploading state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const p = await fetchProjectById(id);
        if (p) {
          setTitle(p.title);
          setSlug(p.slug);
          setCategory(p.category);
          setShortDescription(p.short_description);
          setFullDescription(p.full_description);
          setCoverImagePath(p.cover_image_path);
          setGallery(p.gallery || []);
          setTechInput((p.technologies || []).join(', '));
          setGithubUrl(p.github_url || '');
          setDemoUrl(p.demo_url || '');
          setExternalUrl(p.external_url || '');
          setProjectDate(p.project_date || new Date().toISOString().slice(0, 10));
          setFeatured(p.featured);
          setDisplayOrder(p.display_order);
          setPublished(p.published);
        } else {
          setErrorMsg('Project not found');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg(null);
    try {
      const res = await uploadMediaFile(file, 'projects/covers');
      setCoverImagePath(res.publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Cover upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setErrorMsg(null);
    try {
      const res = await uploadMediaFile(file, 'projects/gallery');
      setGallery((prev) => [...prev, res.publicUrl]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Project slug is required.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const payload: Partial<Project> = {
        id: isEdit ? id : undefined,
        title: title.trim(),
        slug: slugify(slug),
        category,
        short_description: shortDescription.trim(),
        full_description: fullDescription.trim(),
        cover_image_path: coverImagePath,
        gallery,
        technologies: techArray,
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        external_url: externalUrl.trim() || null,
        project_date: projectDate,
        featured,
        display_order: Number(displayOrder),
        published,
      };

      const saved = await saveProject(payload);
      setSuccessMsg('Project saved successfully!');

      if (!isEdit && saved.id) {
        setTimeout(() => {
          navigate(`/admin/projects/edit/${saved.id}`);
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-sage">
        Loading project data...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div className="flex items-center gap-4">
          <LiquidActionLink
            to="/admin/projects"
            variant="clear"
            size="sm"
            intensity={3}
            thickness={1}
            icon={<ArrowLeft className="w-4 h-4 text-[#D7DCE2]" />}
            aria-label="Return to projects"
          />
          <div>
            <span className="font-mono text-xs text-copper uppercase tracking-technical">
              {isEdit ? 'Modify Project' : 'New Archive Entry'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper">
              {isEdit ? title || 'Edit Project' : 'Create New Project'}
            </h1>
          </div>
        </div>

        {isEdit && slug && (
          <Link
            to={`/project/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-borderBase/15 text-sage hover:text-paper font-mono text-xs"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Metadata */}
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. ESP32 Telemetry Monitor"
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="esp32-telemetry-monitor"
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
              >
                <option value="Hardware & Embedded">Hardware & Embedded</option>
                <option value="Software & Systems">Software & Systems</option>
                <option value="Robotics & Motion">Robotics & Motion</option>
                <option value="Research & Learning">Research & Learning</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Project Date
              </label>
              <input
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Short Description (Card Summary)
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Concise overview for project cards and gallery slides..."
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Full Description (Detailed Narrative)
            </label>
            <textarea
              rows={6}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Comprehensive technical breakdown, hardware components used, architecture, and learnings..."
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Technologies (Comma Separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="ESP32, C++, FreeRTOS, MQTT, Python"
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>
        </div>

        {/* Media Management */}
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Media & Blueprints
          </h2>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical">
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {coverImagePath ? (
                <div className="w-36 h-24 rounded border border-borderBase/20 overflow-hidden bg-forest relative group">
                  <img src={coverImagePath} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImagePath(null)}
                    className="absolute inset-0 bg-forest/80 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center font-mono text-xs transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-36 h-24 rounded border border-dashed border-borderBase/20 bg-forest/40 flex items-center justify-center text-sage">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs cursor-pointer hover:border-copper transition-colors">
                  <Upload className="w-3.5 h-3.5 text-copper" />
                  <span>{uploadingCover ? 'Uploading...' : 'Upload Cover Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                </label>
                <p className="font-mono text-[10px] text-sage/70">
                  JPEG, PNG, WebP or SVG up to 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-3 pt-4 border-t border-borderBase/10">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs text-sage uppercase tracking-technical">
                Gallery Images ({gallery.length})
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs cursor-pointer hover:border-copper transition-colors">
                <Plus className="w-3.5 h-3.5 text-copper" />
                <span>{uploadingGallery ? 'Uploading...' : 'Add Gallery Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded border border-borderBase/20 overflow-hidden group">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-forest/80 text-red-400 hover:text-red-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-sage/60">No additional gallery images added.</p>
            )}
          </div>
        </div>

        {/* External Links */}
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            External Repositories & Demos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Live Demo URL
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                External Documentation URL
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
              />
            </div>
          </div>
        </div>

        {/* Publication Flags */}
        <div className="p-6 rounded bg-surface border border-borderBase/15 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-copper focus:ring-copper bg-surface-elevated border-borderBase/30"
              />
              <span className="font-mono text-xs text-paper uppercase tracking-technical">
                Publish Live to Portfolio
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-copper focus:ring-copper bg-surface-elevated border-borderBase/30"
              />
              <span className="font-mono text-xs text-copper uppercase tracking-technical">
                Mark as Featured Build
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <LiquidActionButton
              type="button"
              variant="clear"
              size="md"
              intensity={3}
              thickness={1}
              onClick={() => navigate('/admin/projects')}
              className="font-mono text-xs uppercase tracking-technical text-[#9299A3] hover:text-white"
            >
              Cancel
            </LiquidActionButton>

            <LiquidActionButton
              type="submit"
              variant="glass"
              size="md"
              intensity={5}
              thickness={1}
              shimmer
              loading={saving}
              loadingText="Saving Project..."
              icon={<Save className="w-4 h-4" />}
              className="font-mono text-xs font-semibold uppercase tracking-technical text-white"
            >
              Save Project
            </LiquidActionButton>
          </div>
        </div>
      </form>
    </div>
  );
};

