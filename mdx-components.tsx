import type { MDXComponents } from 'mdx/types';

/**
 * Element mapping for MDX prose.
 *
 * MDX output is not run through a typography plugin — every element is styled
 * here explicitly, so blog posts use the same tokens, rhythm and link treatment
 * as the rest of the site instead of a second, parallel type scale.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => (
      <h2
        className="mt-14 mb-5 scroll-mt-28 text-2xl font-semibold tracking-tight text-ink"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-10 mb-4 scroll-mt-28 text-lg font-semibold text-ink" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-5 text-[1.0625rem] leading-[1.75] text-ink-muted" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-6 space-y-2.5 ps-5" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-6 list-decimal space-y-2.5 ps-6" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li
        className="leading-relaxed text-ink-muted marker:text-ink-subtle [ul_&]:list-disc"
        {...props}
      >
        {children}
      </li>
    ),
    a: ({ children, href, ...props }) => {
      const external = typeof href === 'string' && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-brand underline decoration-brand/35 underline-offset-2 hover:decoration-brand"
          {...props}
        >
          {children}
        </a>
      );
    },
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-ink" {...props}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="mb-6 border-s-2 border-brand ps-5 text-ink-muted italic" {...props}>
        {children}
      </blockquote>
    ),
    hr: (props) => <hr className="my-12 border-line" {...props} />,
    /*
     * rehype-pretty-code wraps highlighted blocks in <pre><code>; keepBackground
     * is off so the surface colour comes from the theme, not from Shiki.
     *
     * That surface is --surface rather than --raised on purpose. The Shiki
     * themes are `github-light` and `github-dark-dimmed`, whose token palettes
     * assume they are painted on their own near-white / near-black background;
     * on the warmer --raised, github-light's function-name violet measures
     * 4.39:1 and fails AA. --surface is the closest thing the palette has to
     * what those themes were designed against, and clears every token.
     */
    pre: ({ children, ...props }) => (
      <pre
        className="mb-6 overflow-x-auto rounded-card border border-line bg-surface p-4 text-[13px] leading-relaxed"
        // Code is left-to-right even inside an RTL page.
        dir="ltr"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded-sm bg-raised px-1.5 py-0.5 font-mono text-[0.9em] text-ink [pre_&]:bg-transparent [pre_&]:p-0"
        {...props}
      >
        {children}
      </code>
    ),
    table: ({ children, ...props }) => (
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="border-b border-line pb-2 text-start font-medium text-ink" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-b border-line py-2.5 text-ink-muted" {...props}>
        {children}
      </td>
    ),
    ...components,
  };
}
