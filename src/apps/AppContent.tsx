import { Suspense } from 'react'
import { APPS, type AppId } from './registry'

export default function AppContent({ id }: { id: AppId }) {
  const Content = APPS[id].component
  return (
    <Suspense
      fallback={
        <div className="grid h-full min-h-40 place-items-center">
          <span className="size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <Content />
    </Suspense>
  )
}
