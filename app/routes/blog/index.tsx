import { Post } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { format } from "date-fns";
import { AnchorHTMLAttributes, ReactNode, useMemo } from "react";
import ShowDate from "~/components/ShowDate";
import GithubIcon from "~/icons/GithubIcon";
import { getPosts } from "~/models/post.server";
import { FrontendTyped } from "~/utils";

type LoaderData = {
  posts: Array<Pick<Post, "id" | "title" | "body" | "createdAt">>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function Index() {
  return (
    <>
      <PresentationCard />
      <h2 className="inline-block border-b-2 border-dashed border-yellow-500 pt-6 pb-1 text-xl font-medium">
        Some Articles:
      </h2>
      <Posts />
    </>
  );
}

function PresentationCard() {
  return (
    <div className="flex-row space-y-3 border bg-yellow-50 p-4 text-lg">
      <p>Hi! 👋 I'm a full-stack developer working on tech stuff since 2011.</p>
      <p>
        My favorite tools are{" "}
        <ParagraphLink href="https://typescriptlang.org">
          typescript
        </ParagraphLink>
        , <ParagraphLink href="https://reactjs.org">react</ParagraphLink>,{" "}
        <ParagraphLink href="https://rubyonrails.org">
          ruby on rails
        </ParagraphLink>
        , and everything frontend-related.
      </p>
      <ul className="pt-4 text-lg">
        <li>
          <a
            href="https://github.com/juliogarciag"
            className="flex items-center"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-8 w-8" aria-label="github link" />
            <code className="pl-4">{"<-"} this is my github profile</code>
          </a>
        </li>
      </ul>
    </div>
  );
}

function Posts() {
  const { posts } = useLoaderData() as FrontendTyped<LoaderData>;

  return (
    <div className="py-4">
      {posts.length === 0 ? (
        <p>No articles to show yet. They'll be coming soon.</p>
      ) : null}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => {
            return <PostPreview key={post.id} post={post} />;
          })}
        </div>
      ) : null}
    </div>
  );
}

function PostPreview({
  post,
}: {
  post: FrontendTyped<LoaderData>["posts"][number];
}) {
  return (
    <Link to={`/blog/${post.id}`} className="block">
      <h3 className="text-2xl font-medium text-yellow-700 hover:text-yellow-900">
        {post.title}
      </h3>
      <ShowDate date={post.createdAt} />
    </Link>
  );
}

function ParagraphLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }
) {
  const { children, ...anchorProps } = props;

  return (
    <a
      {...anchorProps}
      className="border-b-2 border-dashed border-b-gray-600 pb-1"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
