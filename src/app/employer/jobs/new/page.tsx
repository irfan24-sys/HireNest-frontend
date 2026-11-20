
"use client";

import {
  useState,
  type FormEvent,
} from "react";
import EmployerNavbar from "../../../../components/employer/EmployerNavbar";
import {
  BriefcaseBusiness,
  MapPin,
  Wallet,
  GraduationCap,
  FileText,
  Send,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Clock,
  Building2,
  Laptop,
  Users,
  Globe,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const employmentTypes = [
  { label: "Full-time", description: "40 hrs / week", icon: Clock },
  { label: "Part-time", description: "Flexible hours", icon: Clock },
  { label: "Contract", description: "Fixed duration", icon: FileText },
  { label: "Internship", description: "Learn and grow", icon: GraduationCap },
  { label: "Freelance", description: "Project based", icon: Users },
];

const workplaceTypes = [
  {
    label: "On-site",
    description: "Work from your workplace",
    icon: Building2,
  },
  {
    label: "Hybrid",
    description: "Office + remote flexibility",
    icon: Laptop,
  },
  {
    label: "Remote",
    description: "Work from anywhere",
    icon: Globe,
  },
];

const skillSuggestions = [
  "React.js",
  "JavaScript",
  "Node.js",
  "MongoDB",
  "Express.js",
  "TypeScript",
  "Next.js",
  "Python",
];

const experienceOptions = [
  "Fresher",
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3-5 years",
  "5-8 years",
  "8+ years",
];

const positionOptions = [
  "Intern",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
  "Director",
];

type JobForm = {
  title: string;
  openings: number;
  department: string;
  employmentType: string;
  workplaceType: string;
  country: string;
  state: string;
  city: string;
  currency: string;
  salaryType: string;
  minSalary: string;
  maxSalary: string;
  experienceLevel: string;
  positionLevel: string;
  skills: string[];
  roleOverview: string;
  responsibilities: string;
  qualifications: string;
  applicationMethod: string;
  applicationDeadline: string;
  externalApplicationUrl: string;
};

const initialForm: JobForm = {
  title: "",
  openings: 1,
  department: "",
  employmentType: "Full-time",
  workplaceType: "Hybrid",
  country: "India",
  state: "",
  city: "",
  currency: "INR",
  salaryType: "Yearly",
  minSalary: "",
  maxSalary: "",
  experienceLevel: "Fresher",
  positionLevel: "Junior",
  skills: [],
  roleOverview: "",
  responsibilities: "",
  qualifications: "",
  applicationMethod: "platform",
  applicationDeadline: "",
  externalApplicationUrl: "",
};

function SectionHeader({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3 border-b border-gray-100 pb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900">
          {number}. {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function NewJobPage() {
  const [form, setForm] = useState<JobForm>(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = <K extends keyof JobForm>(
    key: K,
    value: JobForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = (value: string) => {
    const skill = value.trim();

    if (
      !skill ||
      form.skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      return;
    }

    updateField("skills", [...form.skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    updateField(
      "skills",
      form.skills.filter((item) => item !== skill)
    );
  };

  const handleSkillKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  // The progress indicator is calculated from the actual form values.
  // Optional salary and qualification fields do not block completion.
  const progressFields = [
    form.title.trim(),
    String(form.openings),
    form.department,
    form.employmentType,
    form.workplaceType,
    form.country,
    form.state.trim(),
    form.city.trim(),
    form.currency,
    form.salaryType,
    form.experienceLevel,
    form.positionLevel,
    form.roleOverview.trim(),
    form.responsibilities.trim(),
    form.applicationMethod,
    ...(form.applicationMethod === "external"
      ? [form.externalApplicationUrl.trim()]
      : []),
  ];

  const completion = Math.round(
    (progressFields.filter(Boolean).length / progressFields.length) * 100
  );

  const progressSteps = [
    {
      title: "Basic information",
      target: "basic-information",
      complete: Boolean(
        form.title.trim() && form.openings >= 1 && form.department && form.employmentType
      ),
    },
    {
      title: "Workplace & location",
      target: "workplace-location",
      complete: Boolean(
        form.workplaceType && form.country && form.state.trim() && form.city.trim()
      ),
    },
    {
      title: "Compensation & skills",
      target: "compensation-skills",
      complete: Boolean(
        form.currency && form.salaryType && form.experienceLevel && form.positionLevel
      ),
    },
    {
      title: "Application settings",
      target: "application-settings",
      complete: Boolean(
        form.roleOverview.trim() &&
          form.responsibilities.trim() &&
          form.applicationMethod &&
          (form.applicationMethod !== "external" || form.externalApplicationUrl.trim())
      ),
    },
  ];

  const activeStepIndex = progressSteps.findIndex((step) => !step.complete);
  const currentStepIndex = activeStepIndex === -1 ? progressSteps.length - 1 : activeStepIndex;

  const scrollToStep = (target: string) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    status: "draft" | "published"
  ) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!API_URL) {
      setError("Backend URL is not configured. Check your .env.local file.");
      return;
    }

    if (status === "published") {
      const requiredFields = [
        form.title,
        form.department,
        form.country,
        form.state,
        form.city,
        form.roleOverview,
        form.responsibilities,
        form.experienceLevel,
        form.positionLevel,
      ];

      if (requiredFields.some((value) => !String(value).trim())) {
        setError("Please complete all required fields before publishing.");
        return;
      }

      if (
        form.applicationMethod === "external" &&
        !form.externalApplicationUrl.trim()
      ) {
        setError("Please provide an external application URL.");
        return;
      }
    }

    const minSalary =
      form.minSalary.trim() === ""
        ? undefined
        : Number(form.minSalary);

    const maxSalary =
      form.maxSalary.trim() === ""
        ? undefined
        : Number(form.maxSalary);

    if (
      minSalary !== undefined &&
      maxSalary !== undefined &&
      minSalary > maxSalary
    ) {
      setError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    if (
      (minSalary !== undefined && minSalary < 0) ||
      (maxSalary !== undefined && maxSalary < 0)
    ) {
      setError("Salary cannot be negative.");
      return;
    }

    if (
      form.applicationMethod === "external" &&
      form.externalApplicationUrl.trim()
    ) {
      try {
        const url = new URL(form.externalApplicationUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setError("Please enter a valid external application URL.");
        return;
      }
    }

    const payload = {
      title: form.title.trim(),
      openings: Number(form.openings),
      department: form.department,
      employmentType: form.employmentType,
      workplaceType: form.workplaceType,
      country: form.country,
      state: form.state,
      city: form.city,
      currency: form.currency,
      salaryType: form.salaryType,
      minSalary,
      maxSalary,
      experienceLevel: form.experienceLevel,
      positionLevel: form.positionLevel,
      skills: form.skills,
      roleOverview: form.roleOverview.trim(),
      responsibilities: form.responsibilities.trim(),
      qualifications: form.qualifications.trim(),
      applicationMethod: form.applicationMethod,
      applicationDeadline: form.applicationDeadline || undefined,
      externalApplicationUrl:
        form.applicationMethod === "external"
          ? form.externalApplicationUrl.trim()
          : "",
      status,
    };

    try {
      setLoading(true);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!token) {
        setError("Please login as an employer before posting a job.");
        return;
      }

      const response = await fetch(`${API_URL}/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit job."
        );
      }

      setMessage(
        result.message ||
          (status === "published"
            ? "Job published successfully!"
            : "Job saved as draft successfully!")
      );

      if (status === "published") {
        setTimeout(() => {
          window.location.href = "/employer/jobs";
        }, 1200);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-28">
        <EmployerNavbar />

      {/* TOP BREADCRUMB AND PAGE HEADER */}
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link
              href="/employer/dashboard"
              className="hover:text-emerald-600"
            >
              Employer Dashboard
            </Link>
            <ChevronRight size={13} />
            <Link
              href="/employer/jobs"
              className="hover:text-emerald-600"
            >
              Jobs
            </Link>
            <ChevronRight size={13} />
            <span className="font-semibold text-gray-800">
              Post a New Job
            </span>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} className="mr-1 inline" />
            Create a job opening
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Post a New Job Opening
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Reach the right candidates by creating a detailed job
            description and sharing your opportunity.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Job details completion
            </div>
            <span className="text-sm font-bold text-emerald-600">
              {completion}% Completed
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {progressSteps.map((step, index) => {
              const isCurrent = index === currentStepIndex;
              return (
                <button
                  type="button"
                  key={step.title}
                  onClick={() => scrollToStep(step.target)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                    step.complete
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : isCurrent
                        ? "border-emerald-400 bg-white text-emerald-700 shadow-sm"
                        : "border-gray-100 bg-white text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.complete
                        ? "bg-emerald-100 text-emerald-700"
                        : isCurrent
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.complete ? <CheckCircle2 size={17} /> : index + 1}
                  </span>
                  <span>{step.title}</span>
                  {isCurrent && !step.complete && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, "published")}
        className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8"
      >

        {/* SECTION 1: BASIC INFORMATION */}
        <section id="basic-information" className="scroll-mt-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={1}
            icon={BriefcaseBusiness}
            title="Basic Job Information"
            description="Give your job a clear title and provide essential information about the position."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field label="Job Title" required>
                <input
                  className={inputClass}
                  placeholder="e.g. Senior Frontend Developer"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </Field>
            </div>

            <Field label="Number of Openings" required>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={form.openings}
                onChange={(e) =>
                  updateField("openings", Math.max(1, Number(e.target.value)))
                }
                required
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Department / Category" required>
              <select
                className={inputClass}
                value={form.department}
                onChange={(e) =>
                  updateField("department", e.target.value)
                }
                required
              >
                <option value="">Select department</option>
                <option value="Software Development">Software Development</option>
                <option value="Engineering">Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Employment Type" required>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {employmentTypes.map((type) => {
                  const Icon = type.icon;
                  const active = form.employmentType === type.label;

                  return (
                    <button
                      type="button"
                      key={type.label}
                      onClick={() =>
                        updateField("employmentType", type.label)
                      }
                      className={`relative rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          active ? "text-emerald-600" : "text-gray-500"
                        }
                      />

                      <p className="mt-3 text-sm font-bold text-gray-800">
                        {type.label}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-500">
                        {type.description}
                      </p>

                      {active && (
                        <CheckCircle2
                          size={17}
                          className="absolute right-3 top-3 text-emerald-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </section>

        {/* SECTION 2: WORKPLACE AND LOCATION */}
        <section id="workplace-location" className="scroll-mt-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={2}
            icon={MapPin}
            title="Workplace Type & Location"
            description="Help candidates understand where and how they will work."
          />

          <Field label="Workplace Type" required>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {workplaceTypes.map((type) => {
                const Icon = type.icon;
                const active = form.workplaceType === type.label;

                return (
                  <button
                    type="button"
                    key={type.label}
                    onClick={() =>
                      updateField("workplaceType", type.label)
                    }
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <Icon
                      size={21}
                      className={
                        active ? "text-emerald-600" : "text-gray-500"
                      }
                    />

                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {type.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {type.description}
                      </p>
                    </div>

                    <div className="ml-auto">
                      {active ? (
                        <CheckCircle2
                          size={19}
                          className="text-emerald-600"
                        />
                      ) : (
                        <Circle size={19} className="text-gray-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Country" required>
              <select
                className={inputClass}
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                required
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UAE">UAE</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="State / Region" required>
              <input
                className={inputClass}
                placeholder="e.g. Kerala"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                required
              />
            </Field>

            <Field label="City" required>
              <input
                className={inputClass}
                placeholder="e.g. Kozhikode"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                required
              />
            </Field>
          </div>
        </section>

        {/* SECTION 3: COMPENSATION */}
        <section id="compensation-skills" className="scroll-mt-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={3}
            icon={Wallet}
            title="Compensation & Benefits"
            description="Provide a transparent salary range to attract suitable candidates."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Currency">
              <select
                className={inputClass}
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
              </select>
            </Field>

            <Field label="Salary Type">
              <select
                className={inputClass}
                value={form.salaryType}
                onChange={(e) => updateField("salaryType", e.target.value)}
              >
                <option value="Yearly">Per Year</option>
                <option value="Monthly">Per Month</option>
                <option value="Hourly">Per Hour</option>
              </select>
            </Field>

            <Field label="Minimum Salary">
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="e.g. 300000"
                value={form.minSalary}
                onChange={(e) => updateField("minSalary", e.target.value)}
              />
            </Field>

            <Field label="Maximum Salary">
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="e.g. 500000"
                value={form.maxSalary}
                onChange={(e) => updateField("maxSalary", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Wallet size={20} className="shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Salary transparency matters
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-700">
                Adding a salary range can help attract candidates whose
                expectations match your opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: EXPERIENCE AND SKILLS */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={4}
            icon={GraduationCap}
            title="Experience & Skills"
            description="Define the experience level and skills required for this position."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Experience Level" required>
              <select
                className={inputClass}
                value={form.experienceLevel}
                onChange={(e) =>
                  updateField("experienceLevel", e.target.value)
                }
                required
              >
                {experienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Position Level" required>
              <select
                className={inputClass}
                value={form.positionLevel}
                onChange={(e) =>
                  updateField("positionLevel", e.target.value)
                }
                required
              >
                {positionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Required Skills & Technologies">
              <div className="rounded-lg border border-gray-200 p-3 focus-within:border-emerald-500">
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  <input
                    className="min-w-[150px] flex-1 border-0 py-1 text-sm outline-none"
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <Plus size={14} className="mr-1 inline" />
                  Add skill
                </button>
              </div>
            </Field>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                Suggested skills
              </p>

              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => {
                  const selected = form.skills.includes(skill);

                  return (
                    <button
                      type="button"
                      key={skill}
                      disabled={selected}
                      onClick={() => addSkill(skill)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        selected
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: JOB DESCRIPTION */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={5}
            icon={FileText}
            title="Job Description & Responsibilities"
            description="Explain the role, daily responsibilities and qualifications."
          />

          <div className="space-y-5">
            <Field label="Role Overview" required>
              <textarea
                rows={4}
                maxLength={3000}
                className={textareaClass}
                placeholder="Describe the role, your team and what the candidate will work on..."
                value={form.roleOverview}
                onChange={(e) =>
                  updateField("roleOverview", e.target.value)
                }
                required
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {form.roleOverview.length}/3000
              </p>
            </Field>

            <Field label="Key Responsibilities" required>
              <textarea
                rows={5}
                maxLength={5000}
                className={textareaClass}
                placeholder="List the key responsibilities of this role. You can separate each responsibility with a new line."
                value={form.responsibilities}
                onChange={(e) =>
                  updateField("responsibilities", e.target.value)
                }
                required
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {form.responsibilities.length}/5000
              </p>
            </Field>

            <Field label="Qualifications & Requirements">
              <textarea
                rows={4}
                maxLength={3000}
                className={textareaClass}
                placeholder="Add education, certifications, experience and other requirements..."
                value={form.qualifications}
                onChange={(e) =>
                  updateField("qualifications", e.target.value)
                }
              />
            </Field>
          </div>
        </section>

        {/* SECTION 6: APPLICATION SETTINGS */}
        <section id="application-settings" className="scroll-mt-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number={6}
            icon={Send}
            title="Application Settings"
            description="Choose how candidates can apply for this job."
          />

          <Field label="Application Method" required>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  updateField("applicationMethod", "platform")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.applicationMethod === "platform"
                    ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={19}
                    className="text-emerald-600"
                  />
                  <span className="text-sm font-bold text-gray-800">
                    Apply through HireNest
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Candidates apply directly through your HireNest job
                  listing.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateField("applicationMethod", "external")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.applicationMethod === "external"
                    ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe size={19} className="text-emerald-600" />
                  <span className="text-sm font-bold text-gray-800">
                    External Application
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Redirect candidates to your company application page.
                </p>
              </button>
            </div>
          </Field>

          {form.applicationMethod === "external" && (
            <div className="mt-5">
              <Field label="External Application URL" required>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://company.com/careers/apply"
                  value={form.externalApplicationUrl}
                  onChange={(e) =>
                    updateField("externalApplicationUrl", e.target.value)
                  }
                  required
                />
              </Field>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Application Deadline">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
                value={form.applicationDeadline}
                onChange={(e) =>
                  updateField("applicationDeadline", e.target.value)
                }
              />
            </Field>

            <Field label="Application Destination">
              <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3">
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />
                <span className="text-sm text-gray-600">
                  {form.applicationMethod === "platform"
                    ? "HireNest applications"
                    : "External company URL"}
                </span>
              </div>
            </Field>
          </div>
        </section>

        {/* RESPONSE MESSAGE */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 size={17} className="mr-2 inline" />
            {message}
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="hidden text-xs text-gray-500 sm:block">
              <span className="font-semibold text-emerald-600">
                {completion}% Complete
              </span>
              <span className="mx-2">|</span>
              Your information is saved when you submit.
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Link
                href="/employer/jobs"
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft size={15} />
                Cancel
              </Link>

              <button
                type="button"
                disabled={loading}
                onClick={(e) =>
                  handleSubmit(
                    e as unknown as FormEvent<HTMLFormElement>,
                    "draft"
                  )
                }
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Save Draft
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Publish Job Opening
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
