"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Filter, RotateCcw } from "lucide-react";

interface CollegeFiltersProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export default function CollegeFilters({
  isOpenOnMobile,
  onCloseMobile,
}: CollegeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Available categories & states derived from database seeding definitions
  const categories = ["Engineering", "Medical", "Management", "Law", "Arts", "Commerce"];
  const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "West Bengal", "Telangana", "Uttar Pradesh", "Gujarat", "Rajasthan"];
  const types = ["GOVERNMENT", "PRIVATE", "DEEMED"];

  // Read initial states from SearchParams
  const activeCategory = searchParams.get("category") || "All";
  const activeType = searchParams.get("type") || "All";
  const activeState = searchParams.get("state") || "All";
  const activeMinRating = searchParams.get("minRating") || "0";
  const activeMaxFees = searchParams.get("maxFees") || "2000000";

  // Local state for immediate slide updates, debouncing URL pushes if needed
  const [feeRange, setFeeRange] = useState<number>(() => parseInt(activeMaxFees, 10));
  const [prevActiveMaxFees, setPrevActiveMaxFees] = useState(activeMaxFees);

  if (activeMaxFees !== prevActiveMaxFees) {
    setFeeRange(parseInt(activeMaxFees, 10));
    setPrevActiveMaxFees(activeMaxFees);
  }

  // General URL state update handler
  const updateQueryParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All" || value === "" || value === "0") {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    params.set("page", "1"); // Reset pagination page to 1 on filter alteration
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setFeeRange(2000000);
    router.push(pathname); // Clear all search queries
    onCloseMobile();
  };

  const formattedFee = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(feeRange);

  const filtersContent = (
    <div className="space-y-6">
      
      {/* Category filter */}
      <div>
        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={activeCategory === "All"}
              onChange={() => updateQueryParam("category", "All")}
              className="w-4 h-4 text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={activeCategory === cat}
                onChange={() => updateQueryParam("category", cat)}
                className="w-4 h-4 text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-surface-container"></div>

      {/* College type filter */}
      <div>
        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-3">
          Institution Type
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={activeType === "All"}
              onChange={() => updateQueryParam("type", "All")}
              className="w-4 h-4 text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
            />
            All Types
          </label>
          {types.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
            >
              <input
                type="radio"
                name="type"
                checked={activeType === type}
                onChange={() => updateQueryParam("type", type)}
                className="w-4 h-4 text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-surface-container"></div>

      {/* State filter */}
      <div>
        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-3">
          State
        </h4>
        <select
          value={activeState}
          onChange={(e) => updateQueryParam("state", e.target.value)}
          className="w-full text-xs font-semibold bg-white border border-outline-variant-custom rounded p-2 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none"
        >
          <option value="All">All Indian States</option>
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px bg-surface-container"></div>

      {/* Fees range filter */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">
            Maximum Fees
          </h4>
          <span className="text-xs font-bold text-primary-container">
            ₹{formattedFee}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="2000000"
          step="5000"
          value={feeRange}
          onChange={(e) => setFeeRange(parseInt(e.target.value, 10))}
          onMouseUp={() => updateQueryParam("maxFees", feeRange.toString())}
          onTouchEnd={() => updateQueryParam("maxFees", feeRange.toString())}
          className="w-full h-1.5 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-semibold">
          <span>₹1K</span>
          <span>₹10L</span>
          <span>₹20L</span>
        </div>
      </div>

      <div className="h-px bg-surface-container"></div>

      {/* Rating stars filter */}
      <div>
        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-3">
          Minimum Rating
        </h4>
        <div className="flex gap-2">
          {["0", "3", "4", "5"].map((rating) => {
            const isActive = activeMinRating === rating;
            return (
              <button
                key={rating}
                onClick={() => updateQueryParam("minRating", rating)}
                className={`flex-grow text-xs font-semibold px-2 py-1.5 rounded-sm border transition-all ${
                  isActive
                    ? "bg-primary-container text-white border-primary-container"
                    : "bg-white text-on-surface-variant border-outline-variant-custom hover:bg-surface-low"
                }`}
              >
                {rating === "0" ? "All" : `${rating}★`}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border border-outline-variant-custom/40 shadow-level1 rounded-lg p-5 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-container" />
            <h3 className="font-bold text-headline-sm text-on-surface">Filters</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-on-surface-variant hover:text-error flex items-center gap-1 transition-all"
            title="Reset Filters"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
        {filtersContent}
      </aside>

      {/* Mobile Drawer Slide-in */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/45"
            onClick={onCloseMobile}
          ></div>

          {/* Drawer content panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-level3 py-5 px-4 overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant-custom/20 pb-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary-container" />
                <h3 className="font-bold text-headline-sm text-on-surface">Filters</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-on-surface-variant hover:text-error flex items-center gap-1 transition-all"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
                  aria-label="Close Filters"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-grow pb-8">{filtersContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
