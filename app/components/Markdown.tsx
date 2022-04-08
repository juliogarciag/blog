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
        },
      }}
    >
      {children}
    </MarkdownToJSX>
  );
}
