import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const client = await getSSRBlazeBlogClient();
    const { posts } = await client.searchPosts(query);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
