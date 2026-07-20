import { z } from 'zod'

/*
 * Zod schemas for elder onboarding.
 *
 * A schema describes what valid data looks like; zod checks values
 * against it and produces error messages when they don't fit.
 * One schema per step lets each step validate itself, and the
 * composed elderSchema at the bottom validates everything together
 * on final submit.
 */

// Shared: phone numbers appear in two steps, so define the rule once
const phoneRule = z
  .string()
  .regex(/^[0-9+\-\s]{7,}$/, 'Please enter a valid phone number (digits, +, - only).')

/* ---- Step 1: identity ---- */
export const identitySchema = z.object({
  name: z.string().trim().min(2, 'Please enter their full name.'),
  // z.coerce turns the input's string "72" into the number 72 first
  age: z.coerce
    .number()
    .int('Age should be a whole number.')
    .min(50, 'MyanCare is designed for elders aged 50 and over.')
    .max(120, 'Please double-check the age.'),
  phone: phoneRule,
  city: z.string().trim().min(2, 'Please enter their city or township.'),
})

/* ---- Step 2: call preferences ---- */
export const preferencesSchema = z.object({
  // An array of checkbox values; at least one must be ticked
  timeWindows: z
    .array(z.string())
    .min(1, 'Pick at least one time window for calls.'),
  language: z.string().min(1, 'Please choose their language or dialect.'),
})

/* ---- Step 3: care context ---- */
export const careContextSchema = z.object({
  // Free-text fields are optional — not every family wants to share
  conditions: z.string().trim().optional(),
  topics: z.string().trim().optional(),
  // ...but an emergency contact is required
  emergencyName: z.string().trim().min(2, 'Please enter an emergency contact name.'),
  emergencyPhone: phoneRule,
})

/*
 * The composed schema: all three steps as one nested object,
 * matching the shape of the Zustand store. Final submit runs this
 * so nothing slips through (e.g. if a step was skipped by a bug).
 */
export const elderSchema = z.object({
  identity: identitySchema,
  preferences: preferencesSchema,
  careContext: careContextSchema,
})

/*
 * Helper used by every step: runs a schema against values and
 * returns { fieldName: "message" } for the first error per field,
 * or null when everything is valid.
 */
export function getFieldErrors(schema, values) {
  const result = schema.safeParse(values)
  if (result.success) return null

  const errors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] // which field this issue belongs to
    if (!errors[field]) {
      errors[field] = issue.message // keep only the first message per field
    }
  }
  return errors
}
