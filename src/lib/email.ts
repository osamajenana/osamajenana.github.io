import { Resend } from 'resend';

import { owner } from '@/content/site';

/**
 * Contact-form delivery over the Resend HTTPS API rather than SMTP from the VPS.
 * A fresh VPS IP has no sending reputation, so SMTP mail from it lands in spam;
 * Resend sends from an authenticated domain instead.
 */

type SendResult = { ok: true } | { ok: false; reason: 'unconfigured' | 'failed' };

function config() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO ?? owner.email;

  if (!apiKey || !from) return null;
  return { apiKey, from, to };
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}): Promise<SendResult> {
  const settings = config();

  if (!settings) {
    // Loud in the log, graceful to the visitor. Never pretend a message was
    // delivered when it was not — that was the whole failure of the old site.
    console.error(
      '[contact] RESEND_API_KEY or CONTACT_FROM is not set — message not sent.',
      `from=${input.email}`,
    );
    return { ok: false, reason: 'unconfigured' };
  }

  const resend = new Resend(settings.apiKey);

  try {
    const { error } = await resend.emails.send({
      from: settings.from,
      to: settings.to,
      replyTo: input.email,
      subject: `[Portfolio] ${input.subject || 'New message'} — ${input.name}`,
      text: [
        `Name:    ${input.name}`,
        `Email:   ${input.email}`,
        `Subject: ${input.subject || '(none)'}`,
        `Locale:  ${input.locale}`,
        '',
        input.message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend rejected the message:', error);
      return { ok: false, reason: 'failed' };
    }

    return { ok: true };
  } catch (error) {
    console.error('[contact] Resend threw:', error);
    return { ok: false, reason: 'failed' };
  }
}
