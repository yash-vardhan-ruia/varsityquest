"use client";

import React, { useEffect, useState, ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, ArrowRightLeft, Mail, ExternalLink, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComparisonTray from "@/components/college/ComparisonTray";
import CollegeCard from "@/components/college/CollegeCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import Button from "@/components/ui/Button";

interface SavedComparisonItem {
  id: string;
  label: string | null;
  collegeIds: string[];
  createdAt: string;
  colleges: {
    id: string;
    name: string;
    city: string;
    imageUrl: string | null;
  }[];
}

function getShortName(fullName: string): string {
  const parenMatch = fullName.match(/\(([^)]+)\)\s*(.*)/i);
  if (parenMatch) {
    const acronym = parenMatch[1];
    const location = parenMatch[2];
    if (acronym && location) {
      return `${acronym} ${location.trim()}`;
    }
    if (acronym) {
      return acronym;
    }
  }

  let name = fullName;
  name = name.replace(/Indian Institute of Technology/gi, "IIT");
  name = name.replace(/Indian Institute of Management/gi, "IIM");
  name = name.replace(/Vellore Institute of Technology/gi, "VIT");
  name = name.replace(/Birla Institute of Technology and Science/gi, "BITS");
  name = name.replace(/All India Institute of Medical Sciences/gi, "AIIMS");
  name = name.replace(/National Institute of Technology/gi, "NIT");
  
  return name.trim();
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security & Password States
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const closeSettings = () => {
    setIsEditProfileOpen(false);
    setActiveTab("profile");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (session?.user) {
      setProfileName(session.user.name || "");
      setProfileImage(session.user.image || "");
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image must be smaller than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          image: profileImage,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update profile");

      // Trigger session update
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileName,
          image: profileImage,
        },
      });

      toast.success("Profile updated successfully!");
      closeSettings();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update password");

      toast.success(json.message || "Password updated successfully!");
      closeSettings();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Custom hook for saved colleges (TanStack Query integrated)
  const { savedColleges, isLoading: isCollegesLoading } = useSavedColleges();

  // Fetch saved comparisons
  const { data: comparisonsResponse, isLoading: isComparisonsLoading, refetch: refetchComparisons } = useQuery<{
    success: boolean;
    data: SavedComparisonItem[];
  }>({
    queryKey: ["savedComparisons"],
    queryFn: async () => {
      const res = await fetch("/api/saved/comparisons");
      if (!res.ok) throw new Error("Failed to fetch comparisons");
      return res.json();
    },
    enabled: !!session?.user?.id,
  });

  const savedComparisons = comparisonsResponse?.data || [];

  const handleDeleteComparison = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/saved/comparisons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete comparison");
      }
      toast.success("Comparison deleted successfully!");
      refetchComparisons();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsDeleting(null);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-canvas-neutral">
        <Navbar />
        <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-12 space-y-6">
          <div className="h-10 w-48 bg-surface-container animate-pulse rounded"></div>
          <div className="h-48 w-full bg-surface-container animate-pulse rounded-lg"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null; // will be handled by useEffect redirect
  }

  return (
    <div className="flex flex-col min-h-screen bg-canvas-neutral">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Dashboard Profile Welcome Block */}
        <div className="bg-white border border-outline-variant-custom/40 rounded-lg p-6 shadow-level1 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
              {session.user?.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={session.user.image}
                  alt={session.user.name || "Student Avatar"}
                  className="h-16 w-16 rounded-full border border-outline-variant-custom object-cover shadow-sm group-hover:opacity-85 transition-all"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-secondary-container text-primary-container flex items-center justify-center font-bold text-2xl shadow-sm border border-outline-variant-custom/20 group-hover:bg-secondary-container/80 transition-all">
                  {session.user?.name?.charAt(0).toUpperCase() || "S"}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all text-white text-[10px] font-bold">
                Edit
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  Student Profile
                </span>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-[10px] text-primary-container hover:underline font-bold"
                >
                  Edit Profile
                </button>
              </div>
              <h1 className="font-bold text-headline-md text-on-surface tracking-tight mt-0.5">
                Welcome back, {session.user?.name}!
              </h1>
              <p className="text-xs text-on-surface-variant font-semibold flex items-center gap-1 mt-0.5">
                <Mail size={12} />
                {session.user?.email}
              </p>
            </div>
          </div>
          
          {/* Quick Stats overview */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-surface-low border border-outline-variant-custom/20 rounded px-5 py-3 text-center flex-grow md:flex-grow-0 min-w-[120px]">
              <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                Saved Colleges
              </span>
              <p className="font-bold text-headline-md text-primary-container mt-0.5">
                {savedColleges.length}
              </p>
            </div>
            <div className="bg-surface-low border border-outline-variant-custom/20 rounded px-5 py-3 text-center flex-grow md:flex-grow-0 min-w-[120px]">
              <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                Saved Sessions
              </span>
              <p className="font-bold text-headline-md text-tertiary mt-0.5">
                {savedComparisons.length}
              </p>
            </div>
          </div>
        </div>

        {/* Content sections split */}
        <div className="space-y-12">
          
          {/* SECTION 1: SAVED COLLEGES */}
          <div id="saved-colleges">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant-custom/20 pb-2">
              <h2 className="font-bold text-headline-md text-on-surface flex items-center gap-2">
                <Bookmark className="text-primary-container" />
                Bookmarked Colleges
              </h2>
              <span className="text-xs text-on-surface-variant font-semibold">
                Click hearts to remove bookmarks
              </span>
            </div>

            {isCollegesLoading ? (
              <SkeletonGrid count={3} />
            ) : savedColleges.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-outline-variant-custom/40 shadow-level1 max-w-md mx-auto">
                <Bookmark size={40} className="text-on-surface-variant mx-auto mb-3 stroke-[1.5]" />
                <h4 className="font-bold text-on-surface text-sm mb-1">No Bookmarked Colleges</h4>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                  Browse universities in our main search list and save them to build your customized bookmark list.
                </p>
                <Button onClick={() => router.push("/colleges")}>Browse Colleges</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {savedColleges.map((college) => (
                  <CollegeCard key={college.id} college={college as ComponentProps<typeof CollegeCard>["college"]} />
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: SAVED COMPARISONS */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant-custom/20 pb-2">
              <h2 className="font-bold text-headline-md text-on-surface flex items-center gap-2">
                <ArrowRightLeft className="text-primary-container" />
                Saved Comparison Sessions
              </h2>
            </div>

            {isComparisonsLoading ? (
              <div className="space-y-4">
                <div className="h-16 w-full bg-surface-container animate-pulse rounded"></div>
                <div className="h-16 w-full bg-surface-container animate-pulse rounded"></div>
              </div>
            ) : savedComparisons.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-outline-variant-custom/40 shadow-level1 max-w-md mx-auto">
                <ArrowRightLeft size={40} className="text-on-surface-variant mx-auto mb-3 stroke-[1.5]" />
                <h4 className="font-bold text-on-surface text-sm mb-1">No Saved Comparisons</h4>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                  Queue 2 or 3 colleges using the bottom compare tray and save your comparison boards to revisit details.
                </p>
                <Button onClick={() => router.push("/colleges")}>Start a Comparison</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                {savedComparisons.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-outline-variant-custom/40 rounded-lg p-5 shadow-level1 flex flex-col justify-between hover:shadow-level2 transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h4 className="font-bold text-on-surface text-sm line-clamp-1 leading-tight">
                          {item.label || "Comparison Session"}
                        </h4>
                        <span className="text-[10px] text-on-surface-variant font-semibold shrink-0">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* College items list chips */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.colleges.map((college) => (
                          <div
                            key={college.id}
                            className="inline-flex items-center gap-1.5 bg-surface-low border border-outline-variant-custom/20 px-2.5 py-1 rounded-sm text-xs font-semibold text-on-surface-variant"
                          >
                            {college.imageUrl && (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={college.imageUrl}
                                  alt={college.name}
                                  className="w-5 h-5 object-cover rounded-full"
                                />
                              </>
                            )}
                            <span className="truncate max-w-[120px]">{getShortName(college.name)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-surface-container">
                      <button
                        disabled={isDeleting === item.id}
                        onClick={() => handleDeleteComparison(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-error transition-all disabled:opacity-50 cursor-pointer"
                        aria-label="Delete comparison"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/compare?ids=${item.collegeIds.join(",")}`)}
                        className="flex items-center gap-1"
                      >
                        Re-open Comparison
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Account Settings Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-outline-variant-custom/40 rounded-2xl shadow-level3 max-w-md w-full overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-surface-container pb-3">
              <h3 className="font-bold text-headline-sm text-on-surface">Account Settings</h3>
              <button
                onClick={closeSettings}
                className="text-on-surface-variant hover:text-on-surface font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-surface-container text-xs font-bold gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`pb-2 text-center border-b-2 transition-all ${
                  activeTab === "profile"
                    ? "border-primary-container text-primary-container"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`pb-2 text-center border-b-2 transition-all ${
                  activeTab === "security"
                    ? "border-primary-container text-primary-container"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Security & Password
              </button>
            </div>

            {activeTab === "profile" ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
                {/* Avatar Preview & Upload */}
                <div className="flex flex-col items-center gap-3 bg-surface-low p-4 rounded-lg border border-outline-variant-custom/20">
                  <div className="relative">
                    {profileImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profileImage}
                        alt="Avatar Preview"
                        className="h-20 w-20 rounded-full border border-outline-variant-custom object-cover shadow-md"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-secondary-container text-primary-container flex items-center justify-center font-bold text-3xl shadow-md border border-outline-variant-custom/20">
                        {profileName?.charAt(0).toUpperCase() || "S"}
                      </div>
                    )}
                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => setProfileImage("")}
                        className="absolute -top-1 -right-1 bg-error text-white rounded-full p-1 text-[8px] hover:bg-error-hover leading-none shadow-sm"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <label className="cursor-pointer text-xs font-bold text-primary-container hover:underline">
                      Upload Profile Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-on-surface-variant font-medium">Max size 1MB (PNG, JPG)</span>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1">
                  <label htmlFor="profileName" className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="profileName"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white border border-outline-variant-custom rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>

                {/* Image URL Input (Fallback/Alternative) */}
                <div className="space-y-1">
                  <label htmlFor="profileImageUrl" className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                    Or Paste Image URL
                  </label>
                  <input
                    type="url"
                    id="profileImageUrl"
                    placeholder="https://example.com/avatar.jpg"
                    value={profileImage.startsWith("data:") ? "" : profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="w-full bg-white border border-outline-variant-custom rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-container">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeSettings}
                    disabled={isUpdatingProfile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isUpdatingProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-semibold">
                <div className="p-3 bg-surface-variant/20 rounded-lg border border-outline-variant-custom/10 text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  <span className="font-bold text-primary-container block mb-1">🔐 Password Credentials Settings</span>
                  Update or set your password. If you registered using Google, you can leave Current Password empty to set a credentials password for the first time.
                </div>

                {/* Current Password */}
                <div className="space-y-1">
                  <label htmlFor="currentPassword" className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-outline-variant-custom rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-outline-variant-custom rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-outline-variant-custom rounded p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-container">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeSettings}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isChangingPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <ComparisonTray />
    </div>
  );
}
