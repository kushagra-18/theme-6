import { getSSRBlazeBlogClient, Tag } from "@/lib/blazeblog";
import Link from "next/link";

async function getAllTags(): Promise<Tag[]> {
  try {
    const client = await getSSRBlazeBlogClient();
    const { tags } = await client.getTags();
    return tags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

const TagCloud = async () => {
  const tags = await getAllTags();

  if (tags.length === 0) {
    return <p>No tags found.</p>;
  }

  return (
    <div className="p-4 rounded-lg bg-base-200">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="btn btn-sm"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;
