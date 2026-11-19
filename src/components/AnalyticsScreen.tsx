import React, { useState, useRef } from 'react';
import { BudgetCategory, DayExpense, ScreenType } from '../types.ts';
import { WEEKLY_RHYTHM, MONTHLY_RHYTHM, OCTOBER_DAYS } from '../data/initialData.ts';

interface AnalyticsScreenProps {
  categories: BudgetCategory[];
  totalBalance: number;
  totalOutflow: number;
  activeMonth: string;
  dayIndicator: string;
  onNavigate: (screen: ScreenType) => void;
  onOpenMonthPicker: () => void;
  onOpenTransactions: (categoryKey: string) => void;
  onExportReport: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  categories,
  totalBalance,
  totalOutflow,
  activeMonth,
  dayIndicator,
  onNavigate,
  onOpenMonthPicker,
  onOpenTransactions,
  onExportReport,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBurnDrawerOpen, setIsBurnDrawerOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [weeklyTooltip, setWeeklyTooltip] = useState({ label: 'Tap any day bar for details', val: '$960 total' });
  const [monthlyTooltip, setMonthlyTooltip] = useState({ label: 'Tap week for breakdown', val: '$1,850 MTD' });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<DayExpense>(
    OCTOBER_DAYS.find((d) => d.isToday) || OCTOBER_DAYS[25]
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: number) => {
    if (!carouselRef.current) return;
    const cardWidth = 280;
    carouselRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollPos = carouselRef.current.scrollLeft;
    const cardWidth = 280;
    const newIdx = Math.round(scrollPos / cardWidth);
    setCarouselIndex(Math.min(2, Math.max(0, newIdx)));
  };

  const goToSlide = (idx: number) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCarouselIndex(idx);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full relative z-10 max-w-md mx-auto px-4 pb-16">
      {/* 1. Top Navigation Header */}
      <header className="flex items-center justify-between pt-1 relative">
        <button
          type="button"
          aria-label="Back to Dashboard"
          onClick={() => onNavigate('dashboard')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/10"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h1 className="font-montez text-3xl text-black tracking-wide leading-none">
              Analytics & Balance
            </h1>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Budget Options"
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen((prev) => !prev);
            }}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/10"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {isFilterOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 bg-white sketch-dropdown z-50 p-2 shadow-xl origin-top-right transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-1.5 py-1 border-b border-black/10 flex items-center justify-between">
                <span className="font-montez text-sm text-[#5e5e5e]">Analytics Scope</span>
                <span className="material-symbols-outlined text-[14px] text-[#5e5e5e]">tune</span>
              </div>
              <div className="flex flex-col py-1 gap-1">
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#f3f3f4] active:bg-[#eeeeee] flex items-center justify-between cursor-pointer"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <span className="font-montez text-lg text-black">This Month</span>
                  <span className="text-xs">✓</span>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#f3f3f4] active:bg-[#eeeeee] flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    setIsFilterOpen(false);
                    onOpenMonthPicker();
                  }}
                >
                  <span className="font-montez text-lg text-black">Last Month</span>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#f3f3f4] active:bg-[#eeeeee] flex items-center justify-between cursor-pointer"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <span className="font-montez text-lg text-black">Year-to-date</span>
                </button>
                <div className="h-[1px] bg-black/10 my-0.5" />
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#f3f3f4] active:bg-[#eeeeee] flex items-center justify-between cursor-pointer text-black"
                  onClick={() => {
                    setIsFilterOpen(false);
                    onExportReport();
                  }}
                >
                  <span className="font-montez text-lg">Export CSV Summary</span>
                  <span className="material-symbols-outlined text-[15px]">download</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Total Budget Burn Rate & Balance Hero Card */}
      <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-black/5">
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={onOpenMonthPicker}
            className="text-xs font-mono font-medium text-black bg-[#eeeeee] px-2.5 py-0.5 rounded-full hover:bg-[#e8e8e8] transition-colors cursor-pointer"
          >
            {dayIndicator}
          </button>
          <button
            type="button"
            onClick={onOpenMonthPicker}
            className="font-montez text-lg text-[#5e5e5e] px-2.5 py-0.5 rounded-full bg-[#eeeeee] hover:bg-[#e8e8e8] active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span>{activeMonth}</span>
          </button>
        </div>

        {/* Main Highlight Numbers */}
        <div className="flex flex-col items-center justify-center py-2 text-center">
          <span className="text-xs font-space text-[#5e5e5e] mb-0.5">Remaining Balance</span>
          <div className="flex items-baseline justify-center gap-1 text-black">
            <span
              className="font-montez font-extrabold leading-none tracking-tight"
              style={{ fontSize: '52px', lineHeight: 1 }}
            >
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <svg className="w-48 h-3 mt-1 text-black" fill="none" preserveAspectRatio="none" viewBox="0 0 200 12">
            <path
              d="M2 6 Q 25 1, 50 6 T 100 6 T 150 6 T 198 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Quick Metric Split */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div
            className="bg-[#f3f3f4] rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-[#eeeeee] transition-colors active:scale-98"
            onClick={() => onNavigate('budget')}
            title="Click to tune budget cap"
          >
            <span className="text-[10px] font-mono text-[#5e5e5e] uppercase tracking-wider">
              Total Cap
            </span>
            <span className="font-montez text-2xl text-black font-bold mt-0.5">$4,800.00</span>
            <span className="text-[10px] font-mono text-[#5e5e5e] mt-1">100% planned</span>
          </div>
          <div
            className="bg-[#f3f3f4] rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-[#eeeeee] transition-colors active:scale-98"
            onClick={() => onOpenTransactions('all')}
          >
            <span className="text-[10px] font-mono text-[#5e5e5e] uppercase tracking-wider">
              Total Spent
            </span>
            <span className="font-montez text-2xl text-black font-bold mt-0.5">
              ${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-[#5e5e5e] mt-1">43% consumed</span>
          </div>
        </div>

        {/* Burn Rate Momentum (Interactive Tap) */}
        <div
          className="flex flex-col gap-1.5 pt-1 cursor-pointer group"
          onClick={() => setIsBurnDrawerOpen((prev) => !prev)}
        >
          <div className="flex justify-between items-center text-black text-xs font-space">
            <span className="flex items-center gap-1 group-hover:underline">
              <span className="material-symbols-outlined text-[16px]">draw</span>
              Burn Momentum
            </span>
            <span className="font-montez text-xl font-bold">57% Safe Margin</span>
          </div>
          <div className="relative w-full h-4 bg-[#eeeeee] rounded-full overflow-hidden flex items-center p-0.5">
            <div
              className="h-full rounded-full bg-black relative overflow-hidden transition-all duration-500"
              style={{ width: '43%' }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <rect fill="url(#ink-bar-hatch-merged)" height="100%" width="100%" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#5e5e5e] px-0.5">
            <span>Spent ${totalOutflow.toFixed(2)}</span>
            <span>Target Under $3,800.00</span>
          </div>
          {isBurnDrawerOpen && (
            <div className="bg-[#f3f3f4] p-2.5 rounded-xl text-center border border-black/10 mt-1 transition-all">
              <p className="font-montez text-xl text-black leading-tight">
                Burn rate is currently 22% slower than expected pace. Excellent cushion remaining!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Portion Allocation Carousel Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-montez text-2xl text-black">Portion Allocation</span>
            <span className="text-[10px] font-mono bg-[#eeeeee] text-[#5e5e5e] px-2 py-0.5 rounded-full font-semibold">
              {categories.length} buckets
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous card"
              className="w-6 h-6 rounded-full bg-[#eeeeee] hover:bg-[#e8e8e8] flex items-center justify-center text-black active:scale-90 cursor-pointer"
              onClick={() => scrollCarousel(-1)}
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            </button>
            <button
              type="button"
              aria-label="Next card"
              className="w-6 h-6 rounded-full bg-[#eeeeee] hover:bg-[#e8e8e8] flex items-center justify-center text-black active:scale-90 cursor-pointer"
              onClick={() => scrollCarousel(1)}
            >
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Snap Scroll Cards */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {/* Card 1: Essentials */}
          <article
            className="min-w-[85%] sm:min-w-[75%] snap-center shrink-0 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-black/10 cursor-pointer hover:border-black/40 transition-all active:scale-[0.99]"
            onClick={() => onOpenTransactions('essentials')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eeeeee] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">local_grocery_store</span>
                </div>
                <div className="flex flex-col text-left">
                  <h2 className="font-montez text-2xl text-black leading-tight">Essentials</h2>
                  <span className="text-[10px] font-mono text-[#5e5e5e]">Rent, Groceries & Bills</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#eeeeee] text-black font-semibold">
                49% Spent
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#f3f3f4] rounded-xl p-2.5">
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Used</span>
                <p className="font-montez text-2xl text-black font-bold">$888.00</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Left of $1,800</span>
                <p className="font-montez text-2xl text-black font-bold">$912.00</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-full h-3 bg-[#eeeeee] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-black rounded-full" style={{ width: '49.3%' }} />
              </div>
              <div className="flex items-center justify-between text-[#5e5e5e] text-[10px] font-mono pt-0.5">
                <span className="truncate">Top: Organic Co-op Market ($64.20)</span>
                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              </div>
            </div>
          </article>

          {/* Card 2: Fun & Life */}
          <article
            className="min-w-[85%] sm:min-w-[75%] snap-center shrink-0 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-black/10 cursor-pointer hover:border-black/40 transition-all active:scale-[0.99]"
            onClick={() => onOpenTransactions('fun')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eeeeee] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">coffee</span>
                </div>
                <div className="flex flex-col text-left">
                  <h2 className="font-montez text-2xl text-black leading-tight">Fun & Life</h2>
                  <span className="text-[10px] font-mono text-[#5e5e5e]">Dining, Vinyl & Cinema</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#eeeeee] text-black font-semibold">
                49% Spent
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#f3f3f4] rounded-xl p-2.5">
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Used</span>
                <p className="font-montez text-2xl text-black font-bold">$592.00</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Left of $1,200</span>
                <p className="font-montez text-2xl text-black font-bold">$608.00</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-full h-3 bg-[#eeeeee] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-black rounded-full" style={{ width: '49.3%' }} />
              </div>
              <div className="flex items-center justify-between text-[#5e5e5e] text-[10px] font-mono pt-0.5">
                <span className="truncate">Top: Weekend Concert ($32.00)</span>
                <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
              </div>
            </div>
          </article>

          {/* Card 3: Savings & Growth */}
          <article
            className="min-w-[85%] sm:min-w-[75%] snap-center shrink-0 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-black/10 cursor-pointer hover:border-black/40 transition-all active:scale-[0.99]"
            onClick={() => onOpenTransactions('savings')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eeeeee] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">savings</span>
                </div>
                <div className="flex flex-col text-left">
                  <h2 className="font-montez text-2xl text-black leading-tight">Savings & Growth</h2>
                  <span className="text-[10px] font-mono text-[#5e5e5e]">Rainy Day, SIP & Goals</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#eeeeee] text-black font-semibold">
                37% Stashed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#f3f3f4] rounded-xl p-2.5">
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Secured</span>
                <p className="font-montez text-2xl text-black font-bold">$370.00</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#5e5e5e]">Goal $1,000</span>
                <p className="font-montez text-2xl text-black font-bold">$630.00</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-full h-3 bg-[#eeeeee] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-black rounded-full" style={{ width: '37%' }} />
              </div>
              <div className="flex items-center justify-between text-[#5e5e5e] text-[10px] font-mono pt-0.5">
                <span className="truncate">Auto-Sweep: Index SIP ($150.00)</span>
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </div>
            </div>
          </article>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all cursor-pointer ${
                carouselIndex === i
                  ? 'w-4 h-2 rounded-full bg-black'
                  : 'w-2 h-2 rounded-full bg-black/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 4. Expense Rhythm Bar Chart Section */}
      <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4 border border-black/5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-montez text-2xl text-black leading-none">Expense Rhythm</h2>
          </div>
          <div className="bg-[#eeeeee] p-1 rounded-full flex items-center">
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                chartPeriod === 'weekly'
                  ? 'bg-black text-white font-semibold'
                  : 'text-[#5e5e5e] hover:text-black'
              }`}
              onClick={() => setChartPeriod('weekly')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                chartPeriod === 'monthly'
                  ? 'bg-black text-white font-semibold'
                  : 'text-[#5e5e5e] hover:text-black'
              }`}
              onClick={() => setChartPeriod('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Weekly Chart */}
        {chartPeriod === 'weekly' ? (
          <div className="flex flex-col gap-3">
            <div className="bg-[#f3f3f4] px-3 py-2 rounded-xl flex items-center justify-between border border-black/5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-black">insights</span>
                <span className="text-xs font-space text-[#5e5e5e]">{weeklyTooltip.label}</span>
              </div>
              <span className="font-montez text-2xl text-black font-bold">{weeklyTooltip.val}</span>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1 relative">
              {WEEKLY_RHYTHM.map((bar) => (
                <div
                  key={bar.day + bar.amount}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  onClick={() =>
                    setWeeklyTooltip({ label: `${bar.day}: ${bar.desc}`, val: bar.formatted })
                  }
                >
                  <span className="text-[10px] font-mono text-[#5e5e5e] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ${bar.amount}
                  </span>
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg relative transition-colors ${
                      bar.isPeak
                        ? 'bg-black flex items-center justify-center'
                        : 'bg-[#e2e2e2] group-hover:bg-black'
                    }`}
                    style={{ height: `${bar.pct}%` }}
                  >
                    {bar.isPeak && (
                      <span className="material-symbols-outlined text-white text-[14px]">star</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-mono mt-2 ${
                      bar.isPeak ? 'text-black font-bold' : 'text-black'
                    }`}
                  >
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Monthly Chart */
          <div className="flex flex-col gap-3">
            <div className="bg-[#f3f3f4] px-3 py-2 rounded-xl flex items-center justify-between border border-black/5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-black">calendar_month</span>
                <span className="text-xs font-space text-[#5e5e5e]">{monthlyTooltip.label}</span>
              </div>
              <span className="font-montez text-2xl text-black font-bold">{monthlyTooltip.val}</span>
            </div>

            <div className="h-44 w-full flex items-end justify-around gap-4 pt-6 pb-2 px-3 relative">
              {MONTHLY_RHYTHM.map((bar) => (
                <div
                  key={bar.week}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  onClick={() =>
                    setMonthlyTooltip({ label: bar.desc, val: bar.formatted })
                  }
                >
                  <span className="text-[10px] font-mono text-[#5e5e5e] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ${bar.amount}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg relative transition-colors ${
                      bar.isPeak
                        ? 'bg-black flex items-center justify-center'
                        : 'bg-[#e2e2e2] group-hover:bg-black'
                    }`}
                    style={{ height: `${bar.pct}%` }}
                  >
                    {bar.isPeak && (
                      <span className="material-symbols-outlined text-white text-[14px]">bolt</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-mono mt-2 ${
                      bar.isPeak ? 'text-black font-bold' : 'text-black'
                    }`}
                  >
                    {bar.week}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eeeeee] text-xs font-space text-[#5e5e5e]">
              <span>
                Weekly Avg:{' '}
                <strong className="text-black font-montez text-xl">$462.50</strong>
              </span>
              <span className="text-black">On pace with $4,800 cap</span>
            </div>
          </div>
        )}
      </section>

      {/* 5. Spend Calendar Section (Togglable) */}
      {isCalendarOpen && (
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 border border-black/5">
          <div className="flex items-center justify-between pb-1 border-b border-[#eeeeee]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-black">calendar_month</span>
              <h2 className="font-montez text-2xl text-black font-bold leading-none">
                October 2024 Spend Calendar
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close Spend Calendar"
              onClick={() => setIsCalendarOpen(false)}
              className="w-7 h-7 rounded-full bg-[#eeeeee] hover:bg-[#e8e8e8] flex items-center justify-center text-black text-xs active:scale-95 transition-all cursor-pointer border border-black/10"
            >
              ✕
            </button>
          </div>

          {/* Selected Day Banner */}
          <div className="bg-[#f3f3f4] px-3 py-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined text-[17px] text-black">draw</span>
              <span className="font-montez text-xl text-[#5e5e5e] truncate">
                {selectedCalendarDay.dateStr} • {selectedCalendarDay.description}
              </span>
            </div>
            <span className="font-montez text-2xl text-black font-bold shrink-0 ml-2">
              ${selectedCalendarDay.amount.toFixed(2)}
            </span>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center font-montez text-lg text-[#5e5e5e] border-b border-[#e8e8e8] pb-1 pt-0.5">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* 31 Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank leading days from prev month */}
            <div className="p-1 opacity-20 flex flex-col items-center justify-center">
              <span className="font-montez text-base text-[#5e5e5e]">29</span>
            </div>
            <div className="p-1 opacity-20 flex flex-col items-center justify-center">
              <span className="font-montez text-base text-[#5e5e5e]">30</span>
            </div>

            {OCTOBER_DAYS.map((d) => {
              const isSelected = selectedCalendarDay.day === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedCalendarDay(d)}
                  className={`flex flex-col items-center justify-center p-1 rounded-lg transition-all active:scale-95 cursor-pointer ${
                    d.isToday
                      ? 'bg-black text-white shadow-xs ring-2 ring-black ring-offset-1'
                      : isSelected
                      ? 'bg-[#eeeeee] border border-black shadow-xs'
                      : d.isPeak
                      ? 'bg-[#f3f3f4] border border-black/40 font-bold'
                      : 'hover:bg-[#f3f3f4]'
                  }`}
                >
                  <span
                    className={`font-montez text-base leading-none ${
                      d.isToday ? 'text-white font-bold' : d.isZero ? 'text-zinc-400' : 'text-black'
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`font-montez text-xs leading-tight ${
                      d.isToday ? 'text-white' : d.isZero ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    ${d.amount}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Toggle Spend Calendar Button */}
      <div className="flex flex-col items-center w-full pt-1 pb-6">
        <button
          type="button"
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="w-full py-3.5 px-4 rounded-xl font-montez text-2xl font-normal flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer bg-white text-black border-2 border-black shadow-sm hover:bg-stone-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isCalendarOpen ? 'expand_less' : 'calendar_today'}
          </span>
          <span>{isCalendarOpen ? 'Hide Spend Calendar' : 'Spend Calendar'}</span>
        </button>
        <p className="font-montez text-base text-[#5e5e5e]/80 text-center mt-3">
          Change mindful micro balance • Refreshed hourly
        </p>
      </div>
    </div>
  );
};
