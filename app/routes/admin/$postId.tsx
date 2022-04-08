import { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { FormEvent } from "react";
import invariant from "tiny-invariant";
import Markdown from "~/components/Markdown";

import { findPost, deletePost } from "~/models/post.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  post: Post;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await findPost(params.postId);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");
  await deletePost(params.postId);
  return redirect("/admin");
};

export default function AdminPostPage() {
  const data = useLoaderData() as LoaderData;

  const handleSubmit = (event: FormEvent) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.post.title}</h3>
      <div>
        <Markdown>{data.post.body}</Markdown>
      </div>
      <hr className="my-4" />
      <Form method="post" onSubmit={handleSubmit}>
        <button
          type="submit"
          className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Post not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
