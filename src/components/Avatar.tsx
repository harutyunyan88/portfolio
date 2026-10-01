import clsx from 'clsx'
import { useState } from 'react'

export const AVATAR_URL = '/avatar.webp'

type Props = {
  className?: string
  /** Width of the gradient ring in px. */
  ring?: number
}

// Profile photo inside a thin gradient ring. Falls back to initials if the image can't load.
export default function Avatar({ className, ring = 3 }: Props) {
  const [failed, setFailed] = useState(false)
  const inner = `calc(100% - ${ring * 2}px)`

  return (
    <div
      aria-hidden
      className={clsx(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 font-semibold text-white',
        className,
      )}
    >
      {failed ? (
        'AH'
      ) : (
        <img
          src={AVATAR_URL}
          alt=""
          width={320}
          height={320}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ width: inner, height: inner }}
          className="rounded-full bg-slate-300 object-cover"
        />
      )}
    </div>
  )
}
