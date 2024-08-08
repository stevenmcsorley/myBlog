import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { useState, useEffect } from "react";
import slugify from "slugify";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    slug: string | undefined;
    excerpt: string | undefined;
    content: string | undefined;
  };
  fields?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireUserId(request);
  const postId = params.id;
  const post = await prisma.post.findUnique({
    where: { id: String(postId) },
  });
  if (!post) {
    throw new Response("Post Not Found", { status: 404 });
  }
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  return json({ post, GROQ_API_KEY });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const postId = form.get("postId");
  const title = form.get("title");
  const slug = form.get("slug");
  const excerpt = form.get("excerpt");
  const content = form.get("content");

  if (
    typeof postId !== "string" ||
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof excerpt !== "string" ||
    typeof content !== "string"
  ) {
    return json(
      { formError: `Form not submitted correctly.` },
      { status: 400 }
    );
  }

  const fieldErrors = {
    title: title.length < 3 ? "Title must be at least 3 characters" : undefined,
    slug: slug.length < 3 ? "Slug must be at least 3 characters" : undefined,
    excerpt:
      excerpt.length < 10
        ? "Excerpt must be at least 10 characters"
        : undefined,
    content:
      content.length < 100
        ? "Content must be at least 100 characters"
        : undefined,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json(
      { fieldErrors, fields: { title, slug, excerpt, content } },
      { status: 400 }
    );
  }

  await prisma.post.update({
    where: { id: postId },
    data: { title, slug, excerpt, content },
  });
  return redirect("/admin");
};

export default function EditPost() {
  const { post, GROQ_API_KEY } = useLoaderData();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);

  const [QuillEditor, setQuillEditor] = useState<any>(null);

  useEffect(() => {
    import("react-quill").then((module) => {
      setQuillEditor(() => module.default);
    });
  }, []);

  const generateContent = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (!title || !excerpt) {
      alert("Title and Excerpt are required to generate content");
      return;
    }

    const prompt = `Create a comprehensive and professional blog post based on the following:
    
        Title: ${title}
        Excerpt: ${excerpt}
        
        Guidelines:
        1. Structure the post with clear sections and subheadings.
        2. Incorporate relevant industry data, statistics, or case studies to support key points.
        3. Maintain a professional tone, balancing intellectual depth with accessibility.
        4. Include practical insights or actionable takeaways for readers.
        5. Consider potential counterarguments and address them thoughtfully.
        6. Conclude with a summary of key points and a thought-provoking final statement.
        7. Aim for a length of approximately 1000-1500 words.
        
        Formatting Instructions:
        1. Use HTML tags for structure (e.g., <h2>, <p>, <ul>, <ol>, <li>, <blockquote>).
        2. Apply Tailwind CSS classes to enhance the visual presentation. Some examples:
           - Main headings: class="text-2xl font-bold mt-6 mb-4"
           - Subheadings: class="text-xl font-semibold mt-4 mb-2"
           - Paragraphs: class="mb-4"
           - Lists: class="list-disc pl-5 mb-4" for unordered, class="list-decimal pl-5 mb-4" for ordered
           - Blockquotes: class="border-l-4 border-gray-300 pl-4 italic my-4"
        3. Use appropriate classes for text color, background, padding, and margins to create visual hierarchy.
        4. Ensure the content is responsive and readable on various screen sizes.
        
        The style should emulate a blend of analytical depth (like Roger Scruton) and technical insight (like top industry experts), while maintaining approachability and avoiding an overly academic tone. Format the content to be visually appealing and easy to read using Tailwind CSS classes.`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant that generates comprehensive and professional blog posts based on the given title and excerpt. You have expertise in web development and Tailwind CSS, and you format your content accordingly.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 8000,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.choices[0].message.content.trim());
      setSlug(slugify(title, { lower: true, strict: true }));
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <Form method="post" className="space-y-6">
        <input type="hidden" name="postId" value={post.id} />
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value, { lower: true, strict: true }));
            }}
          />
          {actionData?.fieldErrors?.title && (
            <p className="text-error mt-1">{actionData.fieldErrors.title}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="slug" className="label">
            <span className="label-text">Slug</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="input input-bordered w-full"
            value={slug}
            readOnly
          />
          {actionData?.fieldErrors?.slug && (
            <p className="text-error mt-1">{actionData.fieldErrors.slug}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="excerpt" className="label">
            <span className="label-text">Excerpt</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            className="textarea textarea-bordered h-24"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          ></textarea>
          {actionData?.fieldErrors?.excerpt && (
            <p className="text-error mt-1">{actionData.fieldErrors.excerpt}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="content" className="label">
            <span className="label-text">Content</span>
          </label>
          {QuillEditor ? (
            <QuillEditor
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              theme="snow"
              className="h-64 mb-12"
            />
          ) : (
            <textarea
              id="content"
              name="content"
              className="textarea textarea-bordered h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          )}
          <input type="hidden" name="content" value={content} />
          {actionData?.fieldErrors?.content && (
            <p className="text-error mt-1">{actionData.fieldErrors.content}</p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={generateContent}
            className="btn btn-secondary"
            type="button"
          >
            Generate Content
          </button>
        </div>
      </Form>
    </div>
  );
}
