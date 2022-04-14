import { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { MouseEvent } from "react";
import invariant from "tiny-invariant";
import PostForm from "~/components/admin/PostForm";
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

  const confirmDeletion = (event: MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <PostForm
        post={data.post}
        actionType={ActionTypes.Update}
        actionData={actionData}
        moreActions={
          <button
            type="submit"
            className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
            name="_action"
            value={ActionTypes.Delete}
            onClick={confirmDeletion}
          >
            Delete
          </button>
        }
      />
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
