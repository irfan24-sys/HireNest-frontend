
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Sprout,
  ChevronDown,
} from "lucide-react";

interface EmployerNavbarProps {
  onPreview?: () => void;
  onSaveDraft?: () => void;
  profileImage?: string;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/employer/dashboard",
  },
  {
    name: "Jobs",
    href: "/employer/jobs",
  },
  {
    name: "Candidates",
    href: "/employer/candidates",
  },
  {
    name: "Analytics",
    href: "/employer/analytics",
  },
  {
    name: "Settings",
    href: "/employer/settings",
  },
];

export default function EmployerNavbar({
  onPreview,
  onSaveDraft,
  profileImage,
}: EmployerNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/employer/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* LEFT: LOGO */}
        <Link
          href="/employer/dashboard"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9F8F1] text-[#079568]">
            <Sprout size={21} strokeWidth={2.8} />
          </div>

          <span className="text-[19px] font-bold tracking-tight text-[#172B26]">
            HireNest
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "text-[#079568]"
                    : "text-[#53615C] hover:text-[#079568]"
                }`}
              >
                {item.name}

                {active && (
                  <span className="absolute -bottom-[25px] left-0 h-[2px] w-full rounded-full bg-[#079568]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">

          <button
            type="button"
            onClick={onPreview}
            disabled={!onPreview}
            className="rounded-md bg-[#0A9B70] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#07865F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Preview Live Card
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={!onSaveDraft}
            className="rounded-md bg-[#EAF5F1] px-4 py-2.5 text-[12px] font-semibold text-[#315C4E] transition hover:bg-[#DDEFE7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save Draft
          </button>

          {/* PROFILE IMAGE */}
          <Link
            href="/employer/profile"
            aria-label="Employer profile"
            className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Employer profile"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-[#315C4E]">
                E
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg lg:hidden">

          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#EAF7F1] text-[#079568]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onPreview?.();
              }}
              disabled={!onPreview}
              className="rounded-md bg-[#0A9B70] px-3 py-3 text-xs font-semibold text-white disabled:opacity-60"
            >
              Preview Live Card
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSaveDraft?.();
              }}
              disabled={!onSaveDraft}
              className="rounded-md bg-[#EAF5F1] px-3 py-3 text-xs font-semibold text-[#315C4E] disabled:opacity-60"
            >
              Save Draft
            </button>
          </div>

          <Link
            href="/employer/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Employer profile"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-semibold text-[#315C4E]">E</span>
              )}
            </div>

            <span className="text-sm font-medium text-gray-700">
              Employer Profile
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
