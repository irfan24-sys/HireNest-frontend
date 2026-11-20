
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-4 text-[10px] text-gray-500 sm:flex-row md:px-10">

        <p>© 2026 HireNest Inc. All rights reserved.</p>

        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-[#07875f]">
            Privacy Policy
          </Link>

          <Link href="/terms" className="hover:text-[#07875f]">
            Terms of Service
          </Link>

          <Link href="/security" className="hover:text-[#07875f]">
            Security
          </Link>
        </div>

      </div>
    </footer>
  );
}
