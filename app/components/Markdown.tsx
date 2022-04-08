import MarkdownToJSX from "markdown-to-jsx";
import { ReactNode } from "react";

export default function Markdown({
  children,
}: {
  children: string & ReactNode;
}) {
  return (
    <MarkdownToJSX
      options={{
        overrides: {
          p: { props: { className: "my-6" } },
          ul: { props: { className: "list-disc ml-8" } },
          ol: { props: { className: "list-decimal ml-8" } },
        },
      }}
    >
      {children}
    </MarkdownToJSX>
  );
}
