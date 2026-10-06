import { booking, owner } from '@/content/site';

/**
 * Whether "Book a consultation" opens a real calendar yet.
 *
 * The services page and anything else that already offers WhatsApp beside it
 * read this: there the booking button is only worth showing once it leads
 * somewhere the WhatsApp button does not.
 */
export const hasScheduler = Boolean(booking.calUsername);

/**
 * Where "Book a consultation" leads.
 *
 * `whatsappMessage` is what the fallback chat opens with, in the visitor's own
 * language — it is a sentence they are about to send, so it comes from the
 * message catalogue rather than from here.
 */
export function bookingHref(whatsappMessage: string): string {
  if (booking.calUsername) {
    return `https://cal.com/${booking.calUsername}/${booking.calEvent}`;
  }

  return `https://wa.me/${owner.whatsapp.e164}?text=${encodeURIComponent(whatsappMessage)}`;
}
