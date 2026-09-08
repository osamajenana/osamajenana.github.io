import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { company, legalItems } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { LegalDocument as LegalDocumentData } from '@/lib/schemas';

/**
 * Renders a privacy policy, terms of service or data deletion page.
 *
 * One component for all three because a reviewer reads them back to back and
 * an inconsistency between them reads as carelessness about the thing they
 * describe. The contents list is a real in-page nav — these documents are long,
 * and a policy nobody can navigate is a policy nobody reads.
 *
 * Everything is logical-property styled (`ps-`, `border-s`, `text-start`), so
 * the Arabic version mirrors rather than merely translating.
 */
export async function LegalDocumentPage({
  document,
  locale,
}: {
  document: LegalDocumentData;
  locale: Locale;
}) {
  const t = await getTranslations('legal');
  const footer = await getTranslations('footer');

  const updated = new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    numberingSystem: 'latn',
  }).format(new Date(document.updatedAt));

  return (
    <main id="main">
      <PageHeader title={document.title[locale]} lead={document.lead[locale]}>
        <p className="mt-6 font-mono text-xs text-ink-subtle">
          {t('updated')}:{' '}
          <time dateTime={document.updatedAt} className="nums">
            {updated}
          </time>
        </p>
      </PageHeader>

      <div className="container-page grid gap-12 pt-14 pb-24 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        {/* ---- contents ---- */}
        {/* The list is long; on a phone it sits as a plain block above the text
            rather than as a sticky rail that would eat the viewport. */}
        <nav aria-label={t('contents')} className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-4">{t('contents')}</p>
          <ol className="space-y-2 border-s border-line ps-4">
            {document.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  <span className="nums me-2 text-ink-subtle">{index + 1}.</span>
                  {section.heading[locale]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ---- the document ---- */}
        <div className="max-w-3xl space-y-14">
          {document.sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2
                id={`${section.id}-heading`}
                className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
              >
                <span className="nums me-3 text-base font-normal text-ink-subtle">
                  {index + 1}.
                </span>
                {section.heading[locale]}
              </h2>

              {section.body && (
                <div className="mt-5 space-y-4">
                  {/* Contact blocks are authored with newlines and have to keep
                      them; ordinary prose is unaffected by the rule. */}
                  {section.body[locale].map((paragraph) => (
                    <p
                      key={paragraph}
                      className="leading-relaxed whitespace-pre-line text-ink-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {section.items.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.en} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-brand" />
                      <span className="leading-relaxed text-ink-muted">{item[locale]}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.rows.length > 0 && (
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {section.rows.map((row) => (
                    <div
                      key={row.term.en}
                      className="grid gap-1.5 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <dt className="text-sm font-medium text-ink">{row.term[locale]}</dt>
                      <dd className="text-sm leading-relaxed text-ink-muted">
                        {row.detail[locale]}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}

          {/* ---- issuer ---- */}
          <footer className="rounded-panel border border-line bg-raised p-6 text-sm text-ink-muted">
            <p className="eyebrow mb-3">{t('issuedBy')}</p>
            <p className="font-medium text-ink">{company.legalName[locale]}</p>
            <p className="mt-1">{company.address[locale]}</p>
            {/*
              Underlined, not merely tinted. This is a link sitting inside a
              block of running text, where colour alone is not a sufficient
              distinguisher — axe flags it as `link-in-text-block`, and it is
              right to: the brand blue against muted ink does not clear 3:1.
            */}
            <p className="mt-3">
              {t('contactLine')}{' '}
              <a
                href={`mailto:${company.email}`}
                className="break-words text-brand underline decoration-brand/40 underline-offset-2 transition-colors hover:text-brand-strong hover:decoration-brand"
              >
                {company.email}
              </a>
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-xs">
              {legalItems
                .filter((item) => item.href !== `/${document.slug}`)
                .map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-ink-subtle underline decoration-line-strong underline-offset-2 transition-colors hover:text-ink"
                    >
                      {footer(item.key)}
                    </Link>
                  </li>
                ))}
            </ul>
          </footer>
        </div>
      </div>
    </main>
  );
}
