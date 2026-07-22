import { z } from 'zod'

/*
 * Zod schemas for elder onboarding.
 *
 * Each schema is now a FACTORY — a function taking t() and returning
 * the schema. Why? Zod bakes error messages in when the schema is
 * built; a plain module-level schema would freeze them in whatever
 * language was active at import time. Building the schema at
 * validation time (identitySchema(t)) keeps messages in the active
 * language. Schemas are cheap to build, so this costs nothing real.
 *
 * One schema per step lets each step validate itself, and the
 * composed elderSchema validates everything together on final submit.
 */

// Shared: phone numbers appear in two steps, so define the rule once
const phoneRule = (t) =>
  z.string().regex(/^[0-9+\-\s]{7,}$/, t('elderForm.errors.phone'))

/* ---- Step 1: identity ---- */
export const identitySchema = (t) =>
  z.object({
    name: z.string().trim().min(2, t('elderForm.errors.name')),
    // z.coerce turns the input's string "72" into the number 72 first
    age: z.coerce
      .number()
      .int(t('elderForm.errors.ageInt'))
      .min(50, t('elderForm.errors.ageMin'))
      .max(120, t('elderForm.errors.ageMax')),
    phone: phoneRule(t),
    city: z.string().trim().min(2, t('elderForm.errors.city')),
  })

/* ---- Step 2: call preferences ---- */
export const preferencesSchema = (t) =>
  z.object({
    // An array of checkbox values; at least one must be ticked
    timeWindows: z.array(z.string()).min(1, t('elderForm.errors.timeWindows')),
    language: z.string().min(1, t('elderForm.errors.language')),
  })

/* ---- Step 3: care context ---- */
export const careContextSchema = (t) =>
  z.object({
    // Free-text fields are optional — not every family wants to share
    conditions: z.string().trim().optional(),
    topics: z.string().trim().optional(),
    // ...but an emergency contact is required
    emergencyName: z.string().trim().min(2, t('elderForm.errors.emergencyName')),
    emergencyPhone: phoneRule(t),
  })

/*
 * The composed schema: all three steps as one nested object,
 * matching the shape of the Zustand store. Final submit runs this
 * so nothing slips through (e.g. if a step was skipped by a bug).
 */
export const elderSchema = (t) =>
  z.object({
    identity: identitySchema(t),
    preferences: preferencesSchema(t),
    careContext: careContextSchema(t),
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
