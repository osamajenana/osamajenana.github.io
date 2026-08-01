import { NextResponse } from 'next/server';

import { cv } from '@/content/site';

/**
 * Legacy CV endpoint.
 *
 * This route used to generate an ATS-plain PDF from the resume data. It no
 * longer does: the CV that goes out is the designed document in public/, which
 * is the one that gets kept up to date and the one a client should receive.
 * Two CVs that can disagree is one CV too many.
 *
 * Kept as a redirect because the old filename redirect in next.config.ts points
 * at it, and because /api/cv is what was published while the generator existed.
 */
export function GET(request: Request) {
  return NextResponse.redirect(new URL(cv.file, request.url), 308);
}
