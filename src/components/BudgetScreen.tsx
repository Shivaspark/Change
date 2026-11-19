import React, { useState, useRef, useEffect } from 'react';
import { BudgetCategory, ScreenType } from '../types.ts';
import { vibrateTap, vibrateTick, vibrateSuccess } from '../utils/haptics.ts';

interface BudgetScreenProps {
  categories: BudgetCategory[];
  onUpdateCategory: (catId: string, updates: Partial<BudgetCategory>) => void;
  onAddCategory: (category: BudgetCategory) => void;
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
}

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  categories,
  onUpdateCategory,
  onAddCategory,
  onNavigate,
  onShowToast,
}) => {
  // Active target: 'total' or a category id
  const [activeTarget, setActiveTarget] = useState<string>('cat_essentials');
  const [totalPool, setTotalPool] = useState<number>(0);
  const [currentAngle, setCurrentAngle] = useState<number>(0);

  // Month selector popover state
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Nov');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [pickerYear, setPickerYear] = useState(2024);

  // Rename category inline/modal state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [renameInputVal, setRenameInputVal] = useState('');

  // Rotary Dial wheel refs
  const dialRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const activeCategory = categories.find((c) => c.id === activeTarget);

  const getActiveAmount = (): number => {
    if (activeTarget === 'total') return totalPool;
    return activeCategory ? activeCategory.amount : 0;
  };

  const setActiveAmount = (val: number, updateAngle = true) => {
    const clamped = Math.max(0, Math.min(99999, Math.round(val)));
    if (activeTarget === 'total') {
      setTotalPool(clamped);
    } else if (activeCategory) {
      onUpdateCategory(activeCategory.id, { amount: clamped });
    }
    if (updateAngle) {
      setCurrentAngle(Math.round(((clamped % 2000) / 2000) * 360));
    }
  };

  const stepActiveValue = (delta: number) => {
    vibrateTap();
    const current = getActiveAmount();
    setActiveAmount(current + delta, false);
    setCurrentAngle((prev) => (prev + (delta > 0 ? 18 : -18) + 360) % 360);
  };

  // Rotary touch / pointer physics
  const getAngleFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deg = rad * (180 / Math.PI);
    return (deg + 90 + 360) % 360;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('#dialCenterPlus')) return;
    vibrateTap();
    isDraggingRef.current = true;
    lastAngleRef.current = getAngleFromEvent(e);
    accumulatedDeltaRef.current = 0;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const current = getAngleFromEvent(moveEvent);
      let diff = current - lastAngleRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      lastAngleRef.current = current;
      setCurrentAngle((prev) => (prev + diff + 360) % 360);

      accumulatedDeltaRef.current += diff;
      const stepAngle = 8;
      if (Math.abs(accumulatedDeltaRef.current) >= stepAngle) {
        const steps = Math.trunc(accumulatedDeltaRef.current / stepAngle);
        accumulatedDeltaRef.current %= stepAngle;
        const curVal = getActiveAmount();
        setActiveAmount(curVal + steps * 25, false);
        vibrateTick();
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Add new category
  const handleAddNewCategory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const icons = ['local_activity', 'shopping_bag', 'flight', 'pets', 'fitness_center', 'cottage', 'celebration'];
    const randomIcon = icons[categories.length % icons.length];
    const newId = 'cat_' + Date.now();
    const newName = `Custom Bucket ${categories.length + 1}`;

    const newCat: BudgetCategory = {
      id: newId,
      name: newName,
      subtitle: 'Custom portion',
      icon: randomIcon,
      amount: 0,
      spent: 0,
      percentage: '0%',
      burnPct: '0%',
      patternType: 'custom',
    };

    onAddCategory(newCat);
    setActiveTarget(newId);
    setCurrentAngle(0);
    onShowToast(`✓ Added "${newName}"`);
  };

  const handleOpenRename = (cat: BudgetCategory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCatId(cat.id);
    setRenameInputVal(cat.name);
  };

  const handleConfirmRename = () => {
    if (editingCatId && renameInputVal.trim()) {
      onUpdateCategory(editingCatId, { name: renameInputVal.trim() });
      onShowToast(`Renamed to "${renameInputVal.trim()}"`);
    }
    setEditingCatId(null);
  };

  const handleSaveBudget = () => {
    onShowToast(`✓ Budget Saved for ${selectedMonth} ${selectedYear}!`);
  };

  const handleResetDefaults = () => {
    setTotalPool(0);
    categories.forEach((c) => onUpdateCategory(c.id, { amount: 0 }));
    setActiveTarget('cat_essentials');
    setCurrentAngle(0);
    onShowToast('Values reset to $0.00');
  };

  const currentAmt = getActiveAmount();

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 pt-1 pb-16 z-10 flex flex-col justify-between gap-3">
      {/* 1. Top Navigation Header */}
      <header className="flex items-center justify-between pt-1 relative z-40">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => onNavigate('dashboard')}
          className="w-10 h-10 rounded-full bg-stone-50 border border-black/15 flex items-center justify-center text-black shadow-xs active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-montez text-3xl text-black font-normal leading-none tracking-wide text-center">
            Set Monthly Budget
          </h1>
        </div>

        {/* Month Selection Component with Interactive Dropdown Popover */}
        <div className="relative">
          <button
            type="button"
            aria-label="Month selection"
            onClick={(e) => {
              e.stopPropagation();
              setPickerYear(selectedYear);
              setIsMonthPickerOpen((prev) => !prev);
            }}
            className="font-montez text-xl text-neutral-600 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            <span>
              {selectedMonth} {selectedYear}
            </span>
            <span
              className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${
                isMonthPickerOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Interactive Month & Year Dropdown Popover */}
          {isMonthPickerOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl p-3 border-2 border-black shadow-xl z-50 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Year Selector Row */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/20 flex items-center justify-center text-black active:scale-90 transition-transform cursor-pointer"
                  onClick={() => setPickerYear((y) => y - 1)}
                  title="Previous Year"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-neutral-500">event</span>
                  <span className="font-montez text-2xl font-bold text-black leading-none">
                    {pickerYear}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/20 flex items-center justify-center text-black active:scale-90 transition-transform cursor-pointer"
                  onClick={() => setPickerYear((y) => y + 1)}
                  title="Next Year"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS_LIST.map((m) => {
                  const isSel = selectedMonth === m && selectedYear === pickerYear;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(m);
                        setSelectedYear(pickerYear);
                        setIsMonthPickerOpen(false);
                        onShowToast(`Switched to ${m} ${pickerYear}`);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-center font-montez text-lg transition-all cursor-pointer border ${
                        isSel
                          ? 'bg-black text-white border-black font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-black border-black/10 active:scale-95'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              {/* Quick preset */}
              <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-sans text-neutral-500">
                <span>Plan period</span>
                <button
                  type="button"
                  className="hover:text-black font-semibold underline cursor-pointer"
                  onClick={() => {
                    setSelectedMonth('Nov');
                    setSelectedYear(2024);
                    setIsMonthPickerOpen(false);
                  }}
                >
                  Current (Nov 2024)
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Top Summary Hero Card: Planned Target */}
      <section
        className={`bg-white rounded-2xl p-2.5 shadow-sm border border-black/10 flex flex-col gap-1.5 relative overflow-hidden cursor-pointer transition-all active:scale-[0.99] ${
          activeTarget === 'total' ? 'doodle-box-active ring-2 ring-black' : ''
        }`}
        onClick={() => {
          setActiveTarget('total');
          setCurrentAngle(Math.round(((totalPool % 2000) / 2000) * 360));
        }}
        title="Tap to tune total target pool"
      >
        <div className="flex items-center justify-center w-full">
          <span
            className={`text-[14px] font-montez tracking-normal bg-stone-100 px-3 py-0.5 rounded-full transition-colors ${
              activeTarget === 'total' ? 'text-black font-bold' : 'text-neutral-500'
            }`}
          >
            Planned Target
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-0.5">
          <span className="text-[11px] font-sans tracking-wide text-neutral-500 mb-0.5">
            Total Budget Pool
          </span>
          <div className="flex items-baseline justify-center gap-0.5 text-black">
            <span className="font-montez text-4xl font-bold leading-none tracking-tight text-black">
              ${totalPool.toFixed(2)}
            </span>
          </div>
          <svg className="w-36 h-2 mt-0.5 text-black" fill="none" preserveAspectRatio="none" viewBox="0 0 200 12">
            <path
              d="M2 6 Q 25 1, 50 6 T 100 6 T 150 6 T 198 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </section>

      {/* 3. Rotary Dial Section with Direct Typing */}
      <section className="bg-white rounded-2xl p-2.5 shadow-sm border border-black/10 flex flex-col items-center justify-center gap-1.5 relative select-none">
        <div className="w-full flex items-center justify-between pb-1.5 border-b border-black/5 px-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-sans uppercase tracking-wider text-neutral-400 font-bold">
              {activeTarget === 'total' ? 'Dial Tuning Target' : 'Dial Tuning Active'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-montez text-2xl text-black font-bold leading-tight">
                {activeTarget === 'total' ? 'Total Budget Pool' : activeCategory?.name || 'Category'}
              </span>
              {activeTarget !== 'total' && activeCategory && (
                <button
                  type="button"
                  onClick={() => handleOpenRename(activeCategory)}
                  className="text-neutral-400 hover:text-black cursor-pointer"
                  title="Rename Category"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Direct typing interactive container */}
          <div className="flex items-center gap-1 bg-stone-50 hover:bg-stone-100 border border-black/15 rounded-xl px-2 py-1 transition-all focus-within:ring-2 focus-within:ring-black focus-within:bg-white cursor-text">
            <span className="font-montez text-2xl text-black font-bold leading-none select-none">$</span>
            <input
              type="number"
              step="any"
              min="0"
              max="99999"
              value={currentAmt}
              onChange={(e) => setActiveAmount(parseFloat(e.target.value) || 0)}
              className="font-montez text-2xl text-black font-bold w-20 bg-transparent border-none p-0 focus:outline-none focus:ring-0 leading-none text-right"
              placeholder="0.00"
            />
            <span className="material-symbols-outlined text-[15px] text-neutral-400 ml-0.5 pointer-events-none">
              edit
            </span>
          </div>
        </div>

        {/* Concentric 200x200 Dial Frame */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center my-0.5">
          <svg className="absolute inset-0 w-[200px] h-[200px] pointer-events-none" viewBox="0 0 200 200">
            {/* Outer dashed track */}
            <circle cx="100" cy="100" fill="none" r="90" stroke="#141414" strokeDasharray="1 5" strokeLinecap="round" strokeWidth="2" />
            {/* Dot Circle Track (radius 78px) */}
            <circle cx="100" cy="100" fill="none" r="78" stroke="#141414" strokeWidth="1.2" />
            <g fill="#141414">
              <circle cx="100" cy="22" r="2.5" />
              <circle cx="124" cy="26" r="2" />
              <circle cx="146" cy="36" r="2" />
              <circle cx="163" cy="51" r="2" />
              <circle cx="173" cy="71" r="2" />
              <circle cx="178" cy="100" r="2.5" />
              <circle cx="173" cy="129" r="2" />
              <circle cx="163" cy="149" r="2" />
              <circle cx="146" cy="164" r="2" />
              <circle cx="124" cy="174" r="2" />
              <circle cx="100" cy="178" r="2.5" />
              <circle cx="76" cy="174" r="2" />
              <circle cx="54" cy="164" r="2" />
              <circle cx="37" cy="149" r="2" />
              <circle cx="27" cy="129" r="2" />
              <circle cx="22" cy="100" r="2.5" />
              <circle cx="27" cy="71" r="2" />
              <circle cx="37" cy="51" r="2" />
              <circle cx="54" cy="36" r="2" />
              <circle cx="76" cy="26" r="2" />
            </g>
            <circle cx="100" cy="100" fill="none" r="58" stroke="#141414" strokeDasharray="3 3" strokeWidth="1.5" />
          </svg>

          {/* Rotary Dial Interactive Surface */}
          <div
            ref={dialRef}
            onPointerDown={handlePointerDown}
            className="absolute w-[200px] h-[200px] rounded-full flex items-center justify-center touch-none cursor-grab active:cursor-grabbing z-10"
          >
            {/* Thumb Knob along r=78px concentric track */}
            <div
              className="absolute w-5 h-5 bg-black rounded-full border-2 border-white shadow-md flex items-center justify-center pointer-events-none transition-transform"
              style={{
                top: 'calc(50% - 10px)',
                left: 'calc(50% - 10px)',
                transform: `rotate(${currentAngle}deg) translateY(-78px)`,
              }}
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            {/* Center + button */}
            <div className="w-24 h-24 rounded-full bg-stone-50 border-2 border-black/20 flex flex-col items-center justify-center shadow-inner relative z-10 pointer-events-auto">
              <button
                type="button"
                id="dialCenterPlus"
                onClick={handleAddNewCategory}
                className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-stone-100 active:scale-90 transition-transform shadow-sm cursor-pointer"
                title="Add Category"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <span className="font-montez text-sm text-neutral-600 mt-0.5 leading-none">
                Add Category
              </span>
            </div>
          </div>
        </div>

        {/* Quick adjustment buttons (-$100, -$50, +$50, +$100) */}
        <div className="w-full flex items-center justify-center gap-1.5 pt-0.5 border-t border-black/5">
          <button
            type="button"
            onClick={() => stepActiveValue(-100)}
            className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/10 text-[10px] font-mono font-semibold text-black active:scale-95 transition-all cursor-pointer"
          >
            -$100
          </button>
          <button
            type="button"
            onClick={() => stepActiveValue(-50)}
            className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/10 text-[10px] font-mono font-semibold text-black active:scale-95 transition-all cursor-pointer"
          >
            -$50
          </button>
          <button
            type="button"
            onClick={() => stepActiveValue(50)}
            className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/10 text-[10px] font-mono font-semibold text-black active:scale-95 transition-all cursor-pointer"
          >
            +$50
          </button>
          <button
            type="button"
            onClick={() => stepActiveValue(100)}
            className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-black/10 text-[10px] font-mono font-semibold text-black active:scale-95 transition-all cursor-pointer"
          >
            +$100
          </button>
        </div>
      </section>

      {/* 4. Portion Allocation Horizontal Track */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="font-montez text-2xl text-black">Portion Allocation</span>
            <span className="text-[10px] font-sans uppercase tracking-wider bg-stone-100 text-neutral-600 px-2 py-0.5 rounded-full font-semibold">
              {categories.length} buckets
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddNewCategory}
            className="flex items-center gap-1 text-black text-xs font-semibold hover:opacity-80 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span className="font-sans text-[11px]">Add Category</span>
          </button>
        </div>

        {/* Snap scroll category cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 px-0.5 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeTarget === cat.id;
            return (
              <article
                key={cat.id}
                onClick={() => {
                  setActiveTarget(cat.id);
                  setCurrentAngle(Math.round(((cat.amount % 2000) / 2000) * 360));
                }}
                className={`min-w-[78%] snap-center shrink-0 bg-white rounded-2xl p-3.5 border shadow-xs flex flex-col justify-between gap-2.5 cursor-pointer transition-all ${
                  isActive
                    ? 'border-2 border-black shadow-md bg-stone-50/50 scale-[1.01]'
                    : 'border-black/15 opacity-90 hover:opacity-100 hover:border-black/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-black shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {cat.icon || 'local_grocery_store'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-montez text-2xl text-black leading-tight">
                          {cat.name}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleOpenRename(cat, e)}
                          className="text-neutral-400 hover:text-black active:scale-90 transition-transform p-0.5"
                          title="Rename Category"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                      </div>
                      <span className="text-[10px] font-sans text-neutral-500 uppercase tracking-wide block leading-tight">
                        {cat.subtitle || 'Custom Budget'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-stone-100 text-neutral-600'
                    }`}
                  >
                    {isActive ? 'Active Tuner' : 'Tap to Tune'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between bg-stone-50 rounded-xl p-2 border border-black/5">
                  <span className="text-xs font-sans text-neutral-500">Allocated</span>
                  <span className="font-montez text-2xl text-black font-bold">
                    ${cat.amount.toFixed(2)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Main Action Button matching design */}
      <div className="flex flex-col gap-1 pt-1 pb-1">
        <button
          type="button"
          onClick={handleSaveBudget}
          className="w-full py-2.5 px-4 rounded-xl font-montez text-2xl font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm cursor-pointer bg-white text-black border-2 border-black hover:bg-stone-50"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Save Budget Plan</span>
        </button>

        <div className="flex items-center justify-center gap-3 text-[11px] font-sans text-neutral-500 pt-0.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="hover:text-black cursor-pointer underline"
          >
            Reset Defaults
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onShowToast(`Exporting ${selectedMonth} ${selectedYear} Summary...`)}
            className="hover:text-black cursor-pointer underline"
          >
            Export Summary
          </button>
        </div>
      </div>

      {/* Inline category rename modal */}
      {editingCatId && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingCatId(null)}
        >
          <div
            className="w-full max-w-xs bg-white rounded-2xl p-4 border-2 border-black shadow-xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-montez text-2xl text-black">Rename Category</h3>
            <input
              type="text"
              value={renameInputVal}
              onChange={(e) => setRenameInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
              }}
              className="w-full px-3 py-2 border-2 border-black rounded-xl text-sm font-space"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCatId(null)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-mono font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
