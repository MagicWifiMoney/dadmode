export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dadmode.app').replace(/\/$/, '');
export const siteName = 'DadMode';
export const siteTitle = 'DadMode — Your Pregnancy Companion';
// Kept under 160 characters for search-result snippets.
export const siteDescription =
  "A week-by-week pregnancy companion for dads: what's happening with the baby, what your partner is feeling, and a practical dad tip every week.";
// Stable date for sitemap <lastmod>. Bump when page content meaningfully changes
// — using a build-time `new Date()` would change every deploy and teach crawlers
// to ignore the tag.
export const lastContentUpdate = new Date('2026-06-10');
