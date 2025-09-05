import { getSSRBlazeBlogClient } from "@/lib/blazeblog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);

  if (!result) {
    return {
      title: "Post not found",
    };
  }

  const { data: post, seo } = result;

  return {
    title: seo.meta.title,
    description: seo.meta.description,
    alternates: {
      canonical: seo.meta.canonicalUrl,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const client = await getSSRBlazeBlogClient();
  const result = await client.getPost(params.slug);

  if (!result) {
    notFound();
  }

  const { data: post } = result;

  return (
    <article className="prose lg:prose-xl max-w-none">
      {post.featuredImage && (
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={1200}
          height={600}
          className="object-cover w-full rounded-lg"
        />
      )}
      <h1>{post.title}</h1>
      <div className="flex items-center mb-8 text-lg">
        <span>{post.user.username}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{post.readingTime} min read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </article>
  );
}
