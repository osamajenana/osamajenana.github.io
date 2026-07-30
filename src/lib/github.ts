import { socials } from '@/content/site';

/**
 * Live public GitHub figures.
 *
 * Two honesty caveats that the UI must carry, not hide:
 *  - Public repositories are a floor, not a total. Most client work lives in
 *    private repos and in organisations, so this understates the volume.
 *  - Stars are not a quality signal for client software nobody was told about.
 *    They are reported because they are verifiable, not because they are proof.
 *
 * A token is optional: unauthenticated requests are capped at 60/hour per IP,
 * which the one-hour revalidate window comfortably fits. `GITHUB_TOKEN` raises
 * that to 5,000/hour and is worth setting on the VPS.
 */

export type GithubStats = {
  publicRepos: number;
  stars: number;
  /** Distinct primary languages across public repos, most frequent first. */
  languages: string[];
  /** ISO date of the most recent push to any public repo. */
  lastPushedAt: string | null;
};

type Repo = {
  stargazers_count: number;
  language: string | null;
  pushed_at: string | null;
  fork: boolean;
};

const ACCOUNTS = ['osamajenana', 'Muscat-Apps'] as const;

async function fetchRepos(account: string): Promise<Repo[]> {
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(
    `https://api.github.com/users/${account}/repos?per_page=100&sort=pushed`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Refreshed hourly; the pages that use this stay static in between.
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub responded ${response.status} for ${account}`);
  }

  return (await response.json()) as Repo[];
}

/**
 * Returns `null` on any failure. The stats block is an enhancement, so a rate
 * limit or an outage must degrade the section — never fail the build or the page.
 */
export async function getGithubStats(): Promise<GithubStats | null> {
  try {
    const lists = await Promise.all(ACCOUNTS.map(fetchRepos));
    // Forks are someone else's work; counting them would be padding.
    const repos = lists.flat().filter((repo) => !repo.fork);

    if (repos.length === 0) return null;

    const languageCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
      }
    }

    const pushDates = repos
      .map((repo) => repo.pushed_at)
      .filter((date): date is string => Boolean(date))
      .sort();

    return {
      publicRepos: repos.length,
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      languages: [...languageCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([language]) => language),
      lastPushedAt: pushDates.at(-1) ?? null,
    };
  } catch (error) {
    console.error('[github] stats unavailable:', error);
    return null;
  }
}

export const githubProfileUrl = socials.github;
