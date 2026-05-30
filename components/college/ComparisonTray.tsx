"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, BarChart2 } from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import Button from "../ui/Button";

export default function ComparisonTray() {
  const router = useRouter();
  const { colleges, removeCollege, setIsOpen, clear } = useComparisonStore();

  // If no colleges are selected, hide the tray
  if (colleges.length === 0) return null;

  const handleCompareClick = () => {
    const ids = colleges.map((c) => c.id).join(",");
    router.push(`/compare?ids=${ids}`);
    clear();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant-custom/60 shadow-level3 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Header & count */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-container rounded-full text-primary-container">
              <BarChart2 size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm md:text-base">
                Comparison Queue
              </h4>
              <p className="text-xs text-on-surface-variant">
                Select 2 to 4 colleges to compare ({colleges.length} selected)
              </p>
            </div>
          </div>

          {/* Selected College Chips */}
          <div className="flex flex-wrap items-center gap-2 max-w-2xl">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-2 bg-surface-low border border-outline-variant-custom/40 px-3 py-1.5 rounded-sm shadow-level1 transition-all hover:bg-surface-container"
              >
                {college.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={college.imageUrl}
                    alt={college.name}
                    className="w-6 h-6 object-cover rounded-full"
                  />
                )}
                <span className="text-xs font-semibold text-on-surface truncate max-w-[120px] md:max-w-[180px]">
                  {college.name}
                </span>
                <button
                  onClick={() => removeCollege(college.id)}
                  className="text-on-surface-variant hover:text-error rounded-full p-0.5"
                  aria-label={`Remove ${college.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={clear}
              className="text-xs font-medium text-on-surface-variant hover:text-error px-2 py-1 transition-all"
            >
              Clear All
            </button>
            <Button
              variant="primary"
              size="sm"
              disabled={colleges.length < 2}
              onClick={handleCompareClick}
              className="w-full md:w-auto"
            >
              Compare Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
