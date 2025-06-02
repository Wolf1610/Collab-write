"use client"; // This directive marks the component as a Client Component

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor } from "lexical";
import { useState } from "react";
import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
} from "@liveblocks/react-lexical";
import ToolbarPlugin from "./ToolBarPlugin";
import FloatingToolbar from "./plugins/FloatingToolbar";
import { useThreads } from "@liveblocks/react/suspense";
import { Thread } from "@liveblocks/react-ui";
// Define your Lexical theme (for basic styling)
const editorTheme = {
  // You can define various styles here for different Lexical nodes
  // For example:
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
  // ... more styles for headings, lists, etc.
};

// Initial editor state (optional)
function initialEditorState(editor: LexicalEditor) {
  // You can set initial content here
  // For example, to set a simple paragraph:
  // editor.update(() => {
  //   const root = $getRoot();
  //   root.append($createParagraphNode().append($createTextNode("Hello, Lexical!")));
  // });
}

function onError(error: Error) {
  console.error(error);
}

export function LexicalEditorComponent({
  roomId,
  currentUserType,
}: {
  roomId: string;
  currentUserType: UserType;
}) {
 const { threads } = useThreads();

  const [editorState, setEditorState] = useState<string>();

  const status = useEditorStatus();
 

  const initialConfig = liveblocksConfig({
    namespace: "MyLexicalEditor",
    theme: editorTheme,
    onError,
    nodes: [
      // Add any custom nodes you plan to use here
      // For basic rich text, you might need:
      // HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode,
      // LinkNode, AutoLinkNode, TableNode, TableCellNode, TableRowNode
    ],
    editable: currentUserType === "editor",
  });

  const handleEditorChange = (
    editorState: EditorState,
    editor: LexicalEditor
  ) => {
    // You can serialize the editor state here and save it to a database, etc.
    editorState.read(() => {
      // Example: Convert to JSON string
      const json = JSON.stringify(editorState.toJSON());
      setEditorState(json);
      // console.log("Editor State JSON:", json);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {/* Basic toolbar (you'll extend this) */}
        <div className="toolbar border border-white/20 rounded-sm">
          {/* Add buttons for bold, italic, etc. here */}
          <ToolbarPlugin />
          {/* TODO: Delete Modal */}
          {/* {currentUserType === "editor" && <DeleteModal roomId={roomId}/>} */}
        </div>
        <div>
          {status === "not-loaded" || status === "loading" ? (
            <div className="h-screen flex justify-center items-center text-white">
              Loading...
            </div>
          ) : (
            <div className="editor-inner bg-[#212121] border border-white/20 rounded-sm shadow-md text-white">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="content-editable" />
                }
                placeholder={
                  <div className="placeholder text-white/50">
                    Start typing...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === "editor" && <FloatingToolbar />}
              <HistoryPlugin />
              <AutoFocusPlugin />
              <OnChangePlugin onChange={handleEditorChange} />
              {/* You'll add your custom plugins and features here */}
            </div>
          )}
          <LiveblocksPlugin>
            {/* TODO: Comments */}
            <FloatingComposer className="w-[300px] p-4" />
            <FloatingThreads threads={threads} className=" mt-4 space-y-3 p-4 rounded-md border border-white/50"/>
          </LiveblocksPlugin>
        </div>
      </div>
      {/* Optional: Display current editor state for debugging */}
      {/* <pre>{editorState}</pre> */}
    </LexicalComposer>
  );
}
