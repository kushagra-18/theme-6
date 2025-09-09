import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
  const headersList = request.headers;
  const host = headersList.get('x-nginx-domain') || headersList.get('host') || '';

  // First, try API which may return XML directly or JSON with sitemap/sitemapUrl
  try {
    const res = await fetch(`${API_BASE}/public/site/sitemap`, {
      headers: {
        'X-domain': host,
        'X-public-site': 'true',
        'Accept': 'application/xml, text/xml, application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('xml') || contentType.includes('text')) {
      const xml = await res.text();
      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    // JSON response handling
    const data = await res.json();
    if (typeof data === 'string') {
      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
    if (data?.sitemap) {
      return new NextResponse(data.sitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
    if (data?.sitemapUrl) {
      const smRes = await fetch(data.sitemapUrl, { cache: 'no-store' });
      const xml = await smRes.text();
      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
    throw new Error('No sitemap content');
  } catch (apiError) {
    // Fallback: minimal sitemap with homepage
    const base = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://${host}`;
    const basic = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(basic, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600, s-maxage=600',
      },
    });
  }
}

