'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { sendContactEmail } from '@/lib/email';
import { clientIp, rateLimit } from '@/lib/rate-limit';

/**
 * Error keys map to `contact.errors.*` in the message catalogues, so the visitor
 * always sees a message in their own language and the server never composes UI
 * copy.
 */
export type ContactValues = { name: string; email: string; subject: string; message: string };

export type ContactState =
  | { status: 'idle' }
  | { status: 'sent' }
  | {
      status: 'error';
      errors: Partial<Record<'name' | 'email' | 'message' | 'form', string>>;
      /**
       * Echoed back so a rejected submission does not wipe what the visitor
       * typed. The form's inputs are uncontrolled, so without this React
       * re-renders them empty and a long message is simply lost.
       */
      values: ContactValues;
    };

const schema = z.object({
  name: z.string().trim().min(1, 'nameRequired').max(120),
  email: z.email('emailInvalid').max(200),
  subject: z.string().trim().max(160).optional().default(''),
  message: z.string().trim().min(20, 'messageShort').max(4000),
  locale: z.string().max(5),
  /** Hidden field. Bots fill everything; humans never see it. */
  company: z.string().max(0).optional().default(''),
  /** Client-side timestamp of when the form was first rendered. */
  startedAt: z.coerce.number().int().nonnegative(),
});

/** A real person needs longer than this to read the form and type a message. */
const MIN_FILL_MS = 2500;

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  // Read straight off the FormData so the echo survives even a failed parse.
  const submitted: ContactValues = {
    name: asString(formData.get('name')),
    email: asString(formData.get('email')),
    subject: asString(formData.get('subject')),
    message: asString(formData.get('message')),
  };

  if (!parsed.success) {
    const errors: Partial<Record<'name' | 'email' | 'message' | 'form', string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === 'name' || field === 'email' || field === 'message') {
        errors[field] ??= issue.message;
      } else {
        // Honeypot or timestamp tampering — a real user cannot trigger these.
        errors.form ??= 'failed';
      }
    }
    return { status: 'error', errors, values: submitted };
  }

  const data = parsed.data;

  // Layer 1: honeypot. Silently accepted so the bot gets no signal to adapt.
  if (data.company.length > 0) return { status: 'sent' };

  // Layer 2: submission speed.
  if (Date.now() - data.startedAt < MIN_FILL_MS) return { status: 'sent' };

  // Layer 3: per-IP rate limit.
  const requestHeaders = await headers();
  const { ok } = rateLimit(`contact:${clientIp(requestHeaders)}`, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
  });

  if (!ok) return { status: 'error', errors: { form: 'rateLimited' }, values: submitted };

  const result = await sendContactEmail({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    locale: data.locale,
  });

  if (!result.ok) return { status: 'error', errors: { form: 'failed' }, values: submitted };

  return { status: 'sent' };
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : '';
}
