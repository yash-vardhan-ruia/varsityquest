"use client";

import React, { useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MapPin, IndianRupee, Briefcase, GraduationCap, Percent, Star, CheckCircle, FileText, Building2 } from "lucide-react";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { useComparisonStore } from "@/store/comparisonStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTray from "@/components/college/ComparisonTray";
import RatingStars from "@/components/ui/RatingStars";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats: number | null;
}

interface Placement {
  id: string;
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
  year: number;
}

interface Review {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  pros: string | null;
  cons: string | null;
  batch: number | null;
  createdAt: string;
}

interface CollegeDetail {
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
  overview: string;
  imageUrl: string | null;
  website: string | null;
  courses: Course[];
  placements: Placement | null;
  reviews: Review[];
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

function CollegeDetailContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { isSaved, toggleSave, isMutating } = useSavedColleges();
  const { colleges: compareColleges, addCollege, removeCollege } = useComparisonStore();

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");
  const [imageError, setImageError] = useState(false);

  // Client-side course sorting
  const [courseSortBy, setCourseSortBy] = useState<"fees" | "duration">("fees");
  const [courseSortOrder, setCourseSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch detailed college
  const { data: collegeResponse, isLoading, error } = useQuery<{ success: boolean; data: CollegeDetail }>({
    queryKey: ["college", slug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}`);
      if (!res.ok) throw new Error("College not found");
      return res.json();
    },
  });

  const college = collegeResponse?.data;
  const colors = college ? (categoryColorMap[college.category] || categoryColorMap.Engineering) : categoryColorMap.Engineering;
  const isCollegeSaved = college ? isSaved(college.id) : false;
  const isInCompare = college ? compareColleges.some((c) => c.id === college.id) : false;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-12 space-y-6">
          <div className="h-64 w-full bg-surface-container animate-pulse rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 w-48 bg-surface-container animate-pulse rounded"></div>
              <div className="h-32 w-full bg-surface-container animate-pulse rounded"></div>
            </div>
            <div className="h-48 bg-surface-container animate-pulse rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12">
          <div className="p-4 bg-error-container text-on-error-container rounded-full mb-4">
            <Star size={40} />
          </div>
          <h2 className="font-bold text-headline-md text-on-surface mb-2">College Not Found</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            We couldn&apos;t retrieve details for this university. It may have been relocated or is currently offline.
          </p>
          <Button onClick={() => router.push("/colleges")}>Back to Directory</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeCollege(college.id);
    } else {
      addCollege({
        id: college.id,
        name: college.name,
        city: college.city,
        imageUrl: college.imageUrl,
        category: college.category,
      });
    }
  };

  const handleCourseSort = (field: "fees" | "duration") => {
    if (courseSortBy === field) {
      setCourseSortOrder(courseSortOrder === "asc" ? "desc" : "asc");
    } else {
      setCourseSortBy(field);
      setCourseSortOrder("asc");
    }
  };

  // Sort courses
  const sortedCourses = [...college.courses].sort((a, b) => {
    const multiplier = courseSortOrder === "asc" ? 1 : -1;
    if (courseSortBy === "fees") {
      return (a.fees - b.fees) * multiplier;
    } else {
      return (a.duration - b.duration) * multiplier;
    }
  });

  const formattedFees = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(college.totalFees);

  const defaultImage = "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-canvas-neutral">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-surface-highest flex items-center justify-center">
        {!imageError && college.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center p-8 text-center`}>
            <Building2 className={`w-16 h-16 ${colors.iconColor} mb-3`} />
            <span className={`text-xs uppercase tracking-widest font-bold ${colors.textColor}`}>
              {college.category}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        
        {/* Banner Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-8 z-10 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="custom"
                className={`${typeColorMap[college.type] || "bg-outline-variant-custom text-on-surface-variant"} shadow-sm`}
              >
                {college.type}
              </Badge>
              <Badge
                variant="custom"
                className={`${colors.badgeClass} shadow-sm`}
              >
                {college.category}
              </Badge>
              <Badge variant="neutral" className="bg-white/10 text-white border-none">
                Est. {college.established || "N/A"}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-bold text-display-lg-mobile md:text-headline-lg drop-shadow-md mb-2 leading-tight">
              {college.name}
            </h1>

            {/* Location & Rating */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold drop-shadow-md">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-secondary-container" />
                <span>{college.location}, {college.city}, {college.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star size={16} className="fill-star-gold text-star-gold" />
                  <span className="font-bold ml-1">{college.rating}</span>
                </div>
                <span className="opacity-80 font-normal">| {college.reviews.length} Verified Reviews</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main details body & tab items */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Headers Panel */}
            <div className="bg-white border border-outline-variant-custom/40 rounded-lg p-2 shadow-level1 flex gap-1">
              {[
                { id: "overview", label: "Overview", icon: FileText },
                { id: "courses", label: "Courses", icon: GraduationCap },
                { id: "placements", label: "Placements", icon: Briefcase },
                { id: "reviews", label: "Reviews", icon: Star },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "overview" | "courses" | "placements" | "reviews")}
                    className={`flex-grow md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs md:text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary-container text-white shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                    }`}
                  >
                    <TabIcon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="bg-white border border-outline-variant-custom/40 rounded-lg p-6 shadow-level1 min-h-[300px]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-headline-sm text-on-surface mb-3 border-b border-outline-variant-custom/20 pb-2">
                      About the Institution
                    </h3>
                    <p className="text-on-surface-variant text-body-md leading-relaxed whitespace-pre-line">
                      {college.overview}
                    </p>
                  </div>

                  {/* Quick stats grid */}
                  <div>
                    <h3 className="font-bold text-headline-sm text-on-surface mb-4 border-b border-outline-variant-custom/20 pb-2">
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 text-center">
                        <IndianRupee size={24} className="text-primary-container mx-auto mb-2" />
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          Annual Fees
                        </span>
                        <p className="font-bold text-on-surface text-base mt-0.5">
                          ₹{formattedFees}
                        </p>
                      </div>

                      <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 text-center">
                        <Briefcase size={24} className="text-tertiary mx-auto mb-2" />
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          Avg Package
                        </span>
                        <p className="font-bold text-on-surface text-base mt-0.5">
                          {college.placements ? `${college.placements.avgPackage} LPA` : "N/A"}
                        </p>
                      </div>

                      <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 text-center">
                        <Percent size={24} className="text-primary-container mx-auto mb-2" />
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          Placement Rate
                        </span>
                        <p className="font-bold text-on-surface text-base mt-0.5">
                          {college.placements ? `${college.placements.placementRate}%` : "N/A"}
                        </p>
                      </div>

                      <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 text-center">
                        <GraduationCap size={24} className="text-tertiary mx-auto mb-2" />
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          Courses Offered
                        </span>
                        <p className="font-bold text-on-surface text-base mt-0.5">
                          {college.courses.length} Options
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* General details list */}
                  <div>
                    <h3 className="font-bold text-headline-sm text-on-surface mb-3 border-b border-outline-variant-custom/20 pb-2">
                      Campus Directory Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-on-surface-variant">
                      <div className="flex gap-2">
                        <span className="text-on-surface font-bold min-w-[120px]">City:</span>
                        <span>{college.city}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-on-surface font-bold min-w-[120px]">State:</span>
                        <span>{college.state}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-on-surface font-bold min-w-[120px]">Website:</span>
                        <a
                          href={college.website || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-container hover:underline"
                        >
                          {college.website ? college.website.replace("https://", "") : "N/A"}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-on-surface font-bold min-w-[120px]">Admission Link:</span>
                        <span className="text-primary-container flex items-center gap-0.5">
                          Open Admissions <CheckCircle size={14} className="text-emerald-500 fill-current text-white" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeTab === "courses" && (
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-outline-variant-custom/20 pb-2">
                    <h3 className="font-bold text-headline-sm text-on-surface">
                      Course Programs
                    </h3>
                    <span className="text-xs text-on-surface-variant font-semibold">
                      Click column headers to sort by Fees or Duration
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm font-semibold border-collapse">
                      <thead>
                        <tr className="bg-surface-low border-b border-outline-variant-custom/30 text-on-surface-variant">
                          <th className="p-3 font-bold">Course Name</th>
                          <th
                            className="p-3 font-bold cursor-pointer hover:text-primary-container"
                            onClick={() => handleCourseSort("duration")}
                          >
                            Duration {courseSortBy === "duration" && (courseSortOrder === "asc" ? "▲" : "▼")}
                          </th>
                          <th
                            className="p-3 font-bold cursor-pointer hover:text-primary-container"
                            onClick={() => handleCourseSort("fees")}
                          >
                            Fees/Year {courseSortBy === "fees" && (courseSortOrder === "asc" ? "▲" : "▼")}
                          </th>
                          <th className="p-3 font-bold">Seats Available</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {sortedCourses.map((course) => (
                          <tr key={course.id} className="hover:bg-surface-low/50">
                            <td className="p-3 font-bold text-on-surface">{course.name}</td>
                            <td className="p-3 text-on-surface-variant">{course.duration} Years</td>
                            <td className="p-3 text-on-surface">
                              ₹{new Intl.NumberFormat("en-IN").format(course.fees)}
                            </td>
                            <td className="p-3 text-on-surface-variant">{course.seats || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PLACEMENTS */}
              {activeTab === "placements" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-outline-variant-custom/20 pb-2">
                    <h3 className="font-bold text-headline-sm text-on-surface">
                      Placement Reports ({college.placements?.year || 2025})
                    </h3>
                  </div>

                  {college.placements ? (
                    <>
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 flex flex-col justify-between">
                          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                            Average Package
                          </span>
                          <p className="font-bold text-display-lg-mobile text-primary-container mt-1">
                            {college.placements.avgPackage} <span className="text-sm">LPA</span>
                          </p>
                        </div>

                        <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 flex flex-col justify-between">
                          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                            Highest Package
                          </span>
                          <p className="font-bold text-display-lg-mobile text-tertiary mt-1">
                            {college.placements.highestPackage} <span className="text-sm">LPA</span>
                          </p>
                        </div>

                        <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-4 flex flex-col justify-between">
                          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                            Placement Rate
                          </span>
                          <p className="font-bold text-display-lg-mobile text-primary-container mt-1">
                            {college.placements.placementRate}%
                          </p>
                        </div>
                      </div>

                      {/* Recruiters chips */}
                      <div>
                        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-3">
                          Top Recruiter Groups
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {college.placements.topRecruiters.map((company) => (
                            <span
                              key={company}
                              className="px-3.5 py-2 bg-surface-low border border-outline-variant-custom/30 text-xs font-bold text-on-surface-variant rounded-sm"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-surface-low rounded border border-dashed border-outline-variant-custom/40">
                      <p className="text-on-surface-variant text-sm font-semibold">
                        Detailed placements data is currently not disclosed by the university.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  
                  {/* Reviews Aggregate Grid */}
                  <div className="bg-surface-low border border-outline-variant-custom/30 rounded p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left space-y-2">
                      <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                        Aggregate Rating
                      </span>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="font-bold text-display-lg text-on-surface leading-none">
                          {college.rating.toFixed(1)}
                        </span>
                        <div className="space-y-1">
                          <RatingStars rating={college.rating} showText={false} size={18} />
                          <p className="text-xs text-on-surface-variant font-semibold">
                            Based on {college.reviews.length} responses
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ratings Bar Breakdown */}
                    <div className="w-full md:max-w-xs space-y-1 text-xs font-bold text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">5 Star</span>
                        <div className="flex-grow bg-surface-highest h-2 rounded-full overflow-hidden">
                          <div className="bg-star-gold h-full w-[80%] rounded-full"></div>
                        </div>
                        <span className="w-8">80%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">4 Star</span>
                        <div className="flex-grow bg-surface-highest h-2 rounded-full overflow-hidden">
                          <div className="bg-star-gold h-full w-[15%] rounded-full"></div>
                        </div>
                        <span className="w-8">15%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-right">3 Star</span>
                        <div className="flex-grow bg-surface-highest h-2 rounded-full overflow-hidden">
                          <div className="bg-star-gold h-full w-[5%] rounded-full"></div>
                        </div>
                        <span className="w-8">5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-headline-sm text-on-surface border-b border-outline-variant-custom/20 pb-2">
                      Verified Graduate Feedbacks
                    </h3>

                    {college.reviews.length === 0 ? (
                      <p className="text-xs text-on-surface-variant italic">
                        No reviews have been posted for this university yet.
                      </p>
                    ) : (
                      <div className="space-y-4 divide-y divide-surface-container">
                        {college.reviews.map((review, idx) => (
                          <div key={review.id} className={`pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                            
                            {/* Author Row */}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-on-surface text-sm">{review.authorName}</h4>
                                <p className="text-xs text-on-surface-variant font-semibold">
                                  Class of {review.batch || 2024}
                                </p>
                              </div>
                              <RatingStars rating={review.rating} showText={false} size={14} />
                            </div>

                            {/* Review Content */}
                            <p className="text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed mb-3">
                              &quot;{review.content}&quot;
                            </p>

                            {/* Pros & Cons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-semibold">
                              {review.pros && (
                                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-sm border border-emerald-100">
                                  <span className="font-bold block text-emerald-950 uppercase tracking-wider text-[10px] mb-0.5">Pros:</span>
                                  {review.pros}
                                </div>
                              )}
                              {review.cons && (
                                <div className="bg-rose-50 text-rose-800 p-2.5 rounded-sm border border-rose-100">
                                  <span className="font-bold block text-rose-950 uppercase tracking-wider text-[10px] mb-0.5">Cons:</span>
                                  {review.cons}
                                </div>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Sticky Conversion Panel Sidebar (Right columns on desktop) */}
          <div className="lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-white border border-outline-variant-custom/40 rounded-lg p-5 shadow-level1 space-y-5">
              <div className="text-center pb-4 border-b border-surface-container">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  Admissions Status
                </span>
                <p className="text-emerald-500 font-bold text-sm flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle size={16} className="fill-current text-white text-emerald-500" />
                  Applications Open
                </p>
              </div>

              {/* Stats Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                  <span>Standard Annual Fees</span>
                  <span className="text-on-surface font-bold text-sm">₹{formattedFees}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                  <span>Average Salary Package</span>
                  <span className="text-on-surface font-bold text-sm">
                    {college.placements ? `${college.placements.avgPackage} LPA` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                  <span>NIRF Rating Score</span>
                  <div className="flex items-center gap-1 text-on-surface font-bold text-sm">
                    <Star size={14} className="fill-star-gold text-star-gold" />
                    {college.rating}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                
                {/* Save Toggle */}
                <Button
                  variant={isCollegeSaved ? "secondary" : "primary"}
                  disabled={isMutating}
                  onClick={() => toggleSave(college.id)}
                  className="w-full shadow-sm"
                >
                  {isCollegeSaved ? "Unsave University" : "Save College"}
                </Button>

                {/* Compare toggle */}
                <Button
                  variant="secondary"
                  onClick={handleCompareToggle}
                  className={`w-full ${isInCompare ? "bg-secondary-container/10 border-primary-container text-primary-container" : ""}`}
                >
                  {isInCompare ? "Remove from Compare" : "Compare College"}
                </Button>

              </div>
            </div>

            {/* Quick trust disclaimer */}
            <div className="bg-surface-low border border-outline-variant-custom/30 rounded-lg p-4 text-center">
              <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed">
                VarsityQuest reports placements and fees directly from institutional filings. Ratings are calculated using verified student and alumni reviews.
              </p>
            </div>

          </div>

        </div>

      </main>

      <Footer />
      <ComparisonTray />
    </div>
  );
}

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen justify-between">
        <Navbar />
        <div className="max-w-7xl w-full mx-auto px-4 py-12">
          <div className="h-[300px] w-full bg-surface-container animate-pulse rounded-lg mb-8"></div>
        </div>
        <Footer />
      </div>
    }>
      <CollegeDetailContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
