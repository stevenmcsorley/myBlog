import { Link } from "@remix-run/react";
import { Post as PostType } from "~/types";

type PostProps = {
  post: PostType;
};

const BlogCard = ({ post }: PostProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p>{post.excerpt}</p>
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="card-actions justify-end">
          <Link to={`/posts/${post.slug}`} className="btn btn-primary">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
