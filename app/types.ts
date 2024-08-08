// app/types.ts

export interface User {
  id: string;
  username: string;
  password: string;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: User | null;
  authorId?: string | null;
}
