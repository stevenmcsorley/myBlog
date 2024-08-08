import { PrismaClient, Prisma } from "@prisma/client";
import { Post as PostType } from "~/types";

const prisma = new PrismaClient();

const mapPrismaPostToPost = (
  post: Prisma.PostGetPayload<{ include: { author: true } }>
): PostType => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: post.author
    ? {
        id: post.author.id,
        username: post.author.username,
        password: post.author.password,
        posts: [], // Since we don't need posts in the author here, keep it empty
      }
    : null,
  authorId: post.authorId,
});

export async function getAllPosts(): Promise<PostType[]> {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts.map(mapPrismaPostToPost);
  } catch (error) {
    console.log("unexpected error", error);
    return [];
  }
}

export async function createPost(
  userId: string,
  slug: string,
  title: string,
  content: string
): Promise<PostType | null> {
  try {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        slug,
        title,
        excerpt: content.slice(0, 100), // Generate an excerpt from content
        content,
      },
      include: {
        author: true,
      },
    });
    return mapPrismaPostToPost(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Unexpected error creating post");
    }
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });
    return post ? mapPrismaPostToPost(post) : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching post:", error.message);
    } else {
      console.error("Unexpected error fetching post");
    }
    return null;
  }
}

export async function updatePost(
  id: string,
  title: string,
  content: string
): Promise<PostType | null> {
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
      include: {
        author: true,
      },
    });
    return mapPrismaPostToPost(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating post:", error.message);
    } else {
      console.error("Unexpected error updating post");
    }
    return null;
  }
}

export async function getPostsByUser(
  userId: string
): Promise<{ error: boolean; posts?: PostType[]; errorMessage?: string }> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });
    return {
      error: false,
      posts: posts.map(mapPrismaPostToPost),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("db operation error:", error.message);
    } else {
      console.log("Unexpected db operation error");
    }
    return {
      error: true,
      errorMessage: "Unexpected error",
    };
  }
}

export async function deletePostById(
  postId: string
): Promise<{ error: boolean; errorMessage?: string }> {
  console.log("postid to delete:", postId);
  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return { error: false, errorMessage: "" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("db operation error:", error.message);
    } else {
      console.log("Unexpected db operation error");
    }
    return { error: true, errorMessage: "Unexpected error" };
  }
}

export async function getRecentPosts(): Promise<PostType[]> {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit the number of recent posts to fetch
    });
    return posts.map(mapPrismaPostToPost);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}
