/**
 * Types for `.mdx` imports.
 *
 * `@types/mdx` ships an equivalent declaration, but its index.d.ts is a module
 * rather than a global script, so the ambient `declare module '*.mdx'` inside it
 * is not contributed to the program automatically. Declaring it here is explicit
 * and does not depend on that package's internal shape.
 */
declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { JSX } from 'react';

  const MDXComponent: (props: MDXProps) => JSX.Element;
  export default MDXComponent;
}
