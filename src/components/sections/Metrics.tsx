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
    <section aria-labelledby="metrics-heading" className="border-t border-line bg-surface">
      <div className="container-page py-16 sm:py-20">
        <Reveal>
          <h2
            id="metrics-heading"
            className="font-mono text-xs tracking-widest text-ink-subtle uppercase"
          >
            {t('title')}
          </h2>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {items.map((item) => (
              <div key={item.label}>
                <dd className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  <Counter value={item.value} />
                </dd>
                <dt className="mt-2 text-sm leading-snug text-ink-muted">{item.label}</dt>
              </div>
            ))}
          </dl>

          {stats && (
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-subtle">
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
