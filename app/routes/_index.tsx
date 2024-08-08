import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Hero from "~/components/Hero";
import BlogCard from "~/components/BlogCard";
import { getRecentPosts } from "~/db/query";
import { Post as PostType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Steven McSorley's Blog" },
    { name: "description", content: "Welcome to my tech blog!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const posts: PostType[] = await getRecentPosts();
  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: PostType) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
