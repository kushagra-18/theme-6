import { NextRequest, NextResponse } from 'next/server';
import { getSSRBlazeBlogClient } from '@/lib/blazeblog';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
  const headersList = request.headers;
  const host = headersList.get('x-nginx-domain') || headersList.get('host') || '';
  const endpoints = ['/public/site/rss', '/public/rss', '/public/feed'];

  // Try API endpoints directly as XML/text
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API_BASE}${ep}`, {
        headers: {
          'X-domain': host,
          'X-public-site': 'true',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();
      if (text && (contentType.includes('xml') || contentType.includes('text') || text.startsWith('<?xml'))) {
        return new NextResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        });
      }
    } catch {
      // try next endpoint
    }
  }

  // Fallback: generate simple RSS from recent posts
  try {
    const client = await getSSRBlazeBlogClient();
    const [postsResult, siteConfig] = await Promise.all([
      client.getPosts({ limit: 20, page: 1 }),
      client.getSiteConfig(),
    ]);

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://${host}`;

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.siteConfig.h1}]]></title>
    <description><![CDATA[${siteConfig.siteConfig.homeMetaDescription}]]></description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${postsResult.posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <author><![CDATA[${post.user.username}]]></author>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (e) {
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RSS Feed Error</title>
    <description>Unable to generate RSS feed at this time</description>
    <link>/</link>
  </channel>
</rss>`;
    return new NextResponse(errorXml, {
      status: 500,
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
  }
}

