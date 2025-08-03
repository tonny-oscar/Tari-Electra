export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

User-agent: *
Disallow: /admin/
Disallow: /customer/
Disallow: /api/

Sitemap: https://tari-electra.vercel.app/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}