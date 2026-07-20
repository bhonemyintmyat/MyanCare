import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/*
 * Zustand store for the onboarding wizard.
 *
 * Why Zustand here instead of useState?
 * - The three step components and the page all need the same data;
 *   a store avoids passing props through every level (like context,
 *   but with less boilerplate).
 * - The persist() middleware automatically saves the store to
 *   localStorage on every change and reloads it on page load —
 *   that's what makes a browser refresh keep your progress.
 *
 * Usage in a component:
 *   const { identity, updateSection } = useOnboardingStore()
 *   updateSection('identity', { name: 'Daw Mya' })
 */

// Starting values, also used by reset()
const emptyData = {
  step: 0, // which step is showing (0-based)
  identity: { name: '', age: '', phone: '', city: '' },
  preferences: { timeWindows: [], language: '' },
  careContext: { conditions: '', topics: '', emergencyName: '', emergencyPhone: '' },
}

export const useOnboardingStore = create(
  persist(
    (set) => ({
      ...emptyData,

      setStep: (step) => set({ step }),

      /*
       * One generic updater for all three sections:
       *   updateSection('identity', { name: 'Daw Mya' })
       * merges the new values into that section, leaving the rest alone.
       */
      updateSection: (section, values) =>
        set((state) => ({
          [section]: { ...state[section], ...values },
        })),

      // Called after a successful submit so the wizard starts fresh
      reset: () => set(emptyData),
    }),
    {
      // The localStorage key the store is saved under
      name: 'myancare-onboarding',
    },
  ),
)
