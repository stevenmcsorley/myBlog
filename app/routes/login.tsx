import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { verifyLogin, createUserSession } from "~/utils/session.server";

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined };
  fields?: { username: string; password: string };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/admin";

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json(
      { formError: `Form not submitted correctly.` },
      { status: 400 }
    );
  }

  try {
    const user = await verifyLogin(username, password);
    if (!user) {
      return json(
        {
          fields: { username, password },
          formError: `Username/Password combination is incorrect`,
        },
        { status: 400 }
      );
    }

    return createUserSession(user.id, redirectTo);
  } catch (error) {
    console.error("Error logging in:", error);
    return json(
      {
        formError: `An unexpected error occurred. Please try again later.`,
      },
      { status: 500 }
    );
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Login</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full p-2 border rounded"
            defaultValue={actionData?.fields?.username}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border rounded"
            defaultValue={actionData?.fields?.password}
          />
        </div>
        {actionData?.formError && (
          <p className="text-red-500">{actionData.formError}</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Log In
        </button>
      </Form>
    </div>
  );
}
