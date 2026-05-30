"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, Search, Plus } from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import CollegeFilters from "@/components/college/CollegeFilters";
import CollegeCard from "@/components/college/CollegeCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTray from "@/components/college/ComparisonTray";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

function CollegesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { colleges, pagination, isLoading, isPlaceholderData } = useColleges();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Local search value for instant typing, synced with debounce
  const urlSearchVal = searchParams.get("q") || "";
  const [searchVal, setSearchVal] = useState(urlSearchVal);
  const [prevUrlSearchVal, setPrevUrlSearchVal] = useState(urlSearchVal);

  if (urlSearchVal !== prevUrlSearchVal) {
    setSearchVal(urlSearchVal);
    setPrevUrlSearchVal(urlSearchVal);
  }

  // Debounced search logic (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      const newQ = searchVal.trim();
      
      // Only trigger a router push if the search value has actually changed
      if (currentQ !== newQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (newQ === "") {
          params.delete("q");
        } else {
          params.set("q", newQ);
        }
        params.set("page", "1"); // Reset pagination page on search change
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, router, pathname, searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    
    // Smooth scroll to top of feed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    router.push(pathname);
  };


  // Build page indicators
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="font-bold text-display-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-2">
            Discover Top Colleges in India
          </h1>
          <p className="text-sm md:text-body-md text-on-surface-variant max-w-2xl">
            Compare fees, placement packages, ratings, and course options to find your ideal academic path.
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          {/* Debounced Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full text-sm font-semibold pl-10 pr-4 py-2.5 bg-white border border-outline-variant-custom rounded-default shadow-level1 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="absolute right-3 top-3 text-xs font-semibold text-on-surface-variant hover:text-error"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters Info & Mobile Menu Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs font-semibold text-on-surface-variant">
              Showing <span className="text-on-surface font-bold">{pagination.total}</span> colleges
            </div>

            <Link href="/admin/colleges/new">
              <Button variant="primary" size="sm" className="hidden md:inline-flex">
                <Plus size={14} className="mr-1" />
                Add College
              </Button>
            </Link>
            
            {/* Mobile filter trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-on-surface bg-white border border-outline-variant-custom rounded-default hover:bg-surface-low shadow-level1 transition-all"
            >
              <SlidersHorizontal size={16} className="text-primary-container" />
              Filters
            </button>
          </div>
        </div>

        {/* Outer discovery layout grid */}
        <div className="flex gap-8 relative">
          
          {/* Sidebar filters (Desktop sticky, Mobile sheet drawer) */}
          <CollegeFilters
            isOpenOnMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Colleges Listing Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : colleges.length === 0 ? (
              <EmptyState
                title="No Colleges Found"
                description="We couldn't find any colleges matching your active filters. Try loosening your fee caps or categories."
                actionLabel="Clear All Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <div className={`space-y-8 transition-opacity duration-200 ${isPlaceholderData ? "opacity-70" : "opacity-100"}`}>
                
                {/* College Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <nav className="flex items-center justify-between border-t border-outline-variant-custom/30 pt-6">
                    <div className="hidden sm:block">
                      <p className="text-xs text-on-surface-variant font-semibold">
                        Showing page <span className="font-bold text-on-surface">{pagination.page}</span> of{" "}
                        <span className="font-bold text-on-surface">{pagination.totalPages}</span> (Total {pagination.total} results)
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Prev Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="!px-3 !py-1.5"
                      >
                        Prev
                      </Button>

                      {/* Numbered pages */}
                      {pageNumbers.map((num) => {
                        const isCurrent = pagination.page === num;
                        return (
                          <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-bold border transition-all ${
                              isCurrent
                                ? "bg-primary-container text-white border-primary-container"
                                : "bg-white text-on-surface border-outline-variant-custom hover:bg-surface-low"
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="!px-3 !py-1.5"
                      >
                        Next
                      </Button>
                    </div>
                  </nav>
                )}

              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
      <ComparisonTray />
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen justify-between">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
          <div className="h-10 w-48 bg-surface-container animate-pulse rounded mb-8"></div>
          <SkeletonGrid count={6} />
        </main>
        <Footer />
      </div>
    }>
      <CollegesListContent />
    </Suspense>
  );
}
