import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import { getPostBySlug } from "~/db/query";
import Post from "~/components/Post";
import { Post as PostType } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const post = await getPostBySlug(slug?.toString() ?? "");

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json(post);
};

export default function SinglePost() {
  const post = useLoaderData<PostType>();

  if (!post) {
    return <div className="text-center text-2xl mt-10">Post not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Post post={post} />
    </div>
  );
}
