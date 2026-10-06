import type { JsonLdNode } from '@/lib/structured-data';

/**
 * One JSON-LD block.
 *
 * `<` is written as its escape so that no string value — a project summary, a
 * post title — can contain a literal `</script>` and end the element early.
 * JSON parsers read the escape back as the character, so the data is unchanged.
 */
export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
