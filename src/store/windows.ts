import { create } from 'zustand'
import { APPS, type AppId } from '../apps/registry'

export const TASKBAR_HEIGHT = 48

export type WindowState = {
  id: AppId
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
  maximized: boolean
}

type WindowsStore = {
  windows: Partial<Record<AppId, WindowState>>
  activeId: AppId | null
  topZ: number
  open: (id: AppId) => void
  close: (id: AppId) => void
  focus: (id: AppId) => void
  minimize: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, rect: { x: number; y: number; width: number; height: number }) => void
}

// Place a new window roughly centred, cascading by how many are already open.
function initialRect(id: AppId, openCount: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_HEIGHT
  const width = Math.min(APPS[id].size.width, vw - 32)
  const height = Math.min(APPS[id].size.height, vh - 32)
  const offset = (openCount % 6) * 28
  const x = Math.max(16, Math.min((vw - width) / 2 + offset - 60, vw - width - 16))
  const y = Math.max(16, Math.min((vh - height) / 2 + offset - 40, vh - height - 16))
  return { x, y, width, height }
}

export const useWindowsStore = create<WindowsStore>((set, get) => ({
  windows: {},
  activeId: null,
  topZ: 10,

  open: (id) => {
    const { windows, topZ } = get()
    const existing = windows[id]
    const z = topZ + 1
    if (existing) {
      set({ windows: { ...windows, [id]: { ...existing, minimized: false, z } }, activeId: id, topZ: z })
      return
    }
    const rect = initialRect(id, Object.keys(windows).length)
    set({
      windows: { ...windows, [id]: { id, ...rect, z, minimized: false, maximized: false } },
      activeId: id,
      topZ: z,
    })
  },

  close: (id) => {
    const windows = { ...get().windows }
    delete windows[id]
    set({ windows, activeId: topVisible(windows) })
  },

  focus: (id) => {
    const { windows, topZ, activeId } = get()
    const win = windows[id]
    if (!win || (activeId === id && win.z === topZ)) return
    const z = topZ + 1
    set({ windows: { ...windows, [id]: { ...win, z, minimized: false } }, activeId: id, topZ: z })
  },

  minimize: (id) => {
    const windows = { ...get().windows }
    const win = windows[id]
    if (!win) return
    windows[id] = { ...win, minimized: true }
    set({ windows, activeId: topVisible(windows) })
  },

  toggleMaximize: (id) => update(set, get, id, (w) => ({ maximized: !w.maximized })),
  move: (id, x, y) => update(set, get, id, () => ({ x, y })),
  resize: (id, rect) => update(set, get, id, () => rect),
}))

function update(
  set: (partial: Partial<WindowsStore>) => void,
  get: () => WindowsStore,
  id: AppId,
  patch: (w: WindowState) => Partial<WindowState>,
) {
  const win = get().windows[id]
  if (!win) return
  set({ windows: { ...get().windows, [id]: { ...win, ...patch(win) } } })
}

function topVisible(windows: Partial<Record<AppId, WindowState>>): AppId | null {
  const visible = Object.values(windows).filter((w) => w && !w.minimized) as WindowState[]
  if (!visible.length) return null
  return visible.reduce((a, b) => (a.z > b.z ? a : b)).id
}
