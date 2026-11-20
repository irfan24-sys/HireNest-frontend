
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  seekerLoginSchema,
  type SeekerLoginData,
} from "../../validations/authValidation";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import type { RootState, AppDispatch } from "../../redux/store";
import {
  loginUser,
  clearAuthError,
} from "../../redux/features/auth/authSlice";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Bell,
  ShieldCheck,
  Zap,
  BriefcaseBusiness,
  Star,
} from "lucide-react";

export default function LoginPage() {
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // React Hook Form + Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeekerLoginData>({
    resolver: yupResolver(seekerLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Google login placeholder
  const handleSocialLogin = (provider: string) => {
    alert(
      `${provider} login is not configured yet. Please sign in using your email.`
    );
  };

  // Clear previous Redux error
  const handleInputChange = () => {
    if (error) {
      dispatch(clearAuthError());
    }

    if (message) {
      setMessage("");
    }
  };

  // Redux Login
  const onSubmit = async (data: SeekerLoginData) => {
    setMessage("");

    dispatch(clearAuthError());

    try {
      const result = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
         
        })
      ).unwrap();

      setMessage(result.message || "Login successful!");

      // Redirect based on user role
      if (result.user?.role === "employer") {
        router.push("/employer/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#263746]">

      {/* REUSABLE NAVBAR */}
      <Navbar activePortal="seeker" />

      {/* MAIN CONTENT */}
      <main className="mx-auto grid min-h-[calc(100vh-125px)] max-w-[1440px] grid-cols-1 items-center gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1.35fr_0.95fr] lg:gap-8 lg:px-10 lg:py-10">

        {/* LEFT: LOGIN FORM */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">

          {/* Heading */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-[#07875f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#07875f]" />
              JOB SEEKER PORTAL
            </span>

            <p className="text-[10px] text-gray-500">
              Hiring talent?{" "}
              <a
                href="/employer/login"
                className="font-semibold text-[#07875f] hover:underline"
              >
                Employer Login →
              </a>
            </p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#202e3a] sm:text-3xl">
            Welcome Back to{" "}
            <span className="text-[#07875f]">HireNest</span>
          </h1>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Sign in to access your saved jobs, track application statuses,
            and discover real-time AI-matched career opportunities.
          </p>

          {/* Google Login */}
          <div className="mt-5 grid grid-cols-1">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#edf2fa] text-xs font-semibold text-gray-700 transition hover:bg-[#e3ebf8]"
            >
              <span className="text-base font-bold text-blue-600">
                G
              </span>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Or continue with email
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleInputChange}
            className="space-y-4"
            noValidate
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[11px] font-semibold text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="e.g. sarah.jenkins@example.com"
                  className={`h-11 w-full rounded-md border bg-white pl-10 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:ring-2 focus:ring-emerald-50 ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold text-gray-700"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-[10px] font-semibold text-[#07875f] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`h-11 w-full rounded-md border bg-white pl-10 pr-11 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:ring-2 focus:ring-emerald-50 ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-3.5 w-3.5 cursor-pointer accent-[#07875f]"
              />

              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-[10px] text-gray-500"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Redux API Message */}
            {(error || message) && (
              <div
                role="alert"
                className={`rounded-md px-3 py-2.5 text-xs ${
                  error
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {error || message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#006b4c] text-xs font-bold text-white shadow-sm transition hover:bg-[#00583e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In to HireNest"}

              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-5 border-t border-gray-100 pt-4 text-center">
            <p className="text-[10px] text-gray-500">
              Don&apos;t have a job seeker account?{" "}
              <a
                href="/register"
                className="font-bold text-[#07875f] hover:underline"
              >
                Create Job Seeker Account
              </a>
            </p>
          </div>

          {/* Security Information */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[9px] text-gray-500">

            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#07875f]" />
              256-bit SSL Encrypted
            </span>

            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#07875f]" />
              GDPR &amp; Privacy Compliant
            </span>

            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#07875f]" />
              SOC2 Type II Certified
            </span>

          </div>
        </section>

        {/* RIGHT: PROMOTIONAL PANEL */}
        <aside className="flex flex-col gap-4 rounded-xl bg-gradient-to-br from-[#eaf7f2] to-[#e8effb] p-4 sm:p-5">

          {/* Application Status Card */}
          <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">

            <div className="flex items-start justify-between gap-2">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-[#07875f]">
                  <Bell size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase text-gray-500">
                    Application Status
                  </p>

                  <h3 className="mt-1 text-[11px] font-bold text-gray-800">
                    Shortlisted for Senior Product Designer
                  </h3>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <div className="ml-11 mt-1 flex items-center gap-1 text-[9px] text-gray-500">
              <BriefcaseBusiness size={11} />
              Figma · San Francisco, CA (Hybrid)
            </div>
          </div>

          {/* Hero Image */}
          <div className="group relative h-[240px] overflow-hidden rounded-lg shadow-md sm:h-[300px]">

            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
              alt="Modern professional workspace"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102e2a]/60 via-transparent to-transparent" />

            {/* Match Card */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg bg-white p-3 shadow-lg">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-[#07875f]">
                  <Zap size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-500">
                    INSTANT AI MATCH
                  </p>

                  <h3 className="text-lg font-extrabold text-[#07875f]">
                    98.4%
                  </h3>
                </div>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-2 text-[9px] font-bold text-emerald-700">
                14 New Matches
              </span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-2">

              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    fill="currentColor"
                  />
                ))}
              </div>

              <span className="text-[9px] font-bold text-gray-700">
                4.9 / 5
              </span>

              <span className="text-[9px] font-semibold text-gray-500">
                480k+ hires placed
              </span>
            </div>

            <p className="mt-3 text-[10px] italic leading-5 text-gray-500">
              "HireNest helped me land my dream role within 22 days.
              The split-screen job search and instant apply made all the
              difference."
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#07875f]">
                  ER
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-700">
                    Elena Rostova
                  </p>

                  <p className="text-[8px] text-gray-400">
                    Verified Candidate
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-semibold text-gray-500">
                Product Designer @ Stripe
              </span>
            </div>
          </div>
        </aside>
      </main>

      {/* REUSABLE FOOTER */}
      <Footer />
    </div>
  );
}
