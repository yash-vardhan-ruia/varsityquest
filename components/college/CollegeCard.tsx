"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, IndianRupee, Briefcase, Calendar, Building2 } from "lucide-react";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { useComparisonStore } from "@/store/comparisonStore";
import RatingStars from "../ui/RatingStars";
import Badge from "../ui/Badge";

interface CourseItem {
  id: string;
  name: string;
  fees: number;
}

interface PlacementData {
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
}

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    slug: string;
    location: string;
    city: string;
    state: string;
    rating: number;
    totalFees: number;
    established: number | null;
    type: string;
    category: string;
    imageUrl: string | null;
    placements?: PlacementData | null;
    courses?: CourseItem[];
  };
}

const categoryColorMap: Record<string, { gradient: string; iconColor: string; textColor: string; badgeClass: string }> = {
  Engineering: {
    gradient: "from-teal-500/10 to-teal-600/20",
    iconColor: "text-teal-600/60",
    textColor: "text-teal-700/80",
    badgeClass: "bg-teal-50 text-teal-700 border border-teal-200/60",
  },
  Medical: {
    gradient: "from-emerald-500/10 to-emerald-600/20",
    iconColor: "text-emerald-600/60",
    textColor: "text-emerald-700/80",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  Management: {
    gradient: "from-blue-500/10 to-blue-600/20",
    iconColor: "text-blue-600/60",
    textColor: "text-blue-700/80",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/60",
  },
  Law: {
    gradient: "from-purple-500/10 to-purple-600/20",
    iconColor: "text-purple-600/60",
    textColor: "text-purple-700/80",
    badgeClass: "bg-purple-50 text-purple-700 border border-purple-200/60",
  },
  Arts: {
    gradient: "from-amber-500/10 to-amber-600/20",
    iconColor: "text-amber-600/60",
    textColor: "text-amber-700/80",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/60",
  },
  Commerce: {
    gradient: "from-rose-500/10 to-rose-600/20",
    iconColor: "text-rose-600/60",
    textColor: "text-rose-700/80",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200/60",
  },
};

const typeColorMap: Record<string, string> = {
  GOVERNMENT: "bg-emerald-600 text-white border-none",
  PRIVATE: "bg-blue-600 text-white border-none",
  DEEMED: "bg-purple-600 text-white border-none",
};

export default function CollegeCard({ college }: CollegeCardProps) {
  const { isSaved, toggleSave, isMutating } = useSavedColleges();
  const { colleges: compareColleges, addCollege, removeCollege } = useComparisonStore();
  const [imageError, setImageError] = useState(false);

  const colors = categoryColorMap[college.category] || categoryColorMap.Engineering;

  const isCollegeSaved = isSaved(college.id);
  const isInCompare = compareColleges.some((c) => c.id === college.id);

  const handleCompareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      addCollege({
        id: college.id,
        name: college.name,
        city: college.city,
        imageUrl: college.imageUrl,
        category: college.category,
      });
    } else {
      removeCollege(college.id);
    }
  };

  const formattedFees = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(college.totalFees);

  const defaultImage = "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="group w-full bg-white rounded-2xl border border-outline-variant-custom/40 shadow-level1 hover:shadow-level2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Banner & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-container flex items-center justify-center">
        {!imageError && college.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center p-4 text-center`}>
            <Building2 className={`w-12 h-12 ${colors.iconColor} mb-2`} />
            <span className={`text-[10px] uppercase tracking-wider font-bold ${colors.textColor}`}>
              {college.category}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <Badge
            variant="custom"
            className={typeColorMap[college.type] || "bg-outline-variant-custom text-on-surface-variant"}
          >
            {college.type}
          </Badge>
          <Badge
            variant="custom"
            className={colors.badgeClass}
          >
            {college.category}
          </Badge>
        </div>

        {/* Floating Save Button */}
        <button
          disabled={isMutating}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(college.id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md shadow-level1 transition-all z-10 ${
            isCollegeSaved
              ? "bg-error text-white scale-110"
              : "bg-white/80 text-on-surface-variant hover:bg-white hover:text-error"
          }`}
          aria-label={isCollegeSaved ? "Remove from saved" : "Save college"}
        >
          <Heart size={18} className={isCollegeSaved ? "fill-current" : ""} />
        </button>

        {/* Quick Location & Est Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white z-10">
          <div className="flex items-center gap-1 text-xs font-semibold drop-shadow-md">
            <MapPin size={12} className="text-secondary-container" />
            <span className="truncate">{college.city}, {college.state}</span>
          </div>
          {college.established && (
            <div className="flex items-center gap-1 text-xs font-medium opacity-90 drop-shadow-md">
              <Calendar size={12} />
              <span>Est. {college.established}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        
        <div>
          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={college.rating} count={college.rating ? 24 : 0} size={14} />
          </div>

          {/* Title Link */}
          <Link href={`/colleges/${college.slug}`} className="block group-hover:text-primary-container transition-all">
            <h3 className="font-bold text-headline-sm text-on-surface group-hover:text-primary-container leading-tight line-clamp-2 mb-3">
              {college.name}
            </h3>
          </Link>
        </div>

        <div className="space-y-3">
          {/* Divider */}
          <div className="h-px bg-surface-container my-1"></div>

          {/* Placements & Fees Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-on-surface-variant flex items-center gap-1 font-medium">
                <IndianRupee size={12} className="text-primary-container" />
                Annual Fees
              </span>
              <p className="font-bold text-on-surface text-sm">
                ₹{formattedFees}
                <span className="text-[10px] text-on-surface-variant font-normal"> / yr</span>
              </p>
            </div>
            
            <div className="space-y-0.5 border-l border-outline-variant-custom/20 pl-3">
              <span className="text-on-surface-variant flex items-center gap-1 font-medium">
                <Briefcase size={12} className="text-tertiary" />
                Avg Package
              </span>
              <p className="font-bold text-on-surface text-sm">
                {college.placements ? `${college.placements.avgPackage} LPA` : "N/A"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-surface-container my-2"></div>

          {/* Action Row: Compare Checkbox & View Details Link */}
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isInCompare}
                onChange={handleCompareChange}
                className="w-4 h-4 rounded border-outline-variant-custom text-primary-container focus:ring-primary-container focus:ring-2 cursor-pointer accent-primary-container"
              />
              <span className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all">
                Add to Compare
              </span>
            </label>

            <Link href={`/colleges/${college.slug}`}>
              <span className="inline-flex items-center text-xs font-bold text-primary-container hover:text-secondary hover:underline transition-all">
                View Details
              </span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
