
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../redux/store";
import {
  registerUser,
  clearAuthError,
} from "../../redux/features/auth/authSlice";

import {
  seekerRegisterSchema,
  type SeekerRegisterData,
} from "../../validations/authValidation";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  BrainCircuit,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Free 1-Click Apply",
    description:
      "Save your resume and instantly apply to thousands of verified tech and design jobs without redundant forms.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: BrainCircuit,
    title: "AI Resume Scanner",
    description:
      "Instant role compatibility scoring and keyword recommendations before you submit.",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    description:
      "Track every application from screening to offer letter with live recruiter notifications.",
    color: "bg-teal-100 text-teal-700",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "error"
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SeekerRegisterData>({
    resolver: yupResolver(seekerRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      
    },
  });

  // Watch password for strength indicator
  const password = watch("password") || "";

  const passwordChecks = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "1 number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Special symbol",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordStrength = passwordChecks.filter(
    (check) => check.valid
  ).length;

  // Google signup placeholder
  const handleSocialSignup = (provider: string) => {
    alert(
      `${provider} signup is not configured yet. Please register using your email.`
    );
  };

  // Redux registration
  const onSubmit = async (data: SeekerRegisterData) => {
    setMessage("");
    dispatch(clearAuthError());

    try {
      setLoading(true);

      // Remove the terms field because it is only for frontend validation.
      // The backend expects name, email, phone, password and confirmPassword.
      // Non-null assertions are safe because the form resolver validates all fields before submission.
      const registrationData = {
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        password: data.password!,
        confirmPassword: data.confirmPassword!,
      };

      const result = await dispatch(
        registerUser(registrationData)
      ).unwrap();

      setMessage(
        result.message || "Your account has been created successfully!"
      );
      setMessageType("success");

      reset();

      // Redirect to login after successful registration
      window.setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : "Registration failed. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#202b38]">
      {/* NAVBAR */}
      <Navbar activePortal="seeker" />

      {/* MAIN CONTENT */}
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-7 md:px-8 lg:grid-cols-[1.35fr_0.95fr] lg:gap-7 lg:px-10 lg:py-9">
        {/* LEFT: REGISTRATION FORM */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          {/* Form heading */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#07875f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#07875f]" />
              Candidate Registration
            </span>

            <a
              href="/employer/register"
              className="text-[11px] font-medium text-[#07875f] hover:underline"
            >
              Looking to hire? Create Employer Account
              <ArrowRight className="ml-1 inline" size={12} />
            </a>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-[#1e2935] sm:text-3xl">
              Create Your Job Seeker Account
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Join over 480,000+ professionals discovering career-defining
              opportunities and 1-click apply.
            </p>
          </div>

          {/* Social signup */}
          <div className="mb-5 grid grid-cols-1">
            <button
              type="button"
              onClick={() => handleSocialSignup("Google")}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#edf3fc] text-xs font-semibold text-gray-700 transition hover:bg-[#e3ebf9]"
            >
              <span className="text-base font-bold text-blue-600">G</span>
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Or register with your email
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* REGISTRATION FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  type="text"
                  placeholder="Sarah Jenkins"
                  autoComplete="name"
                  {...register("name")}
                  className={`h-11 w-full rounded-md border bg-[#edf3fc] pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:bg-white ${
                    errors.name ? "border-red-400" : "border-transparent"
                  }`}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email and phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-gray-700"
                >
                  Work / Personal Email
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="sarah.jenkins@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={`h-11 w-full rounded-md border bg-[#edf3fc] pl-9 pr-3 text-xs outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:bg-white ${
                      errors.email ? "border-red-400" : "border-transparent"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    autoComplete="tel"
                    {...register("phone")}
                    className={`h-11 w-full rounded-md border bg-[#edf3fc] pl-9 pr-3 text-xs outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:bg-white ${
                      errors.phone ? "border-red-400" : "border-transparent"
                    }`}
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-700"
                >
                  Password
                </label>

                <span
                  className={`text-[10px] font-semibold ${
                    passwordStrength === 5
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrength === 5
                    ? "Strong Password"
                    : passwordStrength >= 3
                      ? "Almost there"
                      : "Create a strong password"}
                </span>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  {...register("password")}
                  className={`h-11 w-full rounded-md border bg-[#edf3fc] pl-10 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:bg-white ${
                    errors.password
                      ? "border-red-400"
                      : "border-transparent"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {/* Password strength bars */}
              <div className="mt-2 flex gap-1">
                {passwordChecks.map((check) => (
                  <div
                    key={check.label}
                    className={`h-1 flex-1 rounded-full transition ${
                      check.valid ? "bg-[#0ca678]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Password requirements */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {passwordChecks.map((check) => (
                  <span
                    key={check.label}
                    className={`flex items-center gap-1 text-[10px] font-medium ${
                      check.valid ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    {check.label}
                  </span>
                ))}
              </div>

              {errors.password && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={`h-11 w-full rounded-md border bg-[#edf3fc] pl-10 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#07875f] focus:bg-white ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-transparent"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and conditions */}
            <div>
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-[#07875f]"
                />

                <label
                  htmlFor="terms"
                  className="cursor-pointer text-[11px] leading-5 text-gray-500"
                >
                  I agree to HireNest&apos;s{" "}
                  <a
                    href="/terms"
                    className="font-semibold text-[#07875f] hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="font-semibold text-[#07875f] hover:underline"
                  >
                    Privacy Policy
                  </a>
                  , and consent to receive curated job matches and interview
                  slot updates.
                </label>
              </div>

              {errors.terms && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* API response */}
            {message && (
              <div
                className={`rounded-md px-4 py-3 text-xs font-medium ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0ca678] text-sm font-bold text-white shadow-sm transition hover:bg-[#07875f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Job Seeker Account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-5 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-[#07875f] hover:underline"
            >
              Sign In to HireNest
            </a>
          </p>
        </section>

        {/* RIGHT: PROMOTIONAL SECTION */}
        <aside className="flex flex-col gap-4">
          {/* Hero image */}
          <div className="group relative h-[270px] overflow-hidden rounded-xl bg-gray-200 shadow-md sm:h-[330px] lg:h-[330px]">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
              alt="Professional working in a modern office"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Direct Recruiter Outreach
            </div>

            <div className="absolute right-4 top-4 rounded-full bg-[#07875f] px-3 py-2 text-[10px] font-bold text-white shadow-sm">
              98% Response Rate
            </div>

            {/* Verification card */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-lg bg-white p-3 shadow-lg">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-800">
                  Verified Candidate Priority
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-gray-500">
                  Profile reviewed by verified hiring teams within 48h.
                </p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.color}`}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Trusted by section */}
          <div className="rounded-xl bg-[#edf3fc] p-4">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">
              HireNest candidates are hired by
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles size={15} />
                Figma
              </span>

              <span className="text-lg font-extrabold tracking-tight">
                stripe
              </span>

              <span className="flex items-center gap-1">
                <BriefcaseBusiness size={14} />
                Linear
              </span>

              <span className="flex items-center gap-1">
                <Zap size={14} />
                Supabase
              </span>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
