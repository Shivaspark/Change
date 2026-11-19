import React, { useState } from 'react';
import { MindfulNote, BudgetCategory } from '../types.ts';
import { vibrateTap, vibrateSuccess } from '../utils/haptics.ts';

interface MindfulNotesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notes: MindfulNote[];
  categories: BudgetCategory[];
  onAddNote: (note: Omit<MindfulNote, 'id' | 'timestamp'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const MindfulNotesSheet: React.FC<MindfulNotesSheetProps> = ({
  isOpen,
  onClose,
  notes,
  categories,
  onAddNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  // New Note Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategoryKey, setNewCategoryKey] = useState<string>('fun');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');

  if (!isOpen) return null;

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;

    const matchedCat = categories.find((c) => c.id.includes(newCategoryKey) || c.name.toLowerCase().includes(newCategoryKey));
    const amt = newAmount ? parseFloat(newAmount) : undefined;
    const tags = newTagInput
      ? newTagInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Mindful Note'];

    onAddNote({
      title: newTitle.trim() || 'Mindful Reflection',
      content: newContent.trim(),
      categoryKey: newCategoryKey,
      categoryName: matchedCat?.name || 'General',
      associatedAmount: isNaN(amt || NaN) ? undefined : amt,
      tags,
      pinned: false,
    });

    vibrateSuccess();
    setNewTitle('');
    setNewContent('');
    setNewAmount('');
    setNewTagInput('');
    setIsComposing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl border-t-2 border-black flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-lg bg-[#f3f3f4]">
              <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-montez text-2xl text-black leading-tight">Mindful Notes & Ledger</h3>
              <span className="font-mono text-[10px] text-zinc-500">
                {notes.length} thoughts & reflections logged
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                vibrateTap();
                setIsComposing((prev) => !prev);
              }}
              className="px-3 py-1 rounded-full bg-black text-white font-montez text-lg flex items-center gap-1 cursor-pointer hover:bg-zinc-800 active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isComposing ? 'close' : 'add'}
              </span>
              <span>{isComposing ? 'Cancel' : 'New Note'}</span>
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                vibrateTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-black text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Note Composer Dropdown */}
        {isComposing && (
          <form
            onSubmit={handleCreateNote}
            className="my-3 p-3.5 rounded-2xl bg-stone-50 border-2 border-black shadow-sm flex flex-col gap-2 shrink-0 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <span className="font-montez text-xl text-black">Compose Mindful Note</span>
            <input
              type="text"
              placeholder="Title (e.g. Afternoon tea with Alex)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-black/20 text-xs font-space focus:outline-none focus:ring-1 focus:ring-black"
              autoFocus
            />
            <textarea
              placeholder="What intention or reflection is tied to this moment?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 rounded-xl border border-black/20 text-xs font-space focus:outline-none focus:ring-1 focus:ring-black resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newCategoryKey}
                onChange={(e) => setNewCategoryKey(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-black/20 text-xs font-space bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="any"
                placeholder="Amount (optional $)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-black/20 text-xs font-space bg-white"
              />
            </div>
            <input
              type="text"
              placeholder="Tags (comma-separated, e.g. Morning, Books)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-black/20 text-xs font-space"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-black text-white font-montez text-xl font-bold cursor-pointer hover:bg-zinc-800 active:scale-98 transition-all"
            >
              Save Note
            </button>
          </form>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="py-2.5 flex flex-col gap-2 shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-zinc-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search mindful reflections & notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-black/15 text-xs font-space focus:outline-none focus:ring-1 focus:ring-black bg-stone-50"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  setSelectedTag(null);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === null ? 'bg-black text-white font-bold' : 'bg-stone-100 text-zinc-600'
                }`}
              >
                All ({notes.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    vibrateTap();
                    setSelectedTag(selectedTag === tag ? null : tag);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-black text-white font-bold'
                      : 'bg-stone-100 text-zinc-600 hover:bg-stone-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Notes List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-0.5 py-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[32px] text-zinc-300">stylus_note</span>
              <p className="font-montez text-2xl text-zinc-400">No matching notes found</p>
              <p className="font-mono text-[11px] text-zinc-400">
                Tap "New Note" or tell Gemini: "Note: coffee with friends"
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-2xl border transition-all relative flex flex-col gap-1.5 ${
                  note.pinned
                    ? 'bg-stone-50 border-2 border-black shadow-xs'
                    : 'bg-white border-black/15 hover:border-black/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {note.pinned && (
                      <span className="material-symbols-outlined text-[15px] text-black shrink-0">
                        push_pin
                      </span>
                    )}
                    <h4 className="font-montez text-xl text-black font-bold truncate leading-tight">
                      {note.title}
                    </h4>
                  </div>
                  {typeof note.associatedAmount === 'number' && (
                    <span className="font-montez text-lg text-black font-bold shrink-0">
                      -${note.associatedAmount.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-xs font-space text-zinc-700 leading-relaxed">
                  {note.content}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] font-mono text-zinc-500">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>{note.timestamp}</span>
                    {note.categoryName && (
                      <span className="bg-[#eeeeee] px-1.5 py-0.5 rounded text-black font-semibold">
                        {note.categoryName}
                      </span>
                    )}
                    {note.tags.map((t) => (
                      <span key={t} className="text-zinc-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Toggle pin"
                      onClick={() => {
                        vibrateTap();
                        onTogglePin(note.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-black transition-colors"
                      title={note.pinned ? 'Unpin' : 'Pin note'}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {note.pinned ? 'push_pin' : 'keep'}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Delete note"
                      onClick={() => {
                        vibrateTap();
                        onDeleteNote(note.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
