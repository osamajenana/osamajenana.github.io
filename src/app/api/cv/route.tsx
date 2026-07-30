import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer';

import { RESUME_UPDATED, resume } from '@/content/resume';
import { owner } from '@/content/site';
import { formatPeriod, getBySlug } from '@/lib/projects';

/**
 * ATS-oriented English CV.
 *
 * Deliberate choices:
 *  - Built-in Helvetica only. No font registration, no asset to ship, and the
 *    text layer is guaranteed extractable — which is the entire point of an ATS
 *    CV. A designed PDF that a parser reads as gibberish is worse than useless.
 *  - Single column, no tables, no graphics. Multi-column layouts are the most
 *    common reason parsers scramble a CV's reading order.
 *  - English only. Arabic is served by /cv + browser Print, because PDF
 *    generators do not shape Arabic script or handle bidi correctly.
 */

const COLORS = {
  ink: '#111111',
  muted: '#3a3a3a',
  subtle: '#6b6b6b',
  rule: '#cccccc',
};

const s = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 44,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.45,
    color: COLORS.muted,
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 19, color: COLORS.ink, letterSpacing: -0.3 },
  headline: { fontSize: 10, color: COLORS.muted, marginTop: 3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 7, gap: 10 },
  contactItem: { fontSize: 9, color: COLORS.subtle },
  rule: { borderBottomWidth: 0.7, borderBottomColor: COLORS.rule, marginTop: 12 },

  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    letterSpacing: 1.1,
    color: COLORS.subtle,
    marginTop: 16,
    marginBottom: 7,
  },

  roleHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  roleTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: COLORS.ink },
  rolePeriod: { fontSize: 9, color: COLORS.subtle },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 },
  bulletMark: { width: 9, color: COLORS.subtle },
  bulletText: { flex: 1 },
  entry: { marginBottom: 10 },

  skillRow: { flexDirection: 'row', marginBottom: 3.5 },
  skillGroup: { width: 96, fontFamily: 'Helvetica-Bold', fontSize: 9, color: COLORS.ink },
  skillItems: { flex: 1, fontSize: 9 },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: COLORS.subtle,
  },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function CvDocument() {
  const selected = resume.selectedProjects
    .map((slug) => getBySlug(slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <Document
      title={`${owner.fullName} — CV`}
      author={owner.fullName}
      subject={resume.headline.en}
      keywords="Full-Stack Engineer, Laravel, Vue, Next.js, Node.js, Flutter, AI, Python, Docker, REST API"
      creator={owner.fullName}
      producer={owner.fullName}
    >
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{resume.name.en}</Text>
        <Text style={s.headline}>{resume.headline.en}</Text>

        <View style={s.contactRow}>
          <Text style={s.contactItem}>{resume.email}</Text>
          <Text style={s.contactItem}>{resume.whatsapp}</Text>
          <Text style={s.contactItem}>{resume.website.replace('https://', '')}</Text>
          <Text style={s.contactItem}>{resume.location.en}</Text>
          {resume.links
            .filter((link) => link.label !== 'Portfolio')
            .map((link) => (
              <Text key={link.label} style={s.contactItem}>
                {link.url.replace('https://', '')}
              </Text>
            ))}
        </View>

        <View style={s.rule} />

        <Section title="Profile">
          <Text>{resume.profile.en}</Text>
        </Section>

        <Section title="Experience">
          {resume.experience.map((role) => (
            <View key={`${role.title.en}-${role.period.en}`} style={s.entry} wrap={false}>
              <View style={s.roleHeader}>
                <Text style={s.roleTitle}>
                  {role.title.en} — {role.org.en}
                </Text>
                <Text style={s.rolePeriod}>{role.period.en}</Text>
              </View>
              {role.bullets.map((bullet) => (
                <View key={bullet.en} style={s.bulletRow}>
                  <Text style={s.bulletMark}>•</Text>
                  <Text style={s.bulletText}>{bullet.en}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>

        <Section title="Selected projects">
          {selected.map((project) => (
            <View key={project.slug} style={s.entry} wrap={false}>
              <View style={s.roleHeader}>
                <Text style={s.roleTitle}>{project.name.en}</Text>
                <Text style={s.rolePeriod}>{formatPeriod(project, 'Present')}</Text>
              </View>
              <Text>{project.tagline.en}</Text>
              <Text style={{ fontSize: 8.5, color: COLORS.subtle, marginTop: 2 }}>
                {project.stack.slice(0, 7).join(' · ')}
              </Text>
            </View>
          ))}
          <Text style={{ fontSize: 8.5, color: COLORS.subtle }}>
            Full case studies and 35+ further projects: {resume.website.replace('https://', '')}
          </Text>
        </Section>

        <Section title="Skills">
          {resume.skills.map((group) => (
            <View key={group.group.en} style={s.skillRow} wrap={false}>
              <Text style={s.skillGroup}>{group.group.en}</Text>
              <Text style={s.skillItems}>{group.items.join(' · ')}</Text>
            </View>
          ))}
        </Section>

        <Section title="Education">
          {resume.education.map((entry) => (
            <View key={`${entry.degree.en}-${entry.period.en}`} style={s.roleHeader} wrap={false}>
              <Text style={s.roleTitle}>
                {entry.degree.en}, {entry.field.en} — {entry.org.en}
              </Text>
              <Text style={s.rolePeriod}>{entry.period.en}</Text>
            </View>
          ))}
        </Section>

        <View style={s.footer} fixed>
          <Text>{owner.fullName}</Text>
          <Text>Updated {RESUME_UPDATED}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function GET(request: Request) {
  const buffer = await renderToBuffer(<CvDocument />);
  const year = RESUME_UPDATED.slice(0, 4);

  // `?inline` previews in the browser's PDF viewer instead of downloading —
  // useful for linking someone straight at the document.
  const inline = new URL(request.url).searchParams.has('inline');

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      // No spaces in the filename — the legacy site's CV link broke on exactly that.
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="Osama_Jenana_CV_${year}.pdf"`,
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
