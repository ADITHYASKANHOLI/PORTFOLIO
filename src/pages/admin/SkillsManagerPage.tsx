import React, { useEffect, useState } from 'react';
import { fetchSkills, saveSkill, deleteSkill } from '@/lib/data/api';
import { Skill } from '@/types';
import { Plus, Trash2, Edit2, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SkillsManagerPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editOrder, setEditOrder] = useState(0);

  // New skill fields
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Programming');
  const [newOrder, setNewOrder] = useState(0);

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSkills();
      setSkills(data);
      setNewOrder(data.length + 1);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to load skills' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await saveSkill({
        name: newName.trim(),
        category: newCategory,
        display_order: Number(newOrder),
      });
      setNewName('');
      setMsg({ type: 'success', text: 'Skill created successfully!' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to add skill' });
    }
  };

  const startEdit = (s: Skill) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditCategory(s.category);
    setEditOrder(s.display_order);
  };

  const saveEdit = async (id: string) => {
    try {
      await saveSkill({
        id,
        name: editName.trim(),
        category: editCategory,
        display_order: Number(editOrder),
      });
      setEditingId(null);
      setMsg({ type: 'success', text: 'Skill updated!' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to update skill' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setMsg({ type: 'success', text: 'Skill removed.' });
      await load();
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to delete skill' });
    }
  };

  const categories = [
    'Programming',
    'Backend Development',
    'Hardware and Embedded Systems',
    'Tools and Platforms',
    'Teaching and Learning',
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Stack & Technologies
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Skills Management
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

      {/* Add New Skill Form */}
      <form
        onSubmit={handleCreate}
        className="p-6 rounded bg-surface border border-borderBase/15 space-y-4"
      >
        <h2 className="font-display text-lg font-bold text-paper border-b border-borderBase/10 pb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-copper" />
          <span>Add New Technical Skill</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ESP-IDF or FreeRTOS"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded bg-surface-elevated border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
              Add Skill
            </button>
          </div>
        </div>
      </form>

      {/* Skills Table */}
      <div className="bg-surface border border-borderBase/15 rounded overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-surface-elevated font-mono text-xs text-sage uppercase border-b border-borderBase/15">
            <tr>
              <th className="px-6 py-3.5 w-16">Order</th>
              <th className="px-6 py-3.5">Name</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderBase/10">
            {skills
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
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-forest border border-borderBase/20 text-paper text-sm"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-2.5 py-1 rounded bg-forest border border-borderBase/20 text-paper text-xs font-mono"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
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
                      {s.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-copper">
                      {s.category}
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
