'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useActionState, useId, useRef } from 'react';

import { submitContact } from '@/actions/contact';
import type { ContactState } from '@/actions/contact';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const initialState: ContactState = { status: 'idle' };

const fieldClass =
  'w-full rounded-card border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors focus-visible:border-brand';

export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const ids = useId();

  const startedAtInput = useRef<HTMLInputElement>(null);

  /**
   * Stamps the moment the visitor first touches the form, so the server can
   * reject submissions that arrive impossibly fast.
   *
   * Written on interaction rather than at render for two reasons: reading a ref
   * during render is not allowed, and this page is statically generated — a
   * server-side timestamp would be frozen at build time and never fire.
   * With JS disabled the value stays "0", which the server treats as old
   * enough to pass; the honeypot and rate limit still apply.
   */
  const stampStart = () => {
    const input = startedAtInput.current;
    if (input && input.value === '0') input.value = String(Date.now());
  };

  const errors = state.status === 'error' ? state.errors : {};
  // Echoed back by the action so a rejected submission keeps what was typed.
  const values = state.status === 'error' ? state.values : undefined;

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-panel border border-ai/30 bg-ai-dim p-8 text-center">
        <p className="text-ai">{t('sent')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} onFocusCapture={stampStart} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" defaultValue="0" ref={startedAtInput} />

      {/* Honeypot. Hidden from sight and from assistive tech, but a bot filling
          every input will trip it. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${ids}-company`}>Company</label>
        <input id={`${ids}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id={`${ids}-name`}
        name="name"
        label={t('name')}
        defaultValue={values?.name}
        error={errors.name ? t(`errors.${errors.name}`) : undefined}
        autoComplete="name"
        required
      />

      <Field
        id={`${ids}-email`}
        name="email"
        type="email"
        label={t('email')}
        defaultValue={values?.email}
        error={errors.email ? t(`errors.${errors.email}`) : undefined}
        autoComplete="email"
        required
      />

      <Field
        id={`${ids}-subject`}
        name="subject"
        label={t('subject')}
        defaultValue={values?.subject}
        autoComplete="off"
      />

      <div>
        <label htmlFor={`${ids}-message`} className="mb-1.5 block text-sm text-ink-muted">
          {t('message')}
          <span aria-hidden className="text-heat">
            {' '}
            *
          </span>
        </label>
        <textarea
          id={`${ids}-message`}
          name="message"
          rows={6}
          required
          // `key` forces a fresh uncontrolled node when the echoed value changes,
          // otherwise React keeps the old DOM value and the echo is ignored.
          key={values?.message ?? 'empty'}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${ids}-message-error` : undefined}
          className={cn(fieldClass, 'resize-y', errors.message && 'border-heat')}
        />
        {errors.message && (
          <p id={`${ids}-message-error`} className="mt-1.5 text-sm text-heat">
            {t(`errors.${errors.message}`)}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? t('sending') : t('send')}
        </Button>

        {/* Form-level failures are announced, not just displayed. */}
        <p role="alert" aria-live="polite" className="text-sm text-heat">
          {errors.form ? t(`errors.${errors.form}`) : ''}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  defaultValue,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-ink-muted">
        {label}
        {required && (
          <span aria-hidden className="text-heat">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        key={defaultValue ?? 'empty'}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClass, error && 'border-heat')}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-heat">
          {error}
        </p>
      )}
    </div>
  );
}
