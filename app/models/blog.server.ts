import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getRecentPosts() {
  return prisma.post.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      excerpt: true,
      createdAt: true,
      slug: true,
    },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}) {
  return prisma.post.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
