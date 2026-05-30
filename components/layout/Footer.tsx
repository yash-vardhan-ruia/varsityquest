import React from "react";
import Link from "next/link";
import { GraduationCap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-outline-variant-custom/40 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-container text-white rounded">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-headline-sm tracking-tight text-on-surface">
                Varsity<span className="text-primary-container">Quest</span>
              </span>
            </Link>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              India&apos;s premium College Discovery and Decision-Making Platform. Stripping away advertising clutter to help students make objective, data-driven academic selections.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">
              Explore Categories
            </h5>
            <ul className="space-y-2 text-xs text-on-surface-variant font-medium">
              <li>
                <Link href="/colleges?category=Engineering" className="hover:text-primary-container transition-all">
                  Engineering Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?category=Medical" className="hover:text-primary-container transition-all">
                  Medical Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?category=Management" className="hover:text-primary-container transition-all">
                  Management (MBA)
                </Link>
              </li>
              <li>
                <Link href="/colleges?category=Law" className="hover:text-primary-container transition-all">
                  Law Universities
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h5 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">
              Popular States
            </h5>
            <ul className="space-y-2 text-xs text-on-surface-variant font-medium">
              <li>
                <Link href="/colleges?state=Maharashtra" className="hover:text-primary-container transition-all">
                  Maharashtra Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Karnataka" className="hover:text-primary-container transition-all">
                  Karnataka Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Tamil Nadu" className="hover:text-primary-container transition-all">
                  Tamil Nadu Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Delhi" className="hover:text-primary-container transition-all">
                  Delhi NCR Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Tools */}
          <div>
            <h5 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">
              Tools
            </h5>
            <ul className="space-y-2 text-xs text-on-surface-variant font-medium">
              <li>
                <Link href="/compare" className="hover:text-primary-container transition-all">
                  Compare Colleges Side-by-Side
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-primary-container transition-all">
                  Advanced Filters Search
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary-container transition-all">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-outline-variant-custom/20 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} VarsityQuest. All rights reserved.
          </p>
          <p className="text-xs text-on-surface-variant flex items-center gap-1">
            Built for students with <Heart size={12} className="text-error fill-error" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
