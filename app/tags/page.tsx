import TagCloud from "@/components/TagCloud";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tags",
  description: "A list of all tags for posts on the blog.",
};

const AllTagsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Tags</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
          Explore all the topics discussed on our blog.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <TagCloud />
      </div>
    </div>
  );
};

export default AllTagsPage;
