"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, LayoutDashboard, Bookmark, LogOut, Menu, X, Plus } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Colleges", href: "/colleges" },
    { label: "Compare", href: "/compare" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-outline-variant-custom/40 shadow-level1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary-container text-white rounded-md">
                <GraduationCap size={22} />
              </div>
              <span className="font-bold text-headline-md tracking-tight text-on-surface">
                Varsity<span className="text-primary-container">Quest</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-all-custom ${
                      isActive
                        ? "text-primary-container font-bold border-b-2 border-primary-container py-5"
                        : "text-on-surface-variant hover:text-on-surface py-5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Session Actions / Auth triggers */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="h-8 w-8 bg-surface-container animate-pulse rounded-full"></div>
            ) : session ? (
              // Authenticated dropdown
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 p-1 rounded-full transition-all"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  {session.user?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="h-8 w-8 rounded-full border border-outline-variant-custom object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-secondary-container text-primary-container flex items-center justify-center font-bold text-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-on-surface hidden lg:inline">
                    {session.user?.name}
                  </span>
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 rounded bg-white shadow-level3 border border-outline-variant-custom/40 py-1 z-20 transition-all">
                      <div className="px-4 py-2 border-b border-outline-variant-custom/40">
                        <p className="text-xs text-on-surface-variant">Signed in as</p>
                        <p className="text-sm font-bold text-on-surface truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard#saved-colleges"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                      >
                        <Bookmark size={16} />
                        Saved Colleges
                      </Link>

                      <Link
                        href="/admin/colleges/new"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-container hover:bg-secondary-container/20 transition-all font-semibold"
                      >
                        <Plus size={16} />
                        Add College
                      </Link>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-all border-t border-outline-variant-custom/20"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Unauthenticated actions
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-on-surface-variant hover:text-on-surface focus:outline-none p-1 rounded-md transition-all"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-outline-variant-custom/40 py-2 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-secondary-container text-primary-container"
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="h-px bg-surface-container my-2"></div>
          
          {session ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5">
                <p className="text-xs text-on-surface-variant">Signed in as</p>
                <p className="text-sm font-bold text-on-surface truncate">
                  {session.user?.email}
                </p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold text-on-surface-variant hover:bg-surface-low hover:text-on-surface transition-all"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded text-sm font-semibold text-error hover:bg-error-container/20 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
              <Link
                href="/admin/colleges/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold text-primary-container hover:bg-secondary-container/20 transition-all"
              >
                <Plus size={16} />
                Add College
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
