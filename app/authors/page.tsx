import { getSSRBlazeBlogClient, Post } from "@/lib/blazeblog";
import { Metadata } from "next";
import Link from "next/link"; // Assuming we will link to author pages later

export const metadata: Metadata = {
  title: "All Authors",
  description: "A list of all authors who have contributed to the blog.",
};

const AllAuthorsPage = async () => {
  const client = await getSSRBlazeBlogClient();
  // Fetch all posts to derive the author list. This could be paginated if the number of posts is very large.
  const { posts } = await client.getPosts({ limit: 1000 });

  const authors = posts.reduce((acc: { [key: number]: Post['user'] }, post) => {
    if (post.user && !acc[post.user.id]) {
      acc[post.user.id] = post.user;
    }
    return acc;
  }, {});

  const uniqueAuthors = Object.values(authors);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Authors</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          Meet the talented authors who contribute to our blog.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {uniqueAuthors.map(author => (
          <div key={author.id} className="text-center">
            {/* Placeholder for author avatar */}
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                <span className="text-3xl">{author.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <h2 className="font-bold">{author.username}</h2>
            {/* We could add a link here if an author page existed, e.g., <Link href={`/author/${author.id}`}>View posts</Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAuthorsPage;
