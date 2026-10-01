import type { IconType } from 'react-icons'
import {
  IoAirplane,
  IoFilm,
  IoFootball,
  IoGameController,
  IoMusicalNotes,
  IoRestaurant,
  IoSparkles,
} from 'react-icons/io5'

// Titles and descriptions live in the locale files under `interests.items.<id>`.
export type Interest = {
  id: 'football' | 'gaming' | 'ai' | 'movies' | 'music' | 'cooking' | 'travel'
  icon: IconType
  /** Tailwind classes for the icon tile. */
  tint: string
}

export const INTERESTS: Interest[] = [
  { id: 'football', icon: IoFootball, tint: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  { id: 'gaming', icon: IoGameController, tint: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  { id: 'ai', icon: IoSparkles, tint: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { id: 'movies', icon: IoFilm, tint: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  { id: 'music', icon: IoMusicalNotes, tint: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' },
  { id: 'cooking', icon: IoRestaurant, tint: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  { id: 'travel', icon: IoAirplane, tint: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
]
