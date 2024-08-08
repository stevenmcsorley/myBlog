import { useOutletContext } from "@remix-run/react";
import PostsList from "~/components/PostsList";
import { Post } from "~/types";

export default function PostsLandingPage() {
  const { posts } = useOutletContext<{ posts: Post[] }>();

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <PostsList posts={posts} />
    </>
  );
}
