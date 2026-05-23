import { z } from "zod";

const namedText = (label, min, max) =>
  z
    .string({
      invalid_type_error: `${label} is required.`,
      required_error: `${label} is required.`
    })
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const email = z
  .string({
    invalid_type_error: "Email is required.",
    required_error: "Email is required."
  })
  .trim()
  .email("Enter a valid email address.")
  .max(254, "Email must be 254 characters or fewer.")
  .transform((value) => value.toLowerCase());

export const churchMemberSchema = z.object({
  fullName: namedText("Full name", 2, 120),
  email,
  country: namedText("Country", 2, 120),
  loyaltyMessage: namedText("Loyalty message", 12, 800)
});

export const citizenComplaintSchema = z.object({
  fullName: namedText("Full name", 2, 120),
  email,
  location: namedText("Location", 2, 180),
  complaintDescription: namedText("Complaint description", 20, 1200)
});

