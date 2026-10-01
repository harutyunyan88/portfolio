/** Formats 'YYYY-MM' as a localized short month and year, e.g. "Oct 2020". */
export function formatMonth(value: string, locale: string | undefined): string {
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString(locale, { month: 'short', year: 'numeric' })
}
