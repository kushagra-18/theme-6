import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About This Theme",
};

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Block */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold">About this theme</h1>
          <p className="mt-4 text-lg text-base-content/70">
            This is a custom theme built with Next.js and DaisyUI, designed to replicate a modern, clean, and content-focused blog. It is powered by the BlazeBlog API.
          </p>
        </header>

        <article className="prose lg:prose-xl max-w-none">
          {/* Section 1 */}
          <h2>Homepage Header Styles</h2>
          <p>
            The header is designed to be sticky and responsive. It provides clear navigation on desktop and collapses into a full-height drawer on mobile devices for a seamless user experience.
          </p>
          <figure>
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800"
              alt="Illustrative image of a website header"
              width={800}
              height={400}
              className="rounded-lg"
            />
            <figcaption>A clean header keeps the focus on content.</figcaption>
          </figure>

          {/* Section 2 */}
          <h2>Post Feed Styles</h2>
          <p>
            The homepage features a variety of post card styles to create a visually dynamic feed. From a large lead card to smaller featured and latest post cards, the layout is designed to be engaging and easy to navigate.
          </p>
           <figure>
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"
              alt="Illustrative image of a post feed"
              width={800}
              height={400}
              className="rounded-lg"
            />
            <figcaption>Different card styles create a dynamic feed.</figcaption>
          </figure>

          {/* Section 3 */}
          <h2>Typography</h2>
          <p>
            Readability is key. The theme uses a clean, modern font stack with clear heading hierarchy and comfortable line spacing, ensuring that the content is a pleasure to read on any device.
          </p>

        </article>
      </div>
    </div>
  );
};

export default AboutPage;
