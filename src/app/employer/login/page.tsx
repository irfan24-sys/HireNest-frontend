
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  employerLogin,
  clearAuthError,
} from "../../../redux/features/auth/authSlice";

import {
  employerLoginSchema,
  type EmployerLoginData,
} from "../../../validations/authValidation";

import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

import {
  BriefcaseBusiness,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  Heart,
  SlidersHorizontal,
} from "lucide-react";

export default function EmployerLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get loading and error states from Redux
  const loading = useSelector(
    (state: RootState) => state.auth.loading
  );

  const reduxError = useSelector(
    (state: RootState) => state.auth.error
  );

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("error");

  // React Hook Form + Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployerLoginData>({
    resolver: yupResolver(employerLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login submission using Redux
  const onSubmit = async (data: EmployerLoginData) => {
    setMessage("");
    dispatch(clearAuthError());

    try {
      // Dispatch employer login action
      const result = await dispatch(
        employerLogin({
          email: data.email,
          password: data.password,
          rememberMe,
        })
      ).unwrap();

      setMessage(
        result.message || "Login successful! Redirecting..."
      );

      setMessageType("success");

      // Redirect to employer dashboard
      window.setTimeout(() => {
        router.push("/employer/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : "Invalid email or password. Please try again."
      );

      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#263746]">
      {/* REUSABLE NAVBAR */}
      <Navbar activePortal="employer" />

      {/* MAIN CONTENT */}
      <main className="grid min-h-[calc(100vh-108px)] grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE: LOGIN FORM */}
        <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[430px]">

            {/* Portal label */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-[#e3f2ef] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#176b67]">
                <span className="h-2 w-2 rounded-full bg-[#087c5b]" />
                Recruiter &amp; Employer Portal
              </span>

              <a
                href="/login"
                className="rounded-full bg-[#edf2fa] px-3 py-1.5 text-[9px] font-semibold text-gray-600 transition hover:bg-[#dce7f7]"
              >
                Job Seeker?{" "}
                <span className="text-[#087c5b]">
                  Candidate Portal →
                </span>
              </a>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#202e3a]">
              Welcome Back, Recruiter
            </h1>

            <p className="mt-2 max-w-[390px] text-xs leading-5 text-gray-500">
              Sign in to manage your active requisitions, review qualified
              applicants, and coordinate interviews with top-tier talent.
            </p>

            {/* Google Login */}
            <button
              type="button"
              onClick={() =>
                alert("Google login requires OAuth configuration.")
              }
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#edf3fc] text-[11px] font-semibold text-gray-700 transition hover:bg-[#e1eaf8]"
            >
              <span className="text-base font-bold text-blue-600">
                G
              </span>
              Google Workspace
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                Or sign in with work email
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold text-[#263746]"
                >
                  Work Email Address
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
                    placeholder="alex.rivera@acme-corp.com"
                    className={`h-11 w-full rounded-lg border bg-[#edf3fc] pl-10 pr-3 text-xs text-[#263746] outline-none transition placeholder:text-gray-400 focus:border-[#0ca678] focus:bg-white ${
                      errors.email
                        ? "border-red-400"
                        : "border-transparent"
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
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-semibold text-[#263746]"
                  >
                    Password
                  </label>

                  <a
                    href="/employer/forgot-password"
                    className="text-[10px] font-semibold text-[#087c5b] hover:underline"
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
                    className={`h-11 w-full rounded-lg border bg-[#edf3fc] pl-10 pr-11 text-xs text-[#263746] outline-none transition placeholder:text-gray-400 focus:border-[#0ca678] focus:bg-white ${
                      errors.password
                        ? "border-red-400"
                        : "border-transparent"
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
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-3.5 w-3.5 accent-[#087c5b]"
                />

                <label
                  htmlFor="rememberMe"
                  className="text-[10px] text-gray-500"
                >
                  Remember this workstation for 30 days
                </label>
              </div>

              {/* API success/error message */}
              {(message || reduxError) && (
                <div
                  role="alert"
                  className={`rounded-lg px-3 py-2 text-xs ${
                    messageType === "success" && message
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message || reduxError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#007b55] text-xs font-bold text-white shadow-md transition hover:bg-[#006847] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Access Employer Dashboard"}

                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Create Account */}
            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-[#f0f4fb] p-3">
              <div>
                <p className="text-[10px] font-bold text-[#263746]">
                  New organization on HireNest?
                </p>

                <p className="mt-1 text-[9px] text-gray-500">
                  Publish roles to verified specialists.
                </p>
              </div>

              <a
                href="/employer/register"
                className="shrink-0 rounded-md bg-white px-4 py-2.5 text-[9px] font-bold text-[#087c5b] shadow-sm transition hover:bg-[#e7f4ef]"
              >
                Create Account
              </a>
            </div>

            {/* Security information */}
            <div className="mt-20 flex items-center justify-center gap-2 text-center text-[8px] font-semibold uppercase tracking-wide text-gray-500">
              <ShieldCheck
                size={13}
                className="text-[#087c5b]"
              />

              Enterprise SOC-2 Type II Certified • ISO 27001 Compliant • 256-Bit TLS
            </div>

          </div>
        </section>

        {/* RIGHT SIDE: EMPLOYER DASHBOARD VISUAL */}
        <section className="relative hidden min-h-[700px] overflow-hidden bg-[#245f5b] px-8 py-10 text-white lg:block xl:px-12">

          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative mx-auto max-w-[500px]">

            {/* Panel heading */}
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <BriefcaseBusiness size={17} />
                </div>

                <div>
                  <h2 className="text-[11px] font-bold">
                    Talent Intelligence Hub
                  </h2>

                  <p className="text-[9px] text-emerald-100/70">
                    Real-time Acquisition Insights
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[8px] font-bold text-emerald-200">
                ● ATS Live Sync: Active
              </span>
            </div>

            {/* Dashboard image */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                alt="Modern corporate office workspace"
                className="h-[250px] w-full object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#123d3b]/90 via-[#123d3b]/10 to-transparent" />

              {/* Match rate overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-lg border border-white/10 bg-[#e9ffff]/20 p-3 backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-emerald-300 text-[10px] font-extrabold text-emerald-200">
                  98%
                </div>

                <div className="flex-1">
                  <h3 className="text-[10px] font-bold">
                    Executive Role Match Rate
                  </h3>

                  <p className="mt-1 text-[9px] text-emerald-100/80">
                    Automated skills benchmarking
                  </p>
                </div>

                <SlidersHorizontal
                  size={16}
                  className="text-emerald-200"
                />
              </div>
            </div>

            {/* Dashboard statistics */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-emerald-100">
                  <span className="text-[8px] font-bold uppercase">
                    Hiring Velocity
                  </span>

                  <Zap size={13} />
                </div>

                <h3 className="mt-2 text-2xl font-extrabold">
                  4.2x
                </h3>

                <p className="mt-1 text-[8px] text-emerald-100/70">
                  Faster AI screening
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-emerald-100">
                  <span className="text-[8px] font-bold uppercase">
                    Pipeline
                  </span>

                  <Users size={13} />
                </div>

                <h3 className="mt-2 text-2xl font-extrabold">
                  428
                </h3>

                <p className="mt-1 text-[8px] text-emerald-100/70">
                  Inbound apps today
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between text-emerald-100">
                  <span className="text-[8px] font-bold uppercase">
                    Acceptance
                  </span>

                  <Heart size={13} />
                </div>

                <h3 className="mt-2 text-2xl font-extrabold">
                  94%
                </h3>

                <p className="mt-1 text-[8px] text-emerald-100/70">
                  Offer close rate
                </p>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="mt-16 rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex gap-1 text-yellow-300">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>

              <p className="mt-3 text-xs italic leading-5 text-emerald-50">
                "HireNest transformed our outreach hiring pipeline.
                We reduced time-to-hire while finding strong engineering
                talent in record time."
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b4ece7] text-[10px] font-extrabold text-[#245f5b]">
                  MV
                </div>

                <div>
                  <h4 className="text-[10px] font-bold">
                    Marcus Vance
                  </h4>

                  <p className="text-[9px] text-emerald-100/70">
                    Head of People at Linear Dynamics
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* REUSABLE FOOTER */}
      <Footer />
    </div>
  );
}
