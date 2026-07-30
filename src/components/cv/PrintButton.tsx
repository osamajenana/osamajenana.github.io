'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

/**
 * Printing from the browser is the correct path for the Arabic CV: browsers run
 * a full bidi and Arabic shaping engine, whereas PDF generators emit
 * disconnected letterforms. The print stylesheet on /cv is built for this.
 */
export function PrintButton({ variant = 'secondary' }: { variant?: 'primary' | 'secondary' }) {
  const t = useTranslations('cv');

  return (
    <Button variant={variant} onClick={() => window.print()}>
      {t('print')}
    </Button>
  );
}
