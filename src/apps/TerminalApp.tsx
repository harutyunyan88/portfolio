import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { EXPERIENCE } from '../data/experience'
import { CONTACTS, yearsOfExperience } from '../data/profile'
import { PROJECTS } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { LANGUAGES } from '../i18n'
import { formatMonth } from '../lib/format'
import { useThemeStore } from '../store/theme'
import { CV_URL } from '../lib/constants'
import { useAppHost } from './AppHost'
import { DESKTOP_ORDER, type AppId } from './registry'

type Line = { id: number; prompt?: string; content: ReactNode }

const PROMPT = 'arsen@portfolio:~$'
const COMMANDS = ['help', 'about', 'skills', 'experience', 'projects', 'contact', 'cv', 'open', 'theme', 'lang', 'clear'] as const
const HIDDEN_COMMANDS = ['whoami', 'ls', 'date', 'echo', 'sudo']

export default function TerminalApp() {
  const { t, i18n } = useTranslation()
  const { openApp } = useAppHost()
  const toggleTheme = useThemeStore((s) => s.toggle)
  const [lines, setLines] = useState<Line[]>(() => [{ id: 0, content: t('terminal.welcome') }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const print = (content: ReactNode, prompt?: string) =>
    setLines((prev) => [...prev, { id: nextId.current++, prompt, content }])

  const run = (raw: string): ReactNode => {
    const [first = '', ...args] = raw.trim().split(/\s+/)
    const cmd = first.toLowerCase()
    const arg = args.join(' ')

    switch (cmd) {
      case '':
        return null
      case 'help':
        return (
          <ul>
            {COMMANDS.map((c) => (
              <li key={c}>
                <span className="inline-block w-24 text-sky-400">{c}</span>
                {t(`terminal.help.${c}`)}
              </li>
            ))}
          </ul>
        )
      case 'about':
      case 'whoami':
        return `${t('profile.name')} — ${t('profile.role')} · ${t('profile.location')} · ${t('about.facts.experienceValue', { years: yearsOfExperience() })}`
      case 'skills':
        return (
          <ul>
            {SKILL_GROUPS.map((g) => (
              <li key={g.id}>
                <span className="text-sky-400">{t(`skills.groups.${g.id}`)}:</span> {g.skills.map((s) => s.name).join(', ')}
              </li>
            ))}
          </ul>
        )
      case 'experience':
        return (
          <ul>
            {EXPERIENCE.map((job) => (
              <li key={job.id}>
                <span className="text-emerald-400">
                  {formatMonth(job.start, i18n.resolvedLanguage)} — {job.end ? formatMonth(job.end, i18n.resolvedLanguage) : t('common.present')}
                </span>{' '}
                {t(`experience.items.${job.id}.role`)} @ {job.company}
              </li>
            ))}
          </ul>
        )
      case 'projects':
        return (
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <span className="text-amber-300">▸</span> {t(`projects.items.${p.id}.title`)}
              </li>
            ))}
          </ul>
        )
      case 'contact':
        return (
          <ul>
            {CONTACTS.map((c) => (
              <li key={c.id}>
                <span className="inline-block w-24 text-sky-400">{t(`contact.labels.${c.id}`)}</span>
                <a href={c.href} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-white">
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        )
      case 'cv': {
        const link = document.createElement('a')
        link.href = CV_URL
        link.download = ''
        link.click()
        return t('terminal.downloading')
      }
      case 'open':
      case 'ls': {
        const target = arg.toLowerCase() as AppId
        if (cmd === 'open' && DESKTOP_ORDER.includes(target)) {
          setTimeout(() => openApp(target), 150)
          return t('terminal.opening', { app: t(`apps.${target}`) })
        }
        return cmd === 'ls' ? DESKTOP_ORDER.join('  ') : t('terminal.openUsage', { apps: DESKTOP_ORDER.join(', ') })
      }
      case 'theme': {
        toggleTheme()
        const theme = useThemeStore.getState().theme
        return t('terminal.themeSwitched', { theme })
      }
      case 'lang': {
        const code = arg.toLowerCase()
        if (!LANGUAGES.some((l) => l.code === code)) return t('terminal.langUsage')
        i18n.changeLanguage(code)
        return `✓ ${LANGUAGES.find((l) => l.code === code)!.name}`
      }
      case 'date':
        return new Date().toLocaleString(i18n.resolvedLanguage)
      case 'echo':
        return arg
      case 'sudo':
        return t('terminal.sudo')
      default:
        return <span className="text-red-400">{t('terminal.notFound', { cmd: first })}</span>
    }
  }

  const submit = () => {
    const value = input
    setInput('')
    setHistoryIndex(null)
    if (value.trim()) setHistory((h) => [...h, value])
    if (value.trim().toLowerCase() === 'clear') {
      setLines([])
      return
    }
    print(value, PROMPT)
    const output = run(value)
    if (output !== null && output !== '') print(output)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown' && historyIndex !== null) {
      e.preventDefault()
      const i = historyIndex + 1
      setHistoryIndex(i < history.length ? i : null)
      setInput(i < history.length ? history[i] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [cmd, ...rest] = input.split(' ')
      if (rest.length === 0) {
        const match = [...COMMANDS, ...HIDDEN_COMMANDS].find((c) => c.startsWith(cmd.toLowerCase()))
        if (match) setInput(match + ' ')
      } else if (cmd === 'open') {
        const match = DESKTOP_ORDER.find((id) => id.startsWith(rest.join(' ').toLowerCase()))
        if (match) setInput(`open ${match}`)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="h-full min-h-72 overflow-auto bg-[#0d1117] p-4 font-mono text-[13px] leading-relaxed pointer-coarse:text-base text-slate-300"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line) => (
        <div key={line.id} className="break-words whitespace-pre-wrap">
          {line.prompt && <span className="mr-2 text-emerald-400">{line.prompt}</span>}
          {line.content}
        </div>
      ))}
      <div className="flex items-center">
        <label htmlFor="terminal-input" className="mr-2 shrink-0 text-emerald-400">
          {PROMPT}
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-slate-100 caret-emerald-400 outline-none"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
