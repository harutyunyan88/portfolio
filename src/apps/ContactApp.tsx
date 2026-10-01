import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiAlertCircle, FiCheckCircle, FiMapPin, FiSend } from 'react-icons/fi'
import { CONTACTS } from '../data/profile'
import { ContactError, contactSchema, sendContactMessage, type ContactInput } from '../lib/contact'
import { AppPage } from './ui'

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '', website: '' }
const EMAIL = CONTACTS.find((c) => c.id === 'email')!.value

export default function ContactApp() {
  const { t } = useTranslation()

  return (
    <AppPage title={t('apps.contact')} intro={t('contact.intro')}>
      <div className="grid gap-6 @2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ul className="space-y-2">
          {CONTACTS.map(({ id, icon: Icon, value, href }) => (
            <li key={id}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3 transition hover:border-accent/40 hover:bg-accent-soft"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted">{t(`contact.labels.${id}`)}</span>
                  <span className="block truncate text-sm font-medium">{value}</span>
                </span>
              </a>
            </li>
          ))}
          <li className="flex items-center gap-3 p-3 text-sm text-muted">
            <FiMapPin aria-hidden /> {t('profile.location')}
          </li>
        </ul>

        <ContactForm />
      </div>
    </AppPage>
  )
}

function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'rateLimited'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: EMPTY })

  const onSubmit = async (data: ContactInput) => {
    setStatus('idle')
    try {
      await sendContactMessage(data)
      reset(EMPTY)
      setStatus('success')
    } catch (err) {
      setStatus(err instanceof ContactError && err.status === 429 ? 'rateLimited' : 'error')
    }
  }

  const errorText = (key?: string) => (key ? t(`contact.validation.${key}`) : undefined)

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-8 text-center">
        <FiCheckCircle className="size-10 text-emerald-500" aria-hidden />
        <p className="font-medium">{t('contact.form.success')}</p>
        <button type="button" onClick={() => setStatus('idle')} className="text-sm text-accent hover:underline">
          {t('contact.form.sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-2xl border border-border bg-surface-2/60 p-5"
    >
      <h3 className="font-semibold">{t('contact.form.title')}</h3>

      <div className="grid gap-4 @lg:grid-cols-2">
        <Field id="contact-name" label={t('contact.form.name')} error={errorText(errors.name?.message)}>
          <input id="contact-name" autoComplete="name" {...register('name')} className={inputClass(!!errors.name)} />
        </Field>
        <Field id="contact-email" label={t('contact.form.email')} error={errorText(errors.email?.message)}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>

      <Field
        id="contact-subject"
        label={t('contact.form.subject')}
        hint={t('contact.form.subjectOptional')}
        error={errorText(errors.subject?.message)}
      >
        <input id="contact-subject" {...register('subject')} className={inputClass(!!errors.subject)} />
      </Field>

      <Field id="contact-message" label={t('contact.form.message')} error={errorText(errors.message?.message)}>
        <textarea
          id="contact-message"
          rows={5}
          {...register('message')}
          className={clsx(inputClass(!!errors.message), 'resize-y')}
        />
      </Field>

      {/* Honeypot, visually hidden and skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {(status === 'error' || status === 'rateLimited') && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden />
          {status === 'rateLimited'
            ? t('contact.form.rateLimited', { email: EMAIL })
            : t('contact.form.error', { email: EMAIL })}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <FiSend aria-hidden /> {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  )
}

type FieldProps = { id: string; label: string; hint?: string; error?: string; children: ReactNode }

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label} {hint && <span className="font-normal text-muted">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

const inputClass = (invalid: boolean) =>
  clsx(
    'w-full rounded-lg border bg-surface-solid px-3 py-2 text-sm outline-none transition focus:ring-2',
    invalid ? 'border-red-500 focus:ring-red-500/30' : 'border-border focus:border-accent focus:ring-accent/25',
  )
