import { getTranslations } from 'next-intl/server';

import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { owner, socials } from '@/content/site';
import { getArchive, getStackFrequency, getWorkGrid } from '@/lib/projects';
import { getGithubStats } from '@/lib/github';

/**
 * The numbers block.
 *
 * Leads with figures derived from the project registry, which are provable by
 * reading this site. GitHub data is appended when the API answers and simply
 * omitted when it does not — so an outage degrades the section instead of
 * breaking the page.
 */
export async function Metrics() {
  const t = await getTranslations('metrics');
  const stats = await getGithubStats();

  const grid = getWorkGrid();
  const systems = grid.length + getArchive().length;
  const technologies = getStackFrequency().length;
  const years = new Date().getFullYear() - owner.since;
  const liveNow = grid.filter((project) => project.status === 'live').length;

  /**
   * All four come from the registry, so every one of them is checkable by
   * reading this site.
   *
   * The public-repository count is deliberately NOT one of them: most of this
   * work sits in private and organisation repos, so the number is low enough to
   * invite exactly the wrong inference. It stays in the note below, where the
   * caveat sits next to it.
   */
  const items = [
    { value: systems, label: t('systems') },
    { value: years, label: t('years') },
    { value: technologies, label: t('technologies') },
    { value: liveNow, label: t('liveNow') },
  ];

  return (
    <section aria-labelledby="metrics-heading" className="border-t border-line">
      <div className="container-page py-20 sm:py-24">
        <Reveal>
          <h2 id="metrics-heading" className="eyebrow">
            {t('title')}
          </h2>

          {/*
            A 1px gap over the line colour draws the dividers between cells, so
            the grid needs no per-cell border rules and none of the usual
            last-child exceptions at each breakpoint. The grid owns the fill, so
            the panel around it is hollow.
          */}
          <div className="panel panel-hollow mt-8 overflow-hidden">
            <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
              {items.map((item) => (
                <div key={item.label} className="bg-surface px-6 py-9 sm:px-7 sm:py-11">
                  <dd className="display-title text-5xl text-ink sm:text-6xl">
                    <Counter value={item.value} />
                  </dd>
                  <dt className="mt-3 text-sm leading-snug text-ink-muted">{item.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {stats && (
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-subtle">
              {t('githubNote')}{' '}
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-ink-muted underline decoration-line-strong underline-offset-2 hover:text-ink"
              >
                {socials.github.replace('https://', '')}
              </a>
              {stats.lastPushedAt && (
                <>
                  {' · '}
                  <span className="nums">
                    {t('lastPush')} {stats.lastPushedAt.slice(0, 10)}
                  </span>
                </>
              )}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
