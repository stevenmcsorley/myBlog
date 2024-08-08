import { Post as PostType } from "~/types";

type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  return (
    <article className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-3xl mb-4">{post.title}</h1>
        <div className="mb-6 text-base-content/70">
          <time dateTime={post.createdAt} className="mr-4">
            {new Date(post.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.author && (
            <span>
              By <span className="font-semibold">{post.author.username}</span>
            </span>
          )}
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
};

export default Post;
