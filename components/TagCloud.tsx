import { Tag } from "@/lib/blazeblog";
import Link from "next/link";

type Props = {
  tags: Tag[];
};

function computeSize(count?: number): string {
  // Slightly larger overall scale for better presence
  if (!count || count <= 1) return 'text-base';
  if (count < 3) return 'text-lg';
  if (count < 5) return 'text-xl';
  if (count < 10) return 'text-2xl';
  return 'text-3xl';
}

export default function TagCloud({ tags }: Props) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null;
  }
  // Soft shuffle to avoid static ordering bias
  const shuffled = [...tags].sort((a, b) => (a.postCount || 0) - (b.postCount || 0));

  return (
    <div className="pl-6 border-l border-base-300 h-full">
      <div className="sticky top-24">
        <div className="mb-4 text-sm uppercase tracking-wide text-base-content/60">Tags</div>
        <div className="flex flex-wrap gap-4">
          {shuffled.map(tag => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className={`badge badge-outline badge-lg hover:bg-base-200 hover:border-base-300 hover:no-underline transition-colors ${computeSize(tag.postCount)}`}
              aria-label={`${tag.name}${tag.postCount ? ` (${tag.postCount})` : ''}`}
              title={tag.postCount ? `${tag.name} (${tag.postCount})` : tag.name}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
