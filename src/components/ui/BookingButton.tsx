import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

import { ButtonAnchor } from '@/components/ui/Button';
import { bookingHref } from '@/lib/booking';

/**
 * The booking link and its label, resolved for the active locale.
 *
 * Exposed for the header, which draws its own compact pill rather than a
 * `Button`. `useTranslations` rather than `getTranslations` because that pill
 * lives in a client component while every other caller is a server one, and
 * the hook is the form that works in both.
 */
export function useBookingLink(): { href: string; label: string } {
  const t = useTranslations('booking');

  return { href: bookingHref(t('whatsappMessage')), label: t('cta') };
}

/**
 * "Book a consultation".
 *
 * Its own component for the same reason the CV download is: no caller should
 * have to know where the button currently leads, or remember to localise the
 * message a WhatsApp chat opens with. See content/site.ts for the destination.
 */
export function BookingButton({
  variant = 'secondary',
  size = 'md',
  className,
}: Pick<ComponentProps<typeof ButtonAnchor>, 'variant' | 'size' | 'className'>) {
  const { href, label } = useBookingLink();

  return (
    <ButtonAnchor href={href} variant={variant} size={size} className={className}>
      {label}
    </ButtonAnchor>
  );
}
