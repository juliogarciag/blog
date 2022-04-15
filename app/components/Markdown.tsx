import MarkdownToJSX from "markdown-to-jsx";
import { ReactNode } from "react";
import { classNames } from "~/utils";

export default function Markdown({
  children,
}: {
  children: string & ReactNode;
}) {
  return (
    <MarkdownToJSX
      options={{
        overrides: {
          h2: { props: { className: classNames("text-2xl") } },
          p: { props: { className: classNames("my-6") } },
          ul: { props: { className: classNames("list-disc ml-8") } },
          ol: { props: { className: classNames("list-decimal ml-8") } },
        },
      }}
    >
      {children}
    </MarkdownToJSX>
  );
}
