"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Search, ArrowRight, ShieldCheck, BarChart2, Star, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTray from "@/components/college/ComparisonTray";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const categoryBadgeClass: Record<string, string> = {
  Engineering: "bg-teal-50 text-teal-700 border border-teal-200/60",
  Medical: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  Management: "bg-blue-50 text-blue-700 border border-blue-200/60",
  Law: "bg-purple-50 text-purple-700 border border-purple-200/60",
  Arts: "bg-amber-50 text-amber-700 border border-amber-200/60",
  Commerce: "bg-rose-50 text-rose-700 border border-rose-200/60",
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: statsData } = useQuery({
    queryKey: ["homeStats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const stats = statsData?.data || { colleges: 52, streams: 6, states: 9 };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const categories = [
    { name: "Engineering", count: 15, icon: GraduationCap, color: "bg-teal-50 text-teal-700" },
    { name: "Medical", count: 10, icon: ShieldCheck, color: "bg-emerald-50 text-emerald-700" },
    { name: "Management", count: 10, icon: Users, color: "bg-blue-50 text-blue-700" },
    { name: "Law", count: 7, icon: ShieldCheck, color: "bg-purple-50 text-purple-700" },
    { name: "Arts", count: 7, icon: GraduationCap, color: "bg-amber-50 text-amber-700" },
    { name: "Commerce", count: 3, icon: Users, color: "bg-rose-50 text-rose-700" },
  ];

  const features = [
    {
      title: "Data Clarity First",
      description: "We strip away all aggressive advertisement blocks and placement banners to give you 100% objective, verified data.",
      icon: ShieldCheck,
    },
    {
      title: "Side-by-Side Comparison",
      description: "Compare up to 3 colleges simultaneously across metrics like annual fees, average packages, and rating structures.",
      icon: BarChart2,
    },
    {
      title: "Customized Saved Lists",
      description: "Save universities and comparison sessions to your private student dashboard to revisit them during decisions.",
      icon: GraduationCap,
    },
  ];

  const featuredColleges = [
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      slug: "iit-bombay",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.8,
      fees: 220000,
      package: "23 LPA",
      category: "Engineering",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "All India Institute of Medical Sciences (AIIMS) Delhi",
      slug: "aiims-delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.9,
      fees: 1628,
      package: "18 LPA",
      category: "Medical",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Indian Institute of Management (IIM) Ahmedabad",
      slug: "iim-ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      rating: 4.9,
      fees: 1250000,
      package: "34 LPA",
      category: "Management",
      imageUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas-neutral">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-white border-b border-outline-variant-custom/35">
        
        {/* Decorative Grid and Blur Shapes */}
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary-container/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-secondary-container/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Header Tagline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-primary-container text-xs font-bold uppercase tracking-wider rounded-sm">
              <GraduationCap size={14} />
              Objective Admissions Intelligence
            </span>
            <h1 className="font-bold text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-none">
              Find Your Perfect College <span className="text-primary-container">Without the Noise.</span>
            </h1>
            <p className="text-sm md:text-body-lg text-on-surface-variant leading-relaxed">
              Explore 50+ of India&apos;s elite engineering, medical, law, and business schools. Formulate data-driven comparisons across fees, verified ratings, and real-sounding placement metrics.
            </p>
          </div>

          {/* Large Hero Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-4"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search prestigious IITs, Medical colleges, States..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold pl-11 pr-4 py-3 bg-canvas-neutral border border-outline-variant-custom rounded-default shadow-level1 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container"
              />
            </div>
            <Button type="submit" size="lg" className="shadow-sm">
              Search Directory
            </Button>
          </form>

          {/* Database quick stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6 text-center text-xs font-bold text-on-surface-variant">
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary-container">
                {statsData ? stats.colleges : <span className="animate-pulse">--</span>}
              </p>
              <p className="uppercase tracking-wider text-[10px]">Prestigious Colleges</p>
            </div>
            <div className="space-y-1 border-l border-surface-container">
              <p className="text-xl font-bold text-primary-container">
                {statsData ? stats.streams : <span className="animate-pulse">--</span>}
              </p>
              <p className="uppercase tracking-wider text-[10px]">Academic Streams</p>
            </div>
            <div className="space-y-1 border-l border-surface-container">
              <p className="text-xl font-bold text-primary-container">
                {statsData ? stats.states : <span className="animate-pulse">--</span>}
              </p>
              <p className="uppercase tracking-wider text-[10px]">Indian States</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Feature content */}
      <main className="flex-grow py-16 space-y-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stream category list */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-bold text-headline-lg text-on-surface tracking-tight">
              Explore by Academic Stream
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant font-semibold">
              Select a specialized category to find leading institutions mapped to your goals.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/colleges?category=${cat.name}`}
                  className="bg-white border border-outline-variant-custom/40 p-5 rounded-2xl text-center flex flex-col justify-between hover:shadow-level2 hover:-translate-y-0.5 transition-all group shadow-level1"
                >
                  <div className={`p-3 rounded-md w-12 h-12 flex items-center justify-center mx-auto mb-4 ${cat.color} transition-all group-hover:scale-105`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-all">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-bold mt-0.5">
                      {cat.count} Colleges
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Brand Value proposition */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white border border-outline-variant-custom/40 p-8 rounded-2xl shadow-level1 space-y-4"
              >
                <div className="p-2.5 bg-secondary-container text-primary-container rounded-md w-10 h-10 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-headline-sm text-on-surface">
                  {feat.title}
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant font-semibold leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Featured elite colleges */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant-custom/20 pb-4">
            <div>
              <h2 className="font-bold text-headline-lg text-on-surface tracking-tight">
                Featured Elite Institutions
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant font-semibold mt-0.5">
                Explore detailed profiles of India&apos;s absolute top-performing centers of excellence.
              </p>
            </div>
            
            <Link href="/colleges">
              <span className="inline-flex items-center text-xs font-bold text-primary-container hover:text-secondary hover:underline transition-all">
                Browse Full Directory
                <ArrowRight size={14} className="ml-1" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredColleges.map((college) => (
              <div
                key={college.slug}
                className="group bg-white border border-outline-variant-custom/40 rounded-2xl overflow-hidden shadow-level1 hover:shadow-level2 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={college.imageUrl}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      target.parentElement!.classList.add("bg-gradient-to-br", "from-primary-container/20", "to-secondary-container/40");
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="custom"
                      className={categoryBadgeClass[college.category] || "bg-outline-variant-custom text-on-surface-variant"}
                    >
                      {college.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={14} className="fill-star-gold text-star-gold" />
                      <span className="text-xs font-bold text-on-surface">{college.rating}</span>
                      <span className="text-[10px] text-on-surface-variant font-semibold">/ 5.0</span>
                    </div>
                    <Link href={`/colleges/${college.slug}`}>
                      <h3 className="font-bold text-sm md:text-base text-on-surface hover:text-primary-container transition-all line-clamp-2 leading-snug">
                        {college.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="h-px bg-surface-container"></div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Fees/Year</span>
                      <span className="text-on-surface font-bold text-xs">
                        ₹{new Intl.NumberFormat("en-IN").format(college.fees)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Avg Salary</span>
                      <span className="text-on-surface font-bold text-xs">{college.package}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/colleges/${college.slug}`}>
                      <Button variant="secondary" size="sm" className="w-full text-xs">
                        Explore Institution
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <ComparisonTray />
    </div>
  );
}
