"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowLeft, Share2, Bookmark, BarChart2, Star, IndianRupee, GraduationCap, X } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTray from "@/components/college/ComparisonTray";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface CourseItem {
  id: string;
  name: string;
  fees: number;
}

interface PlacementData {
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
  year: number;
}

interface CollegeCompare {
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
  courses: CourseItem[];
  reviews: unknown[];
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();


  const idsParam = searchParams.get("ids") || "";
  const collegeIds = idsParam.split(",").filter((id) => id.trim().length > 0);

  const [label, setLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch comparison data
  const { data: comparisonResponse, isLoading, error } = useQuery<{
    success: boolean;
    data: CollegeCompare[];
  }>({
    queryKey: ["compareColleges", idsParam],
    queryFn: async () => {
      if (!idsParam) return { success: true, data: [] };
      const res = await fetch(`/api/colleges/compare?ids=${idsParam}`);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to fetch comparison");
      }
      return res.json();
    },
    enabled: collegeIds.length > 0,
  });

  const colleges = comparisonResponse?.data || [];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Comparison link copied to clipboard!");
    }
  };

  const handleSaveComparison = async () => {
    if (!session) {
      toast.error("Please log in to save comparisons");
      router.push("/auth/login");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/saved/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeIds: colleges.map((c) => c.id),
          label: label.trim() || `Comparison: ${colleges.map((c) => c.name.split(" ")[0]).join(" vs ")}`,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save comparison");

      toast.success("Comparison saved to dashboard!");
      setLabel("");
    } catch (err: unknown) {
      console.error("Save comparison error:", err);
      const message = err instanceof Error ? err.message : "Failed to save comparison";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (collegeIds.length < 2) {
    return (
      <div className="flex flex-col min-h-screen bg-canvas-neutral">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 bg-white rounded-lg border border-outline-variant-custom/40 shadow-level1">
          <div className="p-4 bg-secondary-container text-primary-container rounded-full mb-4">
            <BarChart2 size={40} />
          </div>
          <h2 className="font-bold text-headline-md text-on-surface mb-2">Insufficient Colleges</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            Please select at least 2 colleges to see their specifications compared side-by-side.
          </p>
          <Button onClick={() => router.push("/colleges")}>Browse Colleges</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-canvas-neutral">
        <Navbar />
        <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-12 space-y-6">
          <div className="h-10 w-48 bg-surface-container animate-pulse rounded"></div>
          <div className="h-[400px] w-full bg-surface-container animate-pulse rounded-lg"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || colleges.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-canvas-neutral">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 bg-white rounded-lg border border-outline-variant-custom/40 shadow-level1">
          <div className="p-4 bg-error-container text-on-error-container rounded-full mb-4">
            <X size={40} />
          </div>
          <h2 className="font-bold text-headline-md text-on-surface mb-2">Comparison Failed</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            We couldn&apos;t retrieve records for the requested colleges. They may have been deleted.
          </p>
          <Button onClick={() => router.push("/colleges")}>Back to Directory</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Row "Winner" calculations
  const feesArray = colleges.map((c) => c.totalFees);
  const minFees = Math.min(...feesArray);

  const avgPlacementsArray = colleges.map((c) => c.placements?.avgPackage || 0);
  const maxAvgPlacement = Math.max(...avgPlacementsArray);

  const highestPlacementsArray = colleges.map((c) => c.placements?.highestPackage || 0);
  const maxHighestPlacement = Math.max(...highestPlacementsArray);

  const placementRatesArray = colleges.map((c) => c.placements?.placementRate || 0);
  const maxPlacementRate = Math.max(...placementRatesArray);

  const ratingsArray = colleges.map((c) => c.rating);
  const maxRating = Math.max(...ratingsArray);

  const coursesCountArray = colleges.map((c) => c.courses.length);
  const maxCoursesCount = Math.max(...coursesCountArray);

  const defaultImage = "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-canvas-neutral">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Back and Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/colleges")}
              className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary-container transition-all mb-2"
            >
              <ArrowLeft size={14} />
              Back to Directory
            </button>
            <h1 className="font-bold text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
              <BarChart2 className="text-primary-container" />
              Side-by-Side Comparison
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" onClick={handleShare} className="flex items-center gap-2">
              <Share2 size={16} />
              Share Link
            </Button>
            {session && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Comparison label..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="bg-white border border-outline-variant-custom rounded p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container max-w-[150px]"
                />
                <Button
                  variant="primary"
                  isLoading={isSaving}
                  onClick={handleSaveComparison}
                  className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap"
                >
                  <Bookmark size={14} />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table card */}
        <div className="bg-white border border-outline-variant-custom/40 shadow-level1 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm font-semibold border-collapse table-fixed min-w-[700px]">
              
              <thead>
                <tr className="border-b border-surface-container bg-surface-low text-on-surface-variant">
                  <th className="p-4 w-48 font-bold">Metrics</th>
                  {colleges.map((college) => (
                    <th key={college.id} className="p-4 font-bold border-l border-surface-container">
                      <div className="space-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={college.imageUrl || defaultImage}
                          alt={college.name}
                          className="w-full h-24 object-cover rounded-sm border border-outline-variant-custom/30"
                        />
                        <h3 className="font-bold text-sm text-on-surface line-clamp-2 leading-tight">
                          {college.name}
                        </h3>
                        <Badge variant={college.type === "GOVERNMENT" ? "primary" : "secondary"}>
                          {college.type}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-container text-on-surface-variant">
                
                {/* 1. Category */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Category</td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-4 border-l border-surface-container font-semibold text-on-surface">
                      {c.category}
                    </td>
                  ))}
                </tr>

                {/* 2. City & State */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Location</td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-4 border-l border-surface-container">
                      {c.city}, {c.state}
                    </td>
                  ))}
                </tr>

                {/* 3. Rating (Best Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Rating Score</td>
                  {colleges.map((c) => {
                    const isWinner = c.rating === maxRating;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className="fill-star-gold text-star-gold" />
                          <span>{c.rating.toFixed(1)}</span>
                          {isWinner && (
                            <Badge variant="gold" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2">
                              Best Rating
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 4. Total Fees (Lowest Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Annual Fees</td>
                  {colleges.map((c) => {
                    const isWinner = c.totalFees === minFees;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} className="text-primary-container" />
                          <span>₹{new Intl.NumberFormat("en-IN").format(c.totalFees)}</span>
                          {isWinner && (
                            <Badge variant="primary" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2 bg-emerald-600">
                              Lowest Fees
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Average Package (Best Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Avg Salary Package</td>
                  {colleges.map((c) => {
                    const pkg = c.placements?.avgPackage || 0;
                    const isWinner = pkg > 0 && pkg === maxAvgPlacement;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div>
                          <span>{pkg > 0 ? `${pkg} LPA` : "N/A"}</span>
                          {isWinner && (
                            <Badge variant="gold" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2">
                              Highest Avg
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 6. Highest Package (Best Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Highest Package</td>
                  {colleges.map((c) => {
                    const pkg = c.placements?.highestPackage || 0;
                    const isWinner = pkg > 0 && pkg === maxHighestPlacement;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div>
                          <span>{pkg > 0 ? `${pkg} LPA` : "N/A"}</span>
                          {isWinner && (
                            <Badge variant="neutral" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2 bg-purple-100 text-purple-800 border-none">
                              Highest Peak
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 7. Placement Rate (Best Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Placement Rate</td>
                  {colleges.map((c) => {
                    const rate = c.placements?.placementRate || 0;
                    const isWinner = rate > 0 && rate === maxPlacementRate;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div>
                          <span>{rate > 0 ? `${rate}%` : "N/A"}</span>
                          {isWinner && (
                            <Badge variant="primary" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2">
                              Highest Rate
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 8. Course Programs Count (Best Winner Highlighted) */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Courses Offered</td>
                  {colleges.map((c) => {
                    const count = c.courses.length;
                    const isWinner = count === maxCoursesCount;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-surface-container font-bold text-on-surface ${
                          isWinner
                            ? "bg-secondary-container/10 border-l-2 border-l-primary-container"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <GraduationCap size={16} className="text-secondary" />
                          <span>{count} Programs</span>
                          {isWinner && (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0.5 rounded-sm normal-case ml-2">
                              Most Options
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 9. Top Recruiter Groups */}
                <tr className="hover:bg-surface-low/30">
                  <td className="p-4 font-bold text-on-surface">Top Recruiters</td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-4 border-l border-surface-container">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {c.placements?.topRecruiters.slice(0, 4).map((company) => (
                          <span
                            key={company}
                            className="px-1.5 py-0.5 bg-surface-low border border-outline-variant-custom/30 text-[10px] font-semibold text-on-surface-variant rounded-sm"
                          >
                            {company}
                          </span>
                        )) || "N/A"}
                      </div>
                    </td>
                  ))}
                </tr>

              </tbody>

            </table>
          </div>
        </div>

      </main>

      <Footer />
      <ComparisonTray />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen justify-between">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
          <div className="h-10 w-48 bg-surface-container animate-pulse rounded mb-8"></div>
        </main>
        <Footer />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
