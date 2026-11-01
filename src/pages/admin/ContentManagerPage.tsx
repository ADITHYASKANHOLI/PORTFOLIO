import React, { useEffect, useState } from 'react';
import { fetchAllSiteContent, updateSiteContent, uploadMediaFile } from '@/lib/data/api';
import { SiteContentMap, SectionKey, HardwarePanel, TeachingCard } from '@/types';
import { INITIAL_SITE_CONTENT } from '@/lib/data/initialData';
import { LiquidActionButton } from '@/components/ui';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { GalleryUploadField } from '@/components/admin/GalleryUploadField';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Cpu,
  GraduationCap,
  Mail,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const ContentManagerPage: React.FC = () => {
  const [content, setContent] = useState<SiteContentMap>(INITIAL_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SectionKey>('hero');
  const [uploadingPortrait, setUploadingPortrait] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllSiteContent();
        setContent(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load site content');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (sectionKey: SectionKey) => {
    setSavingKey(sectionKey);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await updateSiteContent(sectionKey, content[sectionKey]);
      setSuccessMsg(`Section "${sectionKey.toUpperCase()}" updated successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to update ${sectionKey}`);
    } finally {
      setSavingKey(null);
    }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortrait(true);
    setErrorMsg(null);
    try {
      const res = await uploadMediaFile(file, 'portrait');
      setContent((prev) => ({
        ...prev,
        portrait: {
          ...prev.portrait,
          image_url: res.publicUrl,
        },
      }));
      setSuccessMsg('Portrait uploaded! Click "Save Portrait Section" to persist.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Portrait upload failed');
    } finally {
      setUploadingPortrait(false);
    }
  };

  // Hardware Panels Handlers
  const handleAddHardwarePanel = () => {
    const currentPanels = content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || [];
    const newPanel: HardwarePanel = {
      id: `hw-${Date.now()}`,
      title: 'New Hardware Exploration',
      category: 'Embedded Systems',
      short_description: 'Brief overview of this prototype or module.',
      detailed_description: 'Technical narrative detailing components, signal conditioning, and firmware architecture.',
      technologies: ['C++', 'Microcontroller'],
      image: '',
      gallery_images: [],
      external_url: '',
      display_order: currentPanels.length + 1,
      published: true,
    };
    setContent((prev) => ({
      ...prev,
      hardware: {
        ...prev.hardware,
        panels: [...(prev.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || []), newPanel],
      },
    }));
  };

  const handleDeleteHardwarePanel = (index: number) => {
    const currentPanels = content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || [];
    const panel = currentPanels[index];
    if (!window.confirm(`Are you sure you want to delete "${panel?.title || `Panel 0${index + 1}`}"?`)) {
      return;
    }
    const filtered = currentPanels
      .filter((_, i) => i !== index)
      .map((p, idx) => ({ ...p, display_order: idx + 1 }));
    setContent((prev) => ({
      ...prev,
      hardware: {
        ...prev.hardware,
        panels: filtered,
      },
    }));
  };

  const handleMoveHardwarePanel = (index: number, direction: 'up' | 'down') => {
    const currentPanels = [...(content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPanels.length) return;
    const temp = currentPanels[index];
    currentPanels[index] = currentPanels[targetIndex];
    currentPanels[targetIndex] = temp;
    const reordered = currentPanels.map((p, idx) => ({ ...p, display_order: idx + 1 }));
    setContent((prev) => ({
      ...prev,
      hardware: {
        ...prev.hardware,
        panels: reordered,
      },
    }));
  };

  // Teaching Cards Handlers
  const handleAddTeachingCard = () => {
    const currentCards = content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || [];
    const newCard: TeachingCard = {
      id: `teach-${Date.now()}`,
      title: 'New Pedagogical Topic',
      category: 'Workshops',
      tag: `0${currentCards.length + 1} // Practical Session`,
      short_description: 'Hands-on learning session or collaborative workshop.',
      detailed_description: 'Detailed insights, pedagogical methodology, and core learning goals.',
      image: '',
      gallery_images: [],
      learning_outcomes: ['Core concepts', 'Hands-on execution'],
      resource_url: '',
      display_order: currentCards.length + 1,
      published: true,
    };
    setContent((prev) => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        cards: [...(prev.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || []), newCard],
      },
    }));
  };

  const handleDeleteTeachingCard = (index: number) => {
    const currentCards = content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || [];
    const card = currentCards[index];
    if (!window.confirm(`Are you sure you want to delete "${card?.title || `Card 0${index + 1}`}"?`)) {
      return;
    }
    const filtered = currentCards
      .filter((_, i) => i !== index)
      .map((c, idx) => ({ ...c, display_order: idx + 1 }));
    setContent((prev) => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        cards: filtered,
      },
    }));
  };

  const handleMoveTeachingCard = (index: number, direction: 'up' | 'down') => {
    const currentCards = [...(content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentCards.length) return;
    const temp = currentCards[index];
    currentCards[index] = currentCards[targetIndex];
    currentCards[targetIndex] = temp;
    const reordered = currentCards.map((c, idx) => ({ ...c, display_order: idx + 1 }));
    setContent((prev) => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        cards: reordered,
      },
    }));
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-sage">
        Loading site content...
      </div>
    );
  }

  const tabs: { key: SectionKey; label: string; icon: any }[] = [
    { key: 'hero', label: 'Main Hero', icon: Sparkles },
    { key: 'portrait', label: 'Portrait Sub-Hero', icon: ImageIcon },
    { key: 'about', label: 'About Me', icon: FileText },
    { key: 'fole', label: 'FOLE Community', icon: BookOpen },
    { key: 'hardware', label: 'Hardware & Engineering', icon: Cpu },
    { key: 'teaching', label: 'Teaching & Mentorship', icon: GraduationCap },
    { key: 'contact', label: 'Contact Details', icon: Mail },
    { key: 'footer', label: 'Footer & Colophon', icon: FileText },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Editorial Copy & Narratives
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Website Content Management
          </h1>
        </div>
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

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-borderBase/15 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded font-mono text-xs transition-colors ${
                isActive
                  ? 'bg-copper text-paper font-semibold shadow-sm'
                  : 'bg-surface text-sage hover:text-paper hover:bg-surface-elevated'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION EDITORS */}

      {/* 1. HERO */}
      {activeTab === 'hero' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Hero Section Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Headline Line 1
              </label>
              <input
                type="text"
                value={content.hero.title_line_1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title_line_1: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Headline Line 2 (Accent)
              </label>
              <input
                type="text"
                value={content.hero.title_line_2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title_line_2: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Subheading
            </label>
            <textarea
              rows={2}
              value={content.hero.subheading}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, subheading: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                CTA 1 Text
              </label>
              <input
                type="text"
                value={content.hero.cta_work}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, cta_work: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                CTA 2 Text
              </label>
              <input
                type="text"
                value={content.hero.cta_contact}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, cta_contact: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Top Status Badge
              </label>
              <input
                type="text"
                value={content.hero.status_badge}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, status_badge: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('hero')}
              disabled={savingKey === 'hero'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'hero' ? 'Saving...' : 'Save Hero Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PORTRAIT */}
      {activeTab === 'portrait' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Personal Portrait Sub-Hero
          </h2>

          <div className="space-y-4">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical">
              Actual Portrait Photograph
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {content.portrait.image_url ? (
                <div className="w-32 h-40 rounded border border-borderBase/20 overflow-hidden bg-forest relative group">
                  <img
                    src={content.portrait.image_url}
                    alt="Portrait preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        portrait: { ...content.portrait, image_url: '' },
                      })
                    }
                    className="absolute inset-0 bg-forest/80 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center font-mono text-xs transition-opacity"
                  >
                    Clear Photo
                  </button>
                </div>
              ) : (
                <div className="w-32 h-40 rounded border border-dashed border-borderBase/20 bg-forest/40 flex flex-col items-center justify-center p-3 text-center text-sage">
                  <ImageIcon className="w-6 h-6 mb-1 text-copper" />
                  <span className="font-mono text-[10px]">Placeholder Active</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs cursor-pointer hover:border-copper transition-colors">
                  <Upload className="w-4 h-4 text-copper" />
                  <span>{uploadingPortrait ? 'Uploading...' : 'Upload Real Portrait Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePortraitUpload}
                    disabled={uploadingPortrait}
                    className="hidden"
                  />
                </label>
                <p className="font-mono text-xs text-sage/70 max-w-sm">
                  Upload Adithya’s actual portrait photograph. When empty, the website renders a deliberate architectural placeholder.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-borderBase/10">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Heading
              </label>
              <input
                type="text"
                value={content.portrait.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    portrait: { ...content.portrait, heading: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Caption
              </label>
              <input
                type="text"
                value={content.portrait.caption}
                onChange={(e) =>
                  setContent({
                    ...content,
                    portrait: { ...content.portrait, caption: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Portrait Note
            </label>
            <textarea
              rows={3}
              value={content.portrait.note}
              onChange={(e) =>
                setContent({
                  ...content,
                  portrait: { ...content.portrait, note: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('portrait')}
              disabled={savingKey === 'portrait'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'portrait' ? 'Saving...' : 'Save Portrait Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ABOUT */}
      {activeTab === 'about' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            About Me Editorial Copy
          </h2>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Statement Headline
            </label>
            <input
              type="text"
              value={content.about.headline}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, headline: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="space-y-4">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical">
              Editorial Paragraphs
            </label>
            {content.about.paragraphs.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <span className="font-mono text-[11px] text-copper">Paragraph 0{idx + 1}</span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const next = [...content.about.paragraphs];
                    next[idx] = e.target.value;
                    setContent({
                      ...content,
                      about: { ...content.about, paragraphs: next },
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Core Philosophy
            </label>
            <input
              type="text"
              value={content.about.philosophy}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, philosophy: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('about')}
              disabled={savingKey === 'about'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'about' ? 'Saving...' : 'Save About Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. FOLE */}
      {activeTab === 'fole' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            FOLE — Free Open Learning & Education Story
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                FOLE Title
              </label>
              <input
                type="text"
                value={content.fole.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    fole: { ...content.fole, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={content.fole.tagline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    fole: { ...content.fole, tagline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-borderBase/10">
            <span className="font-mono text-xs text-copper uppercase tracking-technical block">
              Narrative Stages (Pinned Flow)
            </span>
            {content.fole.narrative_stages.map((stg, i) => (
              <div key={stg.step} className="p-4 rounded bg-surface-elevated border border-borderBase/15 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-copper">STAGE {stg.step}</span>
                </div>
                <input
                  type="text"
                  value={stg.title}
                  onChange={(e) => {
                    const next = [...content.fole.narrative_stages];
                    next[i] = { ...next[i], title: e.target.value };
                    setContent({
                      ...content,
                      fole: { ...content.fole, narrative_stages: next },
                    });
                  }}
                  placeholder="Stage Title"
                  className="w-full px-3 py-1.5 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                />
                <textarea
                  rows={2}
                  value={stg.desc}
                  onChange={(e) => {
                    const next = [...content.fole.narrative_stages];
                    next[i] = { ...next[i], desc: e.target.value };
                    setContent({
                      ...content,
                      fole: { ...content.fole, narrative_stages: next },
                    });
                  }}
                  placeholder="Stage Description"
                  className="w-full px-3 py-1.5 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('fole')}
              disabled={savingKey === 'fole'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'fole' ? 'Saving...' : 'Save FOLE Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. HARDWARE */}
      {activeTab === 'hardware' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase/10 pb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-paper">
                Hardware & Engineering — Accordion Gallery
              </h2>
              <p className="font-sans text-xs text-sage mt-0.5">
                Manage exhibition cards, schematics, and high-resolution photos rendered in the React Bits AccordionGallery.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddHardwarePanel}
              className="px-3.5 py-1.5 rounded bg-copper/20 hover:bg-copper/30 text-copper border border-copper/40 font-mono text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hardware Panel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={content.hardware.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hardware: { ...content.hardware, headline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Subheading
              </label>
              <input
                type="text"
                value={content.hardware.subheading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hardware: { ...content.hardware, subheading: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          {/* Hardware Exhibition Panels */}
          <div className="space-y-6 pt-4 border-t border-borderBase/10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-copper uppercase tracking-technical block">
                Interactive Exhibition Panels ({(content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || []).length})
              </span>
              <button
                type="button"
                onClick={handleAddHardwarePanel}
                className="text-copper hover:text-white font-mono text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Panel</span>
              </button>
            </div>

            {(content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || []).map((panel, idx) => {
              const currentPanels = content.hardware.panels || INITIAL_SITE_CONTENT.hardware.panels || [];
              return (
                <div
                  key={panel.id || idx}
                  className="p-5 rounded-lg bg-surface-elevated border border-borderBase/20 space-y-4 shadow-sm"
                >
                  {/* Panel Card Header & Actions */}
                  <div className="flex items-center justify-between border-b border-borderBase/10 pb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-copper font-semibold bg-copper/10 px-2 py-0.5 rounded border border-copper/20">
                        PANEL 0{idx + 1}
                      </span>
                      <span className="font-display font-medium text-paper text-sm truncate max-w-[200px] sm:max-w-xs">
                        {panel.title || panel.category || 'Untitled Exploration'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Reorder Buttons */}
                      <div className="flex items-center border border-borderBase/30 rounded overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleMoveHardwarePanel(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Panel Up"
                          className="p-1.5 bg-surface hover:bg-surface-elevated text-sage hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-4 bg-borderBase/20" />
                        <button
                          type="button"
                          onClick={() => handleMoveHardwarePanel(idx, 'down')}
                          disabled={idx === currentPanels.length - 1}
                          title="Move Panel Down"
                          className="p-1.5 bg-surface hover:bg-surface-elevated text-sage hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Published Toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-sage bg-surface px-2.5 py-1 rounded border border-borderBase/20">
                        <input
                          type="checkbox"
                          checked={panel.published !== false}
                          onChange={(e) => {
                            const panels = [...currentPanels];
                            panels[idx] = { ...panels[idx], published: e.target.checked };
                            setContent({
                              ...content,
                              hardware: { ...content.hardware, panels },
                            });
                          }}
                          className="rounded border-borderBase/30 text-copper focus:ring-copper"
                        />
                        <span>Published</span>
                      </label>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteHardwarePanel(idx)}
                        title="Delete Panel"
                        className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Panel Content Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={panel.category}
                        onChange={(e) => {
                          const panels = [...currentPanels];
                          panels[idx] = { ...panels[idx], category: e.target.value };
                          setContent({
                            ...content,
                            hardware: { ...content.hardware, panels },
                          });
                        }}
                        placeholder="e.g. ESP32, Servo Motors, Sensors"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={panel.title}
                        onChange={(e) => {
                          const panels = [...currentPanels];
                          panels[idx] = { ...panels[idx], title: e.target.value };
                          setContent({
                            ...content,
                            hardware: { ...content.hardware, panels },
                          });
                        }}
                        placeholder="e.g. ESP32 & Real-Time Computing"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                      Short Description (Preview Summary)
                    </label>
                    <input
                      type="text"
                      value={panel.short_description}
                      onChange={(e) => {
                        const panels = [...currentPanels];
                        panels[idx] = { ...panels[idx], short_description: e.target.value };
                        setContent({
                          ...content,
                          hardware: { ...content.hardware, panels },
                        });
                      }}
                      placeholder="Brief description shown when card is collapsed or highlighted"
                      className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                      Detailed Narrative / Exploration Note
                    </label>
                    <textarea
                      rows={3}
                      value={panel.detailed_description || ''}
                      onChange={(e) => {
                        const panels = [...currentPanels];
                        panels[idx] = { ...panels[idx], detailed_description: e.target.value };
                        setContent({
                          ...content,
                          hardware: { ...content.hardware, panels },
                        });
                      }}
                      placeholder="Detailed explanation of the engineering methodology, circuit topology, and experiments"
                      className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Technologies / Components (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(panel.technologies || []).join(', ')}
                        onChange={(e) => {
                          const panels = [...currentPanels];
                          panels[idx] = {
                            ...panels[idx],
                            technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                          };
                          setContent({
                            ...content,
                            hardware: { ...content.hardware, panels },
                          });
                        }}
                        placeholder="e.g. FreeRTOS, ESP32, UART, PWM"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Project / Documentation URL (optional)
                      </label>
                      <input
                        type="text"
                        value={panel.external_url || ''}
                        onChange={(e) => {
                          const panels = [...currentPanels];
                          panels[idx] = {
                            ...panels[idx],
                            external_url: e.target.value,
                          };
                          setContent({
                            ...content,
                            hardware: { ...content.hardware, panels },
                          });
                        }}
                        placeholder="https://github.com/... or /notes/esp32"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  {/* Primary Image Upload Field */}
                  <ImageUploadField
                    label="Primary Hardware Image (Accordion Gallery)"
                    value={panel.image}
                    folder="hardware"
                    placeholder="/hardware/esp32.svg or upload a high-res photo"
                    description="The main artwork or schematic displayed in the React Bits AccordionGallery."
                    onChange={(url) => {
                      const panels = [...currentPanels];
                      panels[idx] = { ...panels[idx], image: url };
                      setContent({
                        ...content,
                        hardware: { ...content.hardware, panels },
                      });
                    }}
                  />

                  {/* Additional Gallery Images */}
                  <GalleryUploadField
                    label="Additional Gallery Images (Bench Photos, Schematics, Pinouts)"
                    values={panel.gallery_images || []}
                    folder="hardware/gallery"
                    description="Upload multiple supplementary images for this hardware exploration. Saved to Supabase storage."
                    onChange={(urls) => {
                      const panels = [...currentPanels];
                      panels[idx] = { ...panels[idx], gallery_images: urls };
                      setContent({
                        ...content,
                        hardware: { ...content.hardware, panels },
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <LiquidActionButton
              type="button"
              variant="glass"
              size="md"
              intensity={5}
              thickness={1}
              onClick={() => handleSave('hardware')}
              loading={savingKey === 'hardware'}
              loadingText="Saving Hardware..."
              icon={<Save className="w-4 h-4" />}
              className="font-mono text-xs font-semibold uppercase tracking-technical text-white"
            >
              Save Hardware Section
            </LiquidActionButton>
          </div>
        </div>
      )}

      {/* 6. TEACHING */}
      {activeTab === 'teaching' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase/10 pb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-paper">
                Teaching & Community — React Bits MorphSlider
              </h2>
              <p className="font-sans text-xs text-sage mt-0.5">
                Manage interactive cards, workshop narratives, and high-fidelity textures morphing in the React Bits MorphSlider.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTeachingCard}
              className="px-3.5 py-1.5 rounded bg-copper/20 hover:bg-copper/30 text-copper border border-copper/40 font-mono text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Teaching Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={content.teaching.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    teaching: { ...content.teaching, headline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={content.teaching.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    teaching: { ...content.teaching, description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          {/* MorphSlider Interactive Cards */}
          <div className="space-y-6 pt-4 border-t border-borderBase/10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-copper uppercase tracking-technical block">
                Interactive Morph Cards ({(content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || []).length})
              </span>
              <button
                type="button"
                onClick={handleAddTeachingCard}
                className="text-copper hover:text-white font-mono text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Card</span>
              </button>
            </div>

            {(content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || []).map((card, idx) => {
              const currentCards = content.teaching.cards || INITIAL_SITE_CONTENT.teaching.cards || [];
              return (
                <div
                  key={card.id || idx}
                  className="p-5 rounded-lg bg-surface-elevated border border-borderBase/20 space-y-4 shadow-sm"
                >
                  {/* Card Header & Controls */}
                  <div className="flex items-center justify-between border-b border-borderBase/10 pb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-copper font-semibold bg-copper/10 px-2 py-0.5 rounded border border-copper/20">
                        CARD 0{idx + 1}
                      </span>
                      <span className="font-display font-medium text-paper text-sm truncate max-w-[200px] sm:max-w-xs">
                        {card.title || 'Untitled Teaching Topic'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Reorder Buttons */}
                      <div className="flex items-center border border-borderBase/30 rounded overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleMoveTeachingCard(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Card Up"
                          className="p-1.5 bg-surface hover:bg-surface-elevated text-sage hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-4 bg-borderBase/20" />
                        <button
                          type="button"
                          onClick={() => handleMoveTeachingCard(idx, 'down')}
                          disabled={idx === currentCards.length - 1}
                          title="Move Card Down"
                          className="p-1.5 bg-surface hover:bg-surface-elevated text-sage hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Published Toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-sage bg-surface px-2.5 py-1 rounded border border-borderBase/20">
                        <input
                          type="checkbox"
                          checked={card.published !== false}
                          onChange={(e) => {
                            const cards = [...currentCards];
                            cards[idx] = { ...cards[idx], published: e.target.checked };
                            setContent({
                              ...content,
                              teaching: { ...content.teaching, cards },
                            });
                          }}
                          className="rounded border-borderBase/30 text-copper focus:ring-copper"
                        />
                        <span>Published</span>
                      </label>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTeachingCard(idx)}
                        title="Delete Card"
                        className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Topic Title
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const cards = [...currentCards];
                          cards[idx] = { ...cards[idx], title: e.target.value };
                          setContent({
                            ...content,
                            teaching: { ...content.teaching, cards },
                          });
                        }}
                        placeholder="e.g. Learning Together"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={card.category || ''}
                        onChange={(e) => {
                          const cards = [...currentCards];
                          cards[idx] = { ...cards[idx], category: e.target.value };
                          setContent({
                            ...content,
                            teaching: { ...content.teaching, cards },
                          });
                        }}
                        placeholder="e.g. Peer Collaboration, Workshops, Community"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Technical Tag
                      </label>
                      <input
                        type="text"
                        value={card.tag || ''}
                        onChange={(e) => {
                          const cards = [...currentCards];
                          cards[idx] = { ...cards[idx], tag: e.target.value };
                          setContent({
                            ...content,
                            teaching: { ...content.teaching, cards },
                          });
                        }}
                        placeholder="e.g. 01 // Peer Collaboration"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                        Resource / Documentation URL (optional)
                      </label>
                      <input
                        type="text"
                        value={card.resource_url || ''}
                        onChange={(e) => {
                          const cards = [...currentCards];
                          cards[idx] = { ...cards[idx], resource_url: e.target.value };
                          setContent({
                            ...content,
                            teaching: { ...content.teaching, cards },
                          });
                        }}
                        placeholder="https://... or /notes/community"
                        className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                      Short Description (Summary)
                    </label>
                    <input
                      type="text"
                      value={card.short_description}
                      onChange={(e) => {
                        const cards = [...currentCards];
                        cards[idx] = { ...cards[idx], short_description: e.target.value };
                        setContent({
                          ...content,
                          teaching: { ...content.teaching, cards },
                        });
                      }}
                      placeholder="Brief description of this teaching initiative"
                      className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                      Detailed Narrative / Pedagogical Insight
                    </label>
                    <textarea
                      rows={3}
                      value={card.detailed_description || ''}
                      onChange={(e) => {
                        const cards = [...currentCards];
                        cards[idx] = { ...cards[idx], detailed_description: e.target.value };
                        setContent({
                          ...content,
                          teaching: { ...content.teaching, cards },
                        });
                      }}
                      placeholder="Detailed explanation of the teaching philosophy, group dynamic, and insights"
                      className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-sage uppercase tracking-technical mb-1">
                      Learning Outcomes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(card.learning_outcomes || []).join(', ')}
                      onChange={(e) => {
                        const cards = [...currentCards];
                        cards[idx] = {
                          ...cards[idx],
                          learning_outcomes: e.target.value.split(',').map((o) => o.trim()).filter(Boolean),
                        };
                        setContent({
                          ...content,
                          teaching: { ...content.teaching, cards },
                        });
                      }}
                      placeholder="e.g. Peer collaboration, Hands-on debugging, Open documentation"
                      className="w-full px-3 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
                    />
                  </div>

                  {/* Primary Teaching Image Upload */}
                  <ImageUploadField
                    label="Primary Teaching Image (WebGL MorphSlider Texture)"
                    value={card.image}
                    folder="teaching"
                    placeholder="/teaching/learning-together.svg or upload a high-res photo"
                    description="The main artwork or photo texture used in the React Bits MorphSlider transition."
                    onChange={(url) => {
                      const cards = [...currentCards];
                      cards[idx] = { ...cards[idx], image: url };
                      setContent({
                        ...content,
                        teaching: { ...content.teaching, cards },
                      });
                    }}
                  />

                  {/* Additional Gallery Images */}
                  <GalleryUploadField
                    label="Additional Workshop / Community Images"
                    values={card.gallery_images || []}
                    folder="teaching/gallery"
                    description="Upload multiple supplementary event photos, workshop setups, and student team builds."
                    onChange={(urls) => {
                      const cards = [...currentCards];
                      cards[idx] = { ...cards[idx], gallery_images: urls };
                      setContent({
                        ...content,
                        teaching: { ...content.teaching, cards },
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <LiquidActionButton
              type="button"
              variant="glass"
              size="md"
              intensity={5}
              thickness={1}
              onClick={() => handleSave('teaching')}
              loading={savingKey === 'teaching'}
              loadingText="Saving Teaching Section..."
              icon={<Save className="w-4 h-4" />}
              className="font-mono text-xs font-semibold uppercase tracking-technical text-white"
            >
              Save Teaching Section
            </LiquidActionButton>
          </div>
        </div>
      )}

      {/* 7. CONTACT */}
      {activeTab === 'contact' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Contact & Collaboration Inquiries
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={content.contact.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, headline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Subheading
            </label>
            <textarea
              rows={3}
              value={content.contact.subheading}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, subheading: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Admin Note / Disclaimer
            </label>
            <input
              type="text"
              value={content.contact.note}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, note: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
            />
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('contact')}
              disabled={savingKey === 'contact'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'contact' ? 'Saving...' : 'Save Contact Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      {activeTab === 'footer' && (
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-6">
          <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3">
            Footer & Colophon
          </h2>

          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={content.footer.tagline}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, tagline: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Copyright Credit Line
              </label>
              <input
                type="text"
                value={content.footer.credit}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, credit: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Colophon Note
              </label>
              <input
                type="text"
                value={content.footer.colophon}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, colophon: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-borderBase/10 flex justify-end">
            <button
              onClick={() => handleSave('footer')}
              disabled={savingKey === 'footer'}
              className="px-6 py-2.5 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'footer' ? 'Saving...' : 'Save Footer Section'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

