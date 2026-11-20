
import Link from "next/link";
import {
  BriefcaseBusiness,
  User,
} from "lucide-react";

interface NavbarProps {
  activePortal?: "seeker" | "employer";
}

export default function Navbar({
  activePortal = "seeker",
}: NavbarProps) {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#07875f] text-white">
            <BriefcaseBusiness size={19} />
          </div>

          <span className="text-lg font-extrabold tracking-tight text-[#20313a]">
            HireNest
          </span>
        </Link>

        {/* PORTAL NAVIGATION */}
        <nav className="hidden items-center gap-1 rounded-full bg-[#f0f3f9] p-1 sm:flex">

          <Link
            href="/register"
            className={`rounded-full px-4 py-2 text-[10px] font-medium transition ${
              activePortal === "seeker"
                ? "bg-white font-semibold text-gray-700 shadow-sm"
                : "text-gray-500 hover:text-[#07875f]"
            }`}
          >
            Job Seeker Portal
          </Link>

          <Link
            href="/employer/register"
            className={`rounded-full px-4 py-2 text-[10px] font-medium transition ${
              activePortal === "employer"
                ? "bg-white font-semibold text-gray-700 shadow-sm"
                : "text-gray-500 hover:text-[#07875f]"
            }`}
          >
            Employer / Recruiter Portal
          </Link>

        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          <Link
            href="/support"
            className="hidden text-[10px] font-semibold text-gray-600 transition hover:text-[#07875f] sm:block"
          >
            Help & Support
          </Link>

          <Link
            href="/login"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#07875f] text-white transition hover:bg-[#066d4d]"
            aria-label="Login"
          >
            <User size={15} />
          </Link>

        </div>
      </div>
    </header>
  );
}
