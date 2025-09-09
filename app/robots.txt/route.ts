import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host');
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const base = host ? `${proto}://${host}` : '';

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

