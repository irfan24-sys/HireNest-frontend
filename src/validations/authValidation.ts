
import * as yup from "yup";

// ========================================
// COMMON PASSWORD VALIDATION
// ========================================

const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(8, "Password must contain at least 8 characters")
  .matches(/[A-Z]/, "At least one uppercase letter is required")
  .matches(/[a-z]/, "At least one lowercase letter is required")
  .matches(/[0-9]/, "At least one number is required")
  .matches(/[^A-Za-z0-9]/, "At least one special character is required");

// ========================================
// COMMON EMAIL VALIDATION
// ========================================

const emailSchema = yup
  .string()
  .trim()
  .email("Please enter a valid email address")
  .required("Email is required");

// ========================================
// COMMON PHONE VALIDATION
// ========================================

const phoneSchema = yup
  .string()
  .required("Phone number is required")
  .matches(
    /^[0-9+\-\s()]{7,20}$/,
    "Please enter a valid phone number"
  );

// ========================================
// JOB SEEKER REGISTRATION
// ========================================

export const seekerRegisterSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(3, "Name must contain at least 3 characters"),

  email: emailSchema,

  phone: phoneSchema,

  password: passwordSchema,

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),

  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required(),
});

// ========================================
// JOB SEEKER LOGIN
// ========================================

export const seekerLoginSchema = yup.object({
  email: emailSchema,

  password: yup
    .string()
    .required("Password is required"),
});

// ========================================
// EMPLOYER REGISTRATION
// ========================================

export const employerRegisterSchema = yup.object({
  recruiterName: yup
    .string()
    .trim()
    .required("Recruiter name is required")
    .min(3, "Name must contain at least 3 characters"),

  jobTitle: yup
    .string()
    .trim()
    .required("Job title is required"),

  email: emailSchema,

  phone: phoneSchema,

  companyName: yup
    .string()
    .trim()
    .required("Company name is required"),

  // Optional company website
  companyWebsite: yup
    .string()
    .trim()
    .optional()
    .default("")
    .test(
      "valid-url",
      "Please enter a valid website URL",
      (value) =>
        !value ||
        /^https?:\/\/.+\..+/.test(value)
    ),

  // Optional company size
  companySize: yup
    .string()
    .optional()
    .default("")
    .test(
      "valid-company-size",
      "Please select a valid company size",
      (value) =>
        !value ||
        [
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1000+",
        ].includes(value)
    ),

  industry: yup
    .string()
    .required("Please select an industry"),

  companyDescription: yup
    .string()
    .optional(),

  // Country is required
  country: yup
    .string()
    .trim()
    .required("Country is required"),

  // State is required
  state: yup
    .string()
    .trim()
    .required("State is required"),

  // City is required
  city: yup
    .string()
    .trim()
    .required("City is required"),

  address: yup
    .string()
    .optional(),

  password: passwordSchema,

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),

});

// ========================================
// EMPLOYER LOGIN
// ========================================

export const employerLoginSchema = yup.object({
  email: emailSchema,

  password: yup
    .string()
    .required("Password is required"),
});

// ========================================
// TYPESCRIPT TYPES
// ========================================

export type SeekerRegisterData = yup.InferType<
  typeof seekerRegisterSchema
>;

export type SeekerLoginData = yup.InferType<
  typeof seekerLoginSchema
>;

export type EmployerRegisterData = yup.InferType<
  typeof employerRegisterSchema
>;

export type EmployerLoginData = yup.InferType<
  typeof employerLoginSchema
>;
