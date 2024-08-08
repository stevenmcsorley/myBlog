import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import { getAllPosts } from "~/db/query";
import { Post } from "~/types";

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts();
  return json(posts);
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-4xl font-bold mb-8">Latest Posts</h1> */}
      <Outlet context={{ posts }} />
    </div>
  );
}
