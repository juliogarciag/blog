import { Post } from "@prisma/client";
import { Form } from "@remix-run/react";
import { ReactNode, useEffect, useRef } from "react";

type MinimumActionData = {
  errors?: { [key in keyof Post]?: string };
};

export default function PostForm({
  post,
  actionType,
  actionData,
  saveButtonCopy,
  moreActions = null,
}: {
  post: Partial<Post>;
  actionType: string;
  actionData: MinimumActionData;
  saveButtonCopy?: string;
  moreActions?: ReactNode;
}) {
  const isNewRecord = post.id === undefined;
  const actualSaveButtonCopy =
    saveButtonCopy ?? (isNewRecord ? "Create" : "Update");

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(
    function synchronizeRefs() {
      if (titleRef.current) {
        titleRef.current.value = post.title ?? "";
      }
      if (bodyRef.current) {
        bodyRef.current.value = post.body ?? "";
      }
    },
    [post]
  );

  return (
    <Form method="post" className="flex w-full flex-col space-y-4">
      <div>
        <label className="flex w-full flex-row items-center gap-4">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border border-gray-600 px-2 py-0 text-base leading-loose"
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
        <label className="flex w-full flex-col gap-4">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="text-md w-full rounded-md border border-gray-600 py-2 px-3 leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>

      <hr className="my-4" />
      <div className="flex space-x-4">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          name="_action"
          value={actionType}
        >
          {actualSaveButtonCopy}
        </button>
        {moreActions}
      </div>
    </Form>
  );
}
