// Public address of the site for files built ahead of time (sitemap, robots, metadata):
// no request there to read the host from. Set NEXT_PUBLIC_SITE_URL in production.
export const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
