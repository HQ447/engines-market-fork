import { SITE_URL } from "@/lib/site";

const canonicalSiteUrl = new URL(SITE_URL);
const canonicalOrigin = canonicalSiteUrl.origin;
const canonicalHost = canonicalSiteUrl.host;
const wwwHost = canonicalHost.startsWith("www.")
  ? canonicalHost
  : `www.${canonicalHost}`;

/** Allow all crawlers on all URLs. Served at /robots.txt */
const buildRobotsTxt = () =>
  `User-agent: *
Allow: /

Sitemap: ${canonicalOrigin}/sitemap.xml
`;

export function GET(request: Request) {
  const requestUrl = new URL(request.url);

  if (requestUrl.host === wwwHost) {
    return Response.redirect(`${canonicalOrigin}/robots.txt`, 308);
  }

  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
