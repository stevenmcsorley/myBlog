import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

import "./tailwind.css";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Steven McSorley's Blog" },
    { name: "description", content: "Welcome to my tech blog!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return json({ userId });
};

export default function App() {
  const { userId } = useLoaderData<{ userId: string | null }>();

  useEffect(() => {
    import("react-quill/dist/quill.snow.css");
  }, []);

  return (
    <html lang="en" data-theme="dim">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header className="p-4 shadow-md bg-base-100">
          <nav className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">
              Blog
            </a>
            {userId && (
              <>
                <a href="/admin" className="btn btn-secondary">
                  Admin
                </a>
              </>
            )}
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Outlet context={{ userId }} />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
