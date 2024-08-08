import { LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, Form, useSubmit } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { requireUserId, logout } from "~/utils/session.server";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return json({ posts });
};

export const action: LoaderFunction = async ({ request }) => {
  const form = await request.formData();
  const actionType = form.get("actionType");

  if (actionType === "logout") {
    return logout(request);
  }

  const postId = form.get("postId");
  if (actionType === "delete") {
    await prisma.post.delete({
      where: { id: String(postId) },
    });
  }

  return redirect("/admin");
};

export default function Admin() {
  const { posts } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const submit = useSubmit();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      submit({ postId, actionType: "delete" }, { method: "post" });
    }
  };

  return (
    <div className="bg-base-200 min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Admin Panel</h1>
        <div className="flex space-x-2">
          <Link to="/admin/new" className="btn btn-primary">
            New Post
          </Link>
          <Link to="/" className="btn btn-secondary">
            Admin
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <Link
                to={`/posts/${post.slug}`}
                className="card-title text-primary hover:text-primary"
              >
                {post.title}
              </Link>
              <p className="text-base-content/70">{post.excerpt}</p>
              <div className="card-actions justify-end mt-2">
                <Link
                  to={`/admin/edit/${post.id}`}
                  className="btn btn-sm btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Form method="post" className="mt-8">
        <input type="hidden" name="actionType" value="logout" />
        <button type="submit" className="btn btn-outline">
          Logout
        </button>
      </Form>
    </div>
  );
}
