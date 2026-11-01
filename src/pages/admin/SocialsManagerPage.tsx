import React, { useEffect, useState } from 'react';
import { fetchSocialLinks, saveSocialLink, deleteSocialLink } from '@/lib/data/api';
import { SocialLink } from '@/types';
import { Plus, Trash2, Edit2, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SocialsManagerPage: React.FC = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields
  const [editPlatform, setEditPlatform] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [editEnabled, setEditEnabled] = useState(true);

  // New fields
  const [newPlatform, setNewPlatform] = useState('GitHub');
  const [newUrl, setNewUrl] = useState('');
  const [newOrder, setNewOrder] = useState(1);

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSocialLinks(false); // all, including disabled
      setSocials(data);
      setNewOrder(data.length + 1);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to load social links' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      await saveSocialLink({
        platform: newPlatform,
        url: newUrl.trim(),
        display_order: Number(newOrder),
        enabled: true,
      });
      setNewUrl('');
      setMsg({ type: 'success', text: 'Social link created!' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to add link' });
    }
  };

  const startEdit = (s: SocialLink) => {
    setEditingId(s.id);
    setEditPlatform(s.platform);
    setEditUrl(s.url);
    setEditOrder(s.display_order);
    setEditEnabled(s.enabled);
  };

  const saveEdit = async (id: string) => {
    try {
      await saveSocialLink({
        id,
        platform: editPlatform,
        url: editUrl.trim(),
        display_order: Number(editOrder),
        enabled: editEnabled,
      });
      setEditingId(null);
      setMsg({ type: 'success', text: 'Social link updated!' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to update link' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSocialLink(id);
      setMsg({ type: 'success', text: 'Link deleted.' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to delete link' });
    }
  };

  const toggleEnabled = async (s: SocialLink) => {
    try {
      await saveSocialLink({
        id: s.id,
        enabled: !s.enabled,
      });
      await load();
    } catch (err) {
      console.warn('Error toggling social link:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Profiles & Contact Channels
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Social Links Management
          </h1>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded font-mono text-xs flex items-center gap-2 border ${
            msg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Add New Form */}
      <form
        onSubmit={handleCreate}
        className="p-6 rounded bg-surface border border-borderBase/15 space-y-4"
      >
        <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-copper" />
          <span>Add Profile or Contact Link</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1">
              Platform
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub, LinkedIn, Email"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1">
              URL
            </label>
            <input
              type="text"
              required
              placeholder="https://... or mailto:..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1">
              Order
            </label>
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(Number(e.target.value))}
              className="w-full px-2 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-mono text-xs focus:outline-none focus:border-copper"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded bg-copper text-paper font-mono text-xs font-semibold uppercase tracking-technical hover:bg-copper-dark transition-all"
            >
              Add Link
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-surface border border-borderBase/15 rounded overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-surface-elevated font-mono text-xs text-sage uppercase border-b border-borderBase/15">
            <tr>
              <th className="px-6 py-3.5 w-16">Order</th>
              <th className="px-6 py-3.5">Platform</th>
              <th className="px-6 py-3.5">URL</th>
              <th className="px-6 py-3.5">Enabled</th>
              <th className="px-6 py-3.5 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderBase/10">
            {socials
              .sort((a, b) => a.display_order - b.display_order)
              .map((s) => {
                const isEditing = editingId === s.id;

                if (isEditing) {
                  return (
                    <tr key={s.id} className="bg-surface-elevated">
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          value={editOrder}
                          onChange={(e) => setEditOrder(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded bg-forest border border-borderBase/20 text-paper font-mono text-xs"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editPlatform}
                          onChange={(e) => setEditPlatform(e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-forest border border-borderBase/20 text-paper text-sm"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-forest border border-borderBase/20 text-paper font-mono text-xs"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={editEnabled}
                          onChange={(e) => setEditEnabled(e.target.checked)}
                          className="w-4 h-4 text-copper"
                        />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => saveEdit(s.id)}
                            className="p-1 rounded text-emerald-400 hover:text-emerald-200"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded text-sage hover:text-paper"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={s.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-sage">
                      {s.display_order}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-paper">
                      {s.platform}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-sage truncate max-w-xs">
                      {s.url}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => toggleEnabled(s)}
                        className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                          s.enabled
                            ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {s.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-1 text-sage hover:text-copper transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1 text-sage hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
