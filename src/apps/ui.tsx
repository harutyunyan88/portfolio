import clsx from 'clsx'
import type { ReactNode } from 'react'

export const stagger = (index: number, stepMs = 40) => ({ animationDelay: `${index * stepMs}ms` })

export function AppPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="@container p-5 sm:p-7">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  )
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  )
}
