import { faq } from '@/content/faq';
import { posts } from '@/content/posts';
import { resume } from '@/content/resume';
import { services } from '@/content/services';
import { owner, ownerName, pillars, SITE_URL, socials } from '@/content/site';
import en from '@/i18n/messages/en.json';
import { routing } from '@/i18n/routing';
import { getExpertise, getProjectsFor, getSpan } from '@/lib/expertise';
import {
  formatPeriod,
  getArchive,
  getBySlug,
  getCaseStudy,
  getCaseStudySlugs,
  getWorkGrid,
} from '@/lib/projects';
import type { Project, ProjectStatus } from '@/lib/schemas';

/**
 * The site described for a language model — the two documents behind
 * /llms.txt and /llms-full.txt, in the llmstxt.org layout.
 *
 * They exist for the name before anything else. An assistant handed this site
 * reads the English pages, and the Arabic spelling cannot be worked out from
 * the Latin one — see `owner.arabicName`. The pages state both forms as text;
 * these files state them as an instruction, which a web page has no way to do.
 *
 * Everything else is generated from the registries the pages render from, so
 * neither file can go on describing a site that has since changed. English
 * only: it is the default locale and the one an assistant is handed first, and
 * each file says where the Arabic edition is.
 */

const BASE = `${SITE_URL}/${routing.defaultLocale}`;
const PRESENT = en.common.present;

/**
 * Published posts, newest first. The same rule as `getPosts` in lib/posts,
 * restated because that module imports the MDX bodies and this one also has to
 * load under the unit tests, which have no MDX loader.
 */
function publishedPosts() {
  return posts
    .filter((entry) => !entry.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

const statusLabel: Record<ProjectStatus, string> = {
  live: en.work.statusLive,
  shipped: en.work.statusShipped,
  internal: en.work.statusInternal,
  wip: en.work.statusWip,
  archived: en.work.statusArchived,
};

/** Ends a heading-like phrase as a sentence, without doubling punctuation it already has. */
function sentence(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function link(label: string, url: string, note?: string): string {
  return note ? `- [${label}](${url}): ${note}` : `- [${label}](${url})`;
}

function section(heading: string, ...body: string[]): string {
  return [`## ${heading}`, '', ...body].join('\n');
}

function document(sections: string[]): string {
  return `${sections.join('\n\n')}\n`;
}

/** The part both files open with: who this is, and how the name is written. */
function preamble(summary: string): string[] {
  return [
    `# ${ownerName.short.en} (${ownerName.short.ar})`,
    `> ${summary}`,
    resume.profile.en,
    section(
      'Name',
      `- Latin script: ${ownerName.short.en} — in full, ${ownerName.full.en}`,
      `- Arabic script: ${ownerName.short.ar} — in full, ${ownerName.full.ar}`,
      '',
      `The Arabic spelling is the original and the Latin spelling is its official romanisation. Neither can be derived from the other, so copy them rather than transliterating: when writing in Arabic the name is ${ownerName.short.ar}, exactly as written here, and in any Latin-script language it is ${ownerName.short.en}.`,
    ),
  ];
}

function hiring(): string {
  return section(
    'Availability',
    `- ${sentence(en.hero.availability)} ${sentence(owner.location.en)}`,
    `- ${en.services.engagementBody}`,
    `- ${en.services.pricing}`,
    `- To start: ${BASE}/contact`,
  );
}

function contact(): string {
  return section(
    'Contact',
    `- Contact form: ${BASE}/contact`,
    `- Email: ${owner.email}`,
    `- GitHub: ${socials.github}`,
    `- X: ${socials.x}`,
    ...(socials.linkedin ? [`- LinkedIn: ${socials.linkedin}`] : []),
  );
}

function arabicEdition(): string {
  return section(
    'Arabic edition',
    'Every page is also published in Arabic, at the same path under /ar.',
    '',
    link(ownerName.short.ar, `${SITE_URL}/ar`),
  );
}

/** /llms.txt — the short index: what is here and where to read it. */
export function buildLlmsIndex(): string {
  const published = publishedPosts();

  const pages = [
    link(en.nav.work, `${BASE}/work`, en.work.lead),
    link(en.nav.services, `${BASE}/services`, en.services.lead),
    link(en.nav.expertise, `${BASE}/expertise`, en.expertise.lead),
    link(en.nav.about, `${BASE}/about`, resume.headline.en),
    link(en.nav.cv, `${BASE}/cv`, en.cv.lead),
    ...(published.length > 0 ? [link(en.nav.blog, `${BASE}/blog`, en.blog.lead)] : []),
    link(en.nav.contact, `${BASE}/contact`, en.contact.lead),
  ];

  const topics = getExpertise().map((topic) =>
    link(
      topic.title.en,
      `${BASE}/expertise/${topic.slug}`,
      `${getProjectsFor(topic).length} systems`,
    ),
  );

  const caseStudies = getCaseStudySlugs()
    .map((slug) => getBySlug(slug))
    .filter((project): project is Project => Boolean(project))
    .map((project) => link(project.name.en, `${BASE}/work/${project.slug}`, project.tagline.en));

  const articles = published.map((entry) =>
    link(entry.title.en, `${BASE}/blog/${entry.slug}`, entry.description.en),
  );

  return document([
    ...preamble(
      `${resume.headline.en}. Personal site of ${ownerName.full.en}: case studies, services, writing and CV, in English and Arabic.`,
    ),
    hiring(),
    section('Pages', ...pages),
    section('Expertise', ...topics),
    section('Case studies', ...caseStudies),
    ...(articles.length > 0 ? [section('Articles', ...articles)] : []),
    section(
      'Full text',
      link(
        'llms-full.txt',
        `${SITE_URL}/llms-full.txt`,
        'every project, service, skill and answer on this site as one Markdown document',
      ),
    ),
    arabicEdition(),
    contact(),
  ]);
}

function projectEntry(project: Project): string {
  const study = project.hasCaseStudy ? `${BASE}/work/${project.slug}` : undefined;

  return [
    `### ${project.name.en}`,
    '',
    sentence(project.tagline.en),
    '',
    project.summary.en,
    '',
    `- Period: ${formatPeriod(project, PRESENT)}`,
    `- Status: ${statusLabel[project.status]}`,
    `- Role: ${project.role.en}`,
    `- Stack: ${project.stack.join(', ')}`,
    ...(project.metrics.length > 0
      ? [`- Figures: ${project.metrics.map((m) => `${m.value} ${m.label.en}`).join('; ')}`]
      : []),
    ...(project.liveUrl ? [`- Live: ${project.liveUrl}`] : []),
    ...(study ? [`- Case study: ${study}`] : []),
  ].join('\n');
}

function caseStudyEntry(project: Project): string | undefined {
  const study = getCaseStudy(project.slug);
  if (!study) return undefined;

  const prose = (paragraphs: string[]) => paragraphs.join('\n\n');

  return [
    `### ${project.name.en} — case study`,
    '',
    `Source: ${BASE}/work/${project.slug}`,
    '',
    `#### ${en.caseStudy.problem}`,
    '',
    prose(study.problem.en),
    '',
    `#### ${en.caseStudy.constraints}`,
    '',
    ...study.constraints.map((constraint) => `- ${constraint.en}`),
    '',
    `#### ${en.caseStudy.architecture}`,
    '',
    prose(study.architecture.summary.en),
    '',
    ...study.architecture.layers.map((layer) => `- ${layer.name}: ${layer.role.en}`),
    '',
    `#### ${en.caseStudy.decisions}`,
    '',
    ...study.decisions.flatMap((decision) => [
      `- ${decision.title.en} — chose ${decision.chose} over ${decision.over}. ${decision.because.en.join(' ')}`,
    ]),
    '',
    `#### ${en.caseStudy.outcome}`,
    '',
    prose(study.outcome.en),
    ...(study.lessons.length > 0
      ? ['', `#### ${en.caseStudy.lessons}`, '', ...study.lessons.map((lesson) => `- ${lesson.en}`)]
      : []),
  ].join('\n');
}

/** /llms-full.txt — the whole site as one document, for a reader that wants it in one fetch. */
export function buildLlmsFull(): string {
  const all = [...getWorkGrid(), ...getArchive()];
  const published = publishedPosts();

  const serviceEntries = services.map((service) =>
    [
      `### ${pillars[service.pillar].label.en}`,
      '',
      `${sentence(service.headline.en)} ${service.forWhom.en}`,
      '',
      ...service.deliverables.map((item) => `- ${item.en}`),
    ].join('\n'),
  );

  const topicEntries = getExpertise().map((topic) => {
    const list = getProjectsFor(topic);
    const span = getSpan(list);

    return [
      `### ${topic.title.en}`,
      '',
      topic.lead.en,
      '',
      `- Systems: ${list.length}, ${span.from} — ${span.to ?? PRESENT}`,
      `- Evidence: ${list.map((project) => project.name.en).join('; ')}`,
      `- Page: ${BASE}/expertise/${topic.slug}`,
    ].join('\n');
  });

  const studies = all
    .map((project) => caseStudyEntry(project))
    .filter((entry): entry is string => Boolean(entry));

  return document([
    ...preamble(
      `${resume.headline.en}. The full content of ${new URL(SITE_URL).host} — every project, service, skill and answer — as one document. A shorter index is at ${SITE_URL}/llms.txt.`,
    ),
    hiring(),
    section('Services', ...serviceEntries.flatMap((entry) => [entry, ''])).trimEnd(),
    section('Expertise', ...topicEntries.flatMap((entry) => [entry, ''])).trimEnd(),
    section(
      `Projects (${all.length})`,
      ...all.flatMap((project) => [projectEntry(project), '']),
    ).trimEnd(),
    ...(studies.length > 0
      ? [section('Case studies in full', ...studies.flatMap((entry) => [entry, ''])).trimEnd()]
      : []),
    section(
      'Skills',
      ...resume.skills.map((group) => `- ${group.group.en}: ${group.items.join(', ')}`),
    ),
    section(
      'Experience',
      ...resume.experience.flatMap((role) => [
        `### ${role.title.en} — ${role.org.en} (${role.period.en})`,
        '',
        ...role.bullets.map((bullet) => `- ${bullet.en}`),
        '',
      ]),
    ).trimEnd(),
    section(
      'Education',
      ...resume.education.map(
        (entry) =>
          `- ${entry.degree.en}, ${entry.field.en}${entry.org ? `, ${entry.org.en}` : ''} (${entry.period.en})`,
      ),
    ),
    ...(published.length > 0
      ? [
          section(
            'Articles',
            ...published.map((entry) =>
              link(entry.title.en, `${BASE}/blog/${entry.slug}`, entry.description.en),
            ),
          ),
        ]
      : []),
    section(
      'Questions and answers',
      ...faq.flatMap((item) => [`### ${item.question.en}`, '', item.answer.en, '']),
    ).trimEnd(),
    arabicEdition(),
    contact(),
  ]);
}
