import { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { MouseEvent, useRef } from "react";
import invariant from "tiny-invariant";
import { deletePost, findPost, updatePost } from "~/models/post.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  post: Post;
};

const ActionTypes = {
  Update: "update",
  Delete: "delete",
} as const;

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
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
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === ActionTypes.Delete) {
    await deletePost(params.postId);
    return redirect("/admin");
  } else if (action === ActionTypes.Update) {
    await updatePost(params.postId, {
      userId,
      title: formData.get("title") as string,
      body: formData.get("body") as string,
    });
    return redirect(`/admin/${params.postId}`);
  }
};

export default function AdminPostPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const confirmDeletion = (event: MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              ref={titleRef}
              name="title"
              defaultValue={data.post.title}
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.title && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.title}
            </div>
          )}
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Body: </span>
            <textarea
              ref={bodyRef}
              name="body"
              rows={8}
              defaultValue={data.post.body}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
          </label>
        </div>
        <hr className="my-4" />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            name="_action"
            value={ActionTypes.Update}
          >
            Update
          </button>
          <button
            type="submit"
            className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
            name="_action"
            value={ActionTypes.Delete}
            onClick={confirmDeletion}
          >
            Delete
          </button>
        </div>
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
