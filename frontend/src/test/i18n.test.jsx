/*
 * i18n tests: the language toggle, the document-level side effects
 * (html lang + data-lang), persistence, and the guard that keeps
 * my.json's key shape identical to en.json (the source of truth).
 */
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './utils.jsx'
import en from '../i18n/locales/en.json'
import my from '../i18n/locales/my.json'

describe('language toggle', () => {
  test('switches to Burmese: document attrs, cache, and toggle label', async () => {
    const user = userEvent.setup()
    renderApp('/')

    // English by default; the toggle offers Burmese, in Burmese script
    expect(
      await screen.findByRole('heading', { name: /be there for your parents/i }),
    ).toBeInTheDocument()
    const toggle = screen.getByRole('button', { name: 'Change language' })
    expect(toggle).toHaveTextContent('မြန်မာ')
    expect(toggle).toHaveAttribute('lang', 'my')

    await user.click(toggle)

    // CSS hooks + screen-reader language set on <html>
    expect(document.documentElement.lang).toBe('my')
    expect(document.documentElement.dataset.lang).toBe('my')

    // The detector cached the choice for the next visit
    expect(localStorage.getItem('myancare_language')).toBe('my')

    // The toggle now offers English (my.json is TODO placeholders,
    // so page text still reads as English-sourced — but the toggle's
    // own labels are language-intrinsic and must flip)
    expect(toggle).toHaveTextContent('English')
    expect(toggle).toHaveAttribute('lang', 'en')
  })

  test('initial hydration applies the document language without a toggle', async () => {
    renderApp('/')
    await screen.findByRole('heading', { name: /be there for your parents/i })

    // config.ts syncs <html> at init time, not only on change
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dataset.lang).toBe('en')
  })
})

describe('translation files', () => {
  // Recursively flattens { nav: { login: '…' } } into ['nav.login', …]
  function keyPaths(objekt, prefix = '') {
    return Object.entries(objekt).flatMap(([key, value]) =>
      typeof value === 'object' && value !== null
        ? keyPaths(value, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    )
  }

  test('my.json has exactly the same keys as en.json', () => {
    // en.json is the source of truth for the key shape (it also
    // drives the TypeScript augmentation in i18next.d.ts).
    // If this fails: a key was added to one file but not the other.
    expect(keyPaths(my).sort()).toEqual(keyPaths(en).sort())
  })

  // Collects every leaf value as [keyPath, value] pairs
  function entries(objekt, prefix = '') {
    return Object.entries(objekt).flatMap(([key, value]) =>
      typeof value === 'object' && value !== null
        ? entries(value, `${prefix}${key}.`)
        : [[`${prefix}${key}`, value]],
    )
  }

  test.each([
    ['en', en],
    ['my', my],
  ])('%s.json has no untranslated TODO placeholders', (_name, file) => {
    const todos = entries(file).filter(([, v]) => v.startsWith('TODO:'))
    expect(todos).toEqual([])
  })

  test('my.json keeps every interpolation placeholder from en.json', () => {
    // A translator dropping {{name}} would render a message with a
    // silently missing value — catch that here rather than in prod.
    const placeholders = (s) => (s.match(/\{\{\w+\}\}/g) ?? []).sort()
    const myByKey = Object.fromEntries(entries(my))

    for (const [key, value] of entries(en)) {
      expect(placeholders(myByKey[key]), `key: ${key}`).toEqual(
        placeholders(value),
      )
    }
  })
})
