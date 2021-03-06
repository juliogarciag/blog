import { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import Markdown from "~/components/Markdown";
import ShowDate from "~/components/ShowDate";
import { findPost } from "~/models/post.server";

type LoaderData = {
  post: Post;
};

export const loader: LoaderFunction = async ({ params }) => {
  const post = await findPost(params.postId as string);
  return json<LoaderData>({ post });
};

export default function PostPage() {
  const { post } = useLoaderData() as LoaderData;

  return (
    <article className="pt-4">
      <header className="flex flex-col space-y-3">
        <h2 className="text-3xl font-medium text-yellow-700">{post.title}</h2>
        <ShowDate date={post.createdAt} />
      </header>
      <div className="text-lg">
        <Markdown>{post.body}</Markdown>
      </div>
    </article>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>There's no post with this id.</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
