
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../redux/store";
import {
  employerRegister,
  clearAuthError,
} from "../../../redux/features/auth/authSlice";

import {
  employerRegisterSchema,
  type EmployerRegisterData,
} from "../../../validations/authValidation";

import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

import {
  BriefcaseBusiness,
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Users,
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  ArrowRight,
  Rocket,
  ShieldCheck,
  Zap,
  BrainCircuit,
  UserCheck,
} from "lucide-react";

// Benefits displayed in the right-side panel
const benefits = [
  {
    icon: Zap,
    title: "Zero Setup Fees",
    description:
      "Post jobs in under 3 minutes with automated ATS integration and no commitment.",
  },
  {
    icon: BrainCircuit,
    title: "AI Screening & Matching",
    description:
      "Find candidates whose skills match your job requirements.",
  },
  {
    icon: UserCheck,
    title: "Verified Candidate Pool",
    description:
      "Discover candidates and manage your recruitment process.",
  },
];

export default function EmployerRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux loading state
  const loading = useSelector(
    (state: RootState) => state.auth.loading
  );

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "error"
  );

  // React Hook Form + Yup validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmployerRegisterData>({
    resolver: yupResolver(employerRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      recruiterName: "",
      jobTitle: "HR Manager",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      companyDescription: "",
      country: "India",
      state: "",
      city: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Read current form values
  const formData = watch();

  // Password requirements
  const password = formData.password || "";

  const passwordChecks = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "1 lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "1 number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "1 special symbol",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordStrength = passwordChecks.filter(
    (item) => item.valid
  ).length;

  // Reusable CSS classes
  const inputClass =
    "h-10 w-full rounded-md border border-transparent bg-[#edf2f9] pl-9 pr-3 text-xs text-[#273746] outline-none transition placeholder:text-gray-400 focus:border-[#0ca678] focus:bg-white";

  const plainInputClass =
    "h-10 w-full rounded-md border border-transparent bg-[#edf2f9] px-3 text-xs text-[#273746] outline-none transition placeholder:text-gray-400 focus:border-[#0ca678] focus:bg-white";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold text-[#283746]";

  // Submit function using Redux
  const onSubmit = async (data: EmployerRegisterData) => {
    setMessage("");
    dispatch(clearAuthError());

    if (!agreeTerms) {
      setMessage(
        "Please accept the Terms of Service and Privacy Policy."
      );
      setMessageType("error");
      return;
    }

    try {
      // Split recruiter full name into first and last name
      const nameParts = data.recruiterName.trim().split(/\s+/);

      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ");

      // Prepare the exact payload expected by the backend
      const payload = {
        firstName,
        lastName,
        jobTitle: data.jobTitle,
        email: data.email,
        password: data.password,
        phone: data.phone,
        companyName: data.companyName,
        companyEmail: data.email,
        companyWebsite: data.companyWebsite?.trim() || "",
        industry: data.industry,
        // Company size is optional. Send undefined when no option is selected.
        companySize: data.companySize || undefined,
        companyDescription: data.companyDescription || "",
        country: data.country || "India",
        // State and city are required by the form and backend.
        state: data.state.trim(),
        city: data.city.trim(),
        address: data.address || "",
      };

      // Dispatch Redux async thunk
      const result = await dispatch(
        employerRegister(payload)
      ).unwrap();

      setMessage(
        result.message ||
          "Employer account created successfully! Your account is pending approval."
      );

      setMessageType("success");

      // Redirect to employer login
      window.setTimeout(() => {
        router.push("/employer/login");
      }, 2000);
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : "Employer registration failed. Please try again."
      );

      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#263746]">
      <Navbar activePortal="employer" />

      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.9fr] lg:gap-8 lg:px-10 lg:py-8">
        {/* LEFT SIDE: EMPLOYER REGISTRATION FORM */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f7f1] px-3 py-1 text-[9px] font-bold text-[#07875f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ca678]" />
              Employer & Talent Acquisition Registration
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#202e3a] sm:text-3xl">
            Start Hiring with HireNest
          </h1>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Connect with talented engineers, designers, and business leaders.
          </p>

          {/* Job seeker link */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-[#edf3fc] px-3 py-3 text-[10px] text-gray-600">
            <BriefcaseBusiness
              size={14}
              className="text-[#07875f]"
            />

            <span>
              Looking for a job?{" "}
              <a
                href="/register"
                className="font-bold text-[#07875f] hover:underline"
              >
                Job Seeker? Find and apply for jobs here →
              </a>
            </span>
          </div>

          {/* Google registration placeholder */}
          <button
            type="button"
            onClick={() =>
              alert("Google signup needs OAuth configuration.")
            }
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-100 bg-white text-[11px] font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <span className="font-bold text-blue-600">G</span>
            Register with Google Workspace
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Or complete your company profile
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            noValidate
          >
            {/* Recruiter name and email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="recruiterName"
                  className={labelClass}
                >
                  Recruiter Full Name *
                </label>

                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="recruiterName"
                    {...register("recruiterName")}
                    placeholder="Marcus Vance"
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>

                {errors.recruiterName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.recruiterName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Work Email *
                </label>

                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="marcus@company.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.email.message}
                  </p>
                )}

                <p className="mt-1 text-[9px] text-gray-400">
                  Please use your corporate work email.
                </p>
              </div>
            </div>

            {/* Phone and company name */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number *
                </label>

                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+91 98765-0123"
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="companyName" className={labelClass}>
                  Company Name *
                </label>

                <div className="relative">
                  <Building2
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="companyName"
                    {...register("companyName")}
                    placeholder="e.g. Stripe, Acme Corp"
                    className={inputClass}
                    autoComplete="organization"
                  />
                </div>

                {errors.companyName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Website and company size */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="companyWebsite"
                  className={labelClass}
                >
                  Company Website (Optional)
                </label>

                <div className="relative">
                  <Globe
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="companyWebsite"
                    type="url"
                    {...register("companyWebsite")}
                    placeholder="https://acme.com"
                    className={inputClass}
                  />
                </div>

                {errors.companyWebsite && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.companyWebsite.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="companySize" className={labelClass}>
                  Company Size (Optional)
                </label>

                <div className="relative">
                  <Users
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    id="companySize"
                    {...register("companySize")}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select size range (Optional)</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                {errors.companySize && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.companySize.message}
                  </p>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className={labelClass}>
                Industry Sector *
              </label>

              <div className="relative">
                <Building2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  id="industry"
                  {...register("industry")}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select industry</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Finance & Banking">
                    Finance & Banking
                  </option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail & E-commerce">
                    Retail & E-commerce
                  </option>
                  <option value="Marketing & Advertising">
                    Marketing & Advertising
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {errors.industry && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password *
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Minimum 8 characters"
                    className={`${inputClass} pr-10`}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={labelClass}
                >
                  Confirm Password *
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Re-enter password"
                    className={`${inputClass} pr-10`}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password strength indicators */}
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength >= item
                        ? "bg-[#0ca678]"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1">
                {passwordChecks.map((item) => (
                  <p
                    key={item.label}
                    className={`text-[9px] ${
                      item.valid
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  >
                    {item.valid ? "✓" : "○"} {item.label}
                  </p>
                ))}
              </div>
            </div>

            {/* Additional optional company details */}
            <details open className="rounded-md border border-gray-100 p-3">
              <summary className="cursor-pointer text-[11px] font-semibold text-[#07875f]">
                Company Location & Additional Details
              </summary>

              <div className="mt-3 space-y-3">
                <div>
                  <label
                    htmlFor="companyDescription"
                    className={labelClass}
                  >
                    Company Description
                  </label>

                  <textarea
                    id="companyDescription"
                    {...register("companyDescription")}
                    rows={3}
                    placeholder="Tell candidates about your company..."
                    className="w-full rounded-md bg-[#edf2f9] p-3 text-xs outline-none focus:border focus:border-[#0ca678] focus:bg-white"
                  />

                  {errors.companyDescription && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {errors.companyDescription.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="country" className={labelClass}>
                      Country
                    </label>

                    <input
                      id="country"
                      {...register("country")}
                      className={plainInputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className={labelClass}>
                      State *
                    </label>

                    <input
                      id="state"
                      {...register("state")}
                      placeholder="Kerala"
                      required
                      className={plainInputClass}
                    />

                    {errors.state && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className={labelClass}>
                      City *
                    </label>

                    <input
                      id="city"
                      {...register("city")}
                      placeholder="Kozhikode"
                      required
                      className={plainInputClass}
                    />

                    {errors.city && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Company Address
                    </label>

                    <input
                      id="address"
                      {...register("address")}
                      placeholder="Company address"
                      className={plainInputClass}
                    />
                  </div>
                </div>
              </div>
            </details>

            {/* Terms and conditions */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) =>
                  setAgreeTerms(event.target.checked)
                }
                className="mt-0.5 h-3.5 w-3.5 accent-[#07875f]"
              />

              <label
                htmlFor="terms"
                className="text-[10px] leading-5 text-gray-500"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-semibold text-[#07875f]"
                >
                  Employer Terms of Service
                </a>
                , Fair Hiring Agreement, and{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-[#07875f]"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Success or error message */}
            {message && (
              <div
                role="alert"
                className={`rounded-md px-3 py-2 text-xs ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0ca678] text-xs font-bold text-white shadow-sm transition hover:bg-[#07875f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Rocket size={15} />

              {loading
                ? "Creating Employer Account..."
                : "Create Employer Account & Post First Job"}

              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-4 text-center text-[10px] text-gray-500">
            Already have an employer account?{" "}
            <a
              href="/employer/login"
              className="font-bold text-[#07875f] hover:underline"
            >
              Log in here
            </a>
          </p>
        </section>

        {/* RIGHT SIDE: PROMOTIONAL PANEL */}
        <aside className="flex flex-col rounded-xl bg-[#245f5b] p-4 text-white shadow-lg sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
              Enterprise Talent Cloud
            </span>

            <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-100">
              <ShieldCheck size={13} />
              Secure Registration
            </span>
          </div>

          {/* Hero image */}
          <div className="group relative h-48 overflow-hidden rounded-lg sm:h-64">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
              alt="Modern office workspace with a team"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#123d3b]/80 via-transparent to-black/10" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-md bg-white/95 p-3 text-[#263746] shadow-lg">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[10px] font-bold">
                  Real-Time Talent Sourcing
                </h3>

                <p className="mt-1 text-[9px] text-gray-500">
                  Connect with candidates and manage your hiring process.
                </p>
              </div>

              <span className="rounded bg-emerald-100 px-2 py-1 text-[8px] font-bold text-emerald-700">
                READY
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 flex flex-col gap-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-300/20 text-emerald-200">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">
                      {benefit.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-emerald-50/75">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistics panel */}
          <div className="mt-auto pt-5">
            <div className="rounded-lg bg-white/10 p-4 text-center">
              <h3 className="text-lg font-extrabold text-emerald-200">
                HireNest
              </h3>

              <p className="mt-1 text-[10px] text-emerald-50/75">
                Connect your company with talented people.
              </p>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
