import LexicalComposer from "@lexical/react/LexicalComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "@lexical/react/LexicalContentEditable";
import MarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import OnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ComponentProps, Ref, RefObject } from "react";
import { $getRoot, EditorState } from "lexical";

type LexicalComposerConfig = ComponentProps<
  typeof LexicalComposer
>["initialConfig"];

function classNames(classNames: string) {
  return classNames;
}

export default function MarkdownEditor({
  editorRef,
}: {
  editorRef: RefObject<HTMLInputElement>;
}) {
  const customTheme: LexicalComposerConfig["theme"] = {
    heading: {
      h1: classNames("text-2xl"),
      h2: classNames("text-xl"),
      h3: classNames("text-lg"),
    },
    link: classNames("text-indigo-600"),
  };

  const initialConfig: LexicalComposerConfig = {
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      ListItemNode,
      ListNode,
      LinkNode,
      AutoLinkNode,
    ],
    theme: customTheme,
  };

  const updateRef = (editorState: EditorState) => {
    editorState.read(() => {
      // TODO: u_u
      console.log($getRoot());
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="rounded-md border border-gray-600 p-2" />
          }
          placeholder={<div>Enter some text...</div>}
        />
        <OnChangePlugin onChange={updateRef} />
        <AutoFocusPlugin />
        <HistoryPlugin />
        <MarkdownShortcutPlugin />
        <LinkPlugin />
      </div>
    </LexicalComposer>
  );
}
