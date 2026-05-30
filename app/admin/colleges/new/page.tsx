"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Globe,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

interface CourseEntry {
  name: string;
  duration: number;
  fees: number;
  seats: string;
}

interface PlacementEntry {
  avgPackage: string;
  highestPackage: string;
  placementRate: string;
  topRecruiters: string;
  year: string;
}

const CATEGORIES = ["Engineering", "Medical", "Management", "Law", "Arts", "Commerce"];
const COLLEGE_TYPES = ["GOVERNMENT", "PRIVATE", "DEEMED"];
const STATES = [
  "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "West Bengal",
  "Telangana", "Uttar Pradesh", "Gujarat", "Rajasthan", "Kerala",
  "Madhya Pradesh", "Punjab", "Haryana", "Bihar", "Odisha",
  "Andhra Pradesh", "Jharkhand", "Assam", "Chhattisgarh", "Goa",
];

export default function AddCollegePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlacement, setShowPlacement] = useState(false);

  // Basic info
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [type, setType] = useState("PRIVATE");
  const [totalFees, setTotalFees] = useState("");
  const [established, setEstablished] = useState("");
  const [rating, setRating] = useState("");
  const [overview, setOverview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [website, setWebsite] = useState("");

  // Courses
  const [courses, setCourses] = useState<CourseEntry[]>([
    { name: "", duration: 4, fees: 0, seats: "" },
  ]);

  // Placements
  const [placement, setPlacement] = useState<PlacementEntry>({
    avgPackage: "",
    highestPackage: "",
    placementRate: "",
    topRecruiters: "",
    year: new Date().getFullYear().toString(),
  });

  // Redirect if not logged in
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex flex-col min-h-screen bg-canvas-neutral">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-container" size={32} />
        </div>
        <Footer />
      </div>
    );
  }

  const addCourse = () => {
    setCourses([...courses, { name: "", duration: 4, fees: 0, seats: "" }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof CourseEntry, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image must be smaller than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build payload
      const payload: Record<string, unknown> = {
        name: name.trim(),
        location: location.trim(),
        city: city.trim(),
        state: state.trim(),
        category,
        type,
        totalFees: parseInt(totalFees, 10),
        overview: overview.trim(),
      };

      if (established) payload.established = parseInt(established, 10);
      if (rating) payload.rating = parseFloat(rating);
      if (imageUrl.trim()) payload.imageUrl = imageUrl.trim();
      
      if (website.trim()) {
        let formattedWebsite = website.trim();
        if (!/^https?:\/\//i.test(formattedWebsite)) {
          formattedWebsite = `https://${formattedWebsite}`;
        }
        payload.website = formattedWebsite;
      }

      // Filter out empty courses
      const validCourses = courses.filter((c) => c.name.trim() !== "");
      if (validCourses.length > 0) {
        payload.courses = validCourses.map((c) => ({
          name: c.name.trim(),
          duration: c.duration,
          fees: c.fees,
          ...(c.seats ? { seats: parseInt(c.seats, 10) } : {}),
        }));
      }

      // Placement data
      if (showPlacement && placement.avgPackage) {
        payload.placement = {
          avgPackage: parseInt(placement.avgPackage, 10),
          highestPackage: parseInt(placement.highestPackage, 10) || parseInt(placement.avgPackage, 10),
          placementRate: parseFloat(placement.placementRate) || 0,
          year: parseInt(placement.year, 10) || new Date().getFullYear(),
          ...(placement.topRecruiters.trim()
            ? {
                topRecruiters: placement.topRecruiters
                  .split(",")
                  .map((r) => r.trim())
                  .filter(Boolean),
              }
            : {}),
        };
      }

      const res = await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors = Object.entries(data.details)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join(" | ");
          throw new Error(`Validation failed: ${fieldErrors}`);
        }
        throw new Error(data.error || "Failed to add college");
      }

      toast.success(`${data.data.name} added successfully!`);
      router.push(`/colleges/${data.data.slug}`);
    } catch (error) {
      console.error("Add college error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full text-sm font-medium pl-10 pr-4 py-2.5 bg-white border border-outline-variant-custom rounded-lg shadow-level1 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all";
  const inputClassNoIcon =
    "w-full text-sm font-medium px-4 py-2.5 bg-white border border-outline-variant-custom rounded-lg shadow-level1 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all";
  const labelClass = "block text-xs font-bold text-on-surface-variant mb-1.5";
  const sectionClass =
    "bg-white border border-outline-variant-custom/40 rounded-2xl p-6 md:p-8 shadow-level1 space-y-6";

  return (
    <div className="flex flex-col min-h-screen bg-canvas-neutral">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-container hover:text-secondary transition-all mb-4"
          >
            <ArrowLeft size={14} />
            Back to Colleges
          </Link>
          <h1 className="font-bold text-headline-lg text-on-surface tracking-tight">
            Add a New College
          </h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Fill out the details below to add a new institution to the VarsityQuest directory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Basic Information */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-outline-variant-custom/20 pb-4">
              <div className="p-2 bg-secondary-container text-primary-container rounded-lg">
                <Building2 size={18} />
              </div>
              <h2 className="font-bold text-headline-sm text-on-surface">Basic Information</h2>
            </div>

            {/* College Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                College Name *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology (IIT) Madras"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location / Area *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                  <input
                    id="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Adyar, Chennai"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  className={inputClassNoIcon}
                />
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>
                  State *
                </label>
                <select
                  id="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClassNoIcon}
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClassNoIcon}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className={labelClass}>
                  College Type *
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputClassNoIcon}
                >
                  {COLLEGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fees, Established, Rating */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="totalFees" className={labelClass}>
                  Annual Fees (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                  <input
                    id="totalFees"
                    type="number"
                    required
                    min="0"
                    value={totalFees}
                    onChange={(e) => setTotalFees(e.target.value)}
                    placeholder="e.g. 250000"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="established" className={labelClass}>
                  Year Established
                </label>
                <input
                  id="established"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={established}
                  onChange={(e) => setEstablished(e.target.value)}
                  placeholder="e.g. 1959"
                  className={inputClassNoIcon}
                />
              </div>
              <div>
                <label htmlFor="rating" className={labelClass}>
                  Rating (0 – 5)
                </label>
                <input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={inputClassNoIcon}
                />
              </div>
            </div>

            {/* College Image Upload or Paste URL */}
            <div className="space-y-3 bg-surface-low/30 p-5 rounded-2xl border border-outline-variant-custom/30">
              <label className="block text-xs font-bold text-on-surface-variant">
                College Campus Photo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload File Option */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant-custom/40 rounded-xl p-4 bg-white hover:bg-surface-variant/5 transition-all text-center gap-2 min-h-[120px]">
                  {imageUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant-custom shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="College Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-error hover:bg-error-hover text-white rounded-full p-1 text-[10px] font-bold shadow-md animate-fade-in"
                        aria-label="Remove image"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 animate-fade-in">
                      <GraduationCap className="mx-auto h-7 w-7 text-on-surface-variant mb-2" />
                      <label className="cursor-pointer text-xs font-bold text-primary-container hover:underline block mb-1">
                        Upload Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[9px] text-on-surface-variant font-medium">Max size 1MB (PNG, JPG, WebP)</span>
                    </div>
                  )}
                </div>

                {/* Paste URL Option */}
                <div className="flex flex-col justify-center gap-3">
                  <div className="space-y-1">
                    <label htmlFor="imageUrl" className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                      Or Paste Image URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                      <input
                        id="imageUrl"
                        type="url"
                        value={imageUrl.startsWith("data:") ? "" : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-on-surface-variant font-medium leading-relaxed">
                    Select a local campus photo to upload directly, or paste a link from a photo resource.
                  </p>
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="website" className={labelClass}>
                College Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
                <input
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. www.college.ac.in"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Overview */}
            <div>
              <label htmlFor="overview" className={labelClass}>
                College Overview *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
                <textarea
                  id="overview"
                  required
                  rows={5}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Write a comprehensive overview of the institution, its history, strengths, and notable achievements..."
                  className="w-full text-sm font-medium pl-10 pr-4 py-2.5 bg-white border border-outline-variant-custom rounded-lg shadow-level1 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all resize-none"
                />
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                {overview.length} / 5000 characters (minimum 20)
              </p>
            </div>
          </div>

          {/* SECTION 2: Courses */}
          <div className={sectionClass}>
            <div className="flex items-center justify-between border-b border-outline-variant-custom/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary-container text-primary-container rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <h2 className="font-bold text-headline-sm text-on-surface">Courses Offered</h2>
              </div>
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-container hover:text-secondary transition-all"
              >
                <Plus size={14} />
                Add Course
              </button>
            </div>

            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-surface-low p-4 rounded-xl border border-outline-variant-custom/20"
                >
                  <div className="md:col-span-5">
                    <label className={labelClass}>Course Name</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(index, "name", e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className={inputClassNoIcon}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Duration (yrs)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={course.duration}
                      onChange={(e) => updateCourse(index, "duration", parseInt(e.target.value, 10) || 1)}
                      className={inputClassNoIcon}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Fees / yr (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={course.fees}
                      onChange={(e) => updateCourse(index, "fees", parseInt(e.target.value, 10) || 0)}
                      className={inputClassNoIcon}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Seats</label>
                    <input
                      type="number"
                      min="0"
                      value={course.seats}
                      onChange={(e) => updateCourse(index, "seats", e.target.value)}
                      placeholder="Optional"
                      className={inputClassNoIcon}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    {courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(index)}
                        className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-error-container/20 transition-all"
                        aria-label="Remove course"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Placement Data */}
          <div className={sectionClass}>
            <div className="flex items-center justify-between border-b border-outline-variant-custom/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary-container text-primary-container rounded-lg">
                  <Briefcase size={18} />
                </div>
                <h2 className="font-bold text-headline-sm text-on-surface">Placement Data</h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPlacement}
                  onChange={(e) => setShowPlacement(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant-custom text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
                />
                <span className="text-xs font-bold text-on-surface-variant">
                  Include Placement Data
                </span>
              </label>
            </div>

            {showPlacement && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className={labelClass}>Avg Package (LPA) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={placement.avgPackage}
                    onChange={(e) => setPlacement({ ...placement, avgPackage: e.target.value })}
                    placeholder="e.g. 12"
                    className={inputClassNoIcon}
                  />
                </div>
                <div>
                  <label className={labelClass}>Highest Package (LPA)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={placement.highestPackage}
                    onChange={(e) =>
                      setPlacement({ ...placement, highestPackage: e.target.value })
                    }
                    placeholder="e.g. 65"
                    className={inputClassNoIcon}
                  />
                </div>
                <div>
                  <label className={labelClass}>Placement Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={placement.placementRate}
                    onChange={(e) =>
                      setPlacement({ ...placement, placementRate: e.target.value })
                    }
                    placeholder="e.g. 95.5"
                    className={inputClassNoIcon}
                  />
                </div>
                <div>
                  <label className={labelClass}>Placement Year</label>
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    value={placement.year}
                    onChange={(e) => setPlacement({ ...placement, year: e.target.value })}
                    className={inputClassNoIcon}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Top Recruiters</label>
                  <input
                    type="text"
                    value={placement.topRecruiters}
                    onChange={(e) =>
                      setPlacement({ ...placement, topRecruiters: e.target.value })
                    }
                    placeholder="Google, Microsoft, Amazon, TCS (comma separated)"
                    className={inputClassNoIcon}
                  />
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                    Separate company names with commas
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-outline-variant-custom/40 rounded-2xl p-6 shadow-level1">
            <p className="text-xs text-on-surface-variant font-medium">
              <CheckCircle2 size={14} className="inline mr-1 text-primary-container" />
              All required fields are marked with *. The college will be immediately visible in the directory after submission.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/colleges" className="w-full sm:w-auto">
                <Button type="button" variant="ghost" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
              >
                <Plus size={16} className="mr-1.5" />
                Add College
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
