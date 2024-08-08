import { Post as PostType } from "~/types";
import { Link } from "@remix-run/react";

type PostsListProps = {
  posts: PostType[];
};

const PostsList = ({ posts }: PostsListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-2">
              <Link to={`/posts/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h2>
            <p className="text-base-content/70 mb-4">
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mb-4">
              {post.excerpt.split(" ").slice(0, 20).join(" ")}
              {post.excerpt.split(" ").length > 20 && "..."}
            </p>
            <div className="card-actions justify-end">
              <Link
                to={`/posts/${post.slug}`}
                className="btn btn-primary btn-sm"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
