import clsx from 'clsx'

// Placeholder until the cartoon avatar is ready; swap the inner content for an <img>.
export default function Avatar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 font-semibold text-white',
        className,
      )}
    >
      AH
    </div>
  )
}
