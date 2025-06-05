"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useCallback, useState } from "react";
import boldIcon from "@/public/bold.svg";
import italicIcon from "@/public/italic.svg";
import Image from "next/image";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState("16"); // default font size
  const [color, setColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Times New Roman");

  const applyFontSize = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": `${fontSize}px` });
      }
    });
  }, [editor, fontSize]);

  const applyFontColor = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color });
      }
    });
  }, [editor, color]);

  // New useCallback functions for bold/italic
  const formatBold = useCallback(() => {
    editor.update(() => { // <--- Wrap in editor.update()
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    });
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.update(() => { // <--- Wrap in editor.update()
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    });
  }, [editor]);

  const applyFontFamily = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-family": fontFamily });
      }
    });
  }, [editor, fontFamily]);

  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={formatBold} // Use the new callback
        className="px-1  border rounded bg-white"
      >
        <Image src={boldIcon} alt="bold icon" className="size-6 " />
      </button>
      <button
        onClick={formatItalic} // Use the new callback
        className="px-2  border rounded bg-white"
      >
        <Image
          src={italicIcon}
          alt="italic icon"
          className="size-4"
        />
      </button>

      <input
        type="number"
        min="8"
        max="96"
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
        onBlur={applyFontSize}
        className="w-25 border rounded p-1 bg-white text-gray-800 font-medium"
        placeholder="Font size"
      />

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        onBlur={applyFontColor}
        className="w-8 h-8  border rounded bg-white"
      />

      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        onBlur={applyFontFamily}
        className="border rounded p-1 bg-white text-black"
      >
        <option value="Times New Roman">Times New Roman</option>
        <option value="Arial">Arial</option>
        <option value="Calibri">Calibri</option>
        <option value="Cambria">Cambria</option>
        <option value="Georgia">Georgia</option>
        <option value="Garamond">Garamond</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Verdana">Verdana</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Segoe UI">Segoe UI</option>
        <option value="Lucida Console">Lucida Console</option>
        <option value="Courier New">Courier New</option>
        <option value="Palatino Linotype">Palatino Linotype</option>
        <option value="Arial Narrow">Arial Narrow</option>
        <option value="Century Gothic">Century Gothic</option>
        <option value="Book Antiqua">Book Antiqua</option>
        <option value="Constantia">Constantia</option>
        <option value="Franklin Gothic Medium">Franklin Gothic Medium</option>
        <option value="Rockwell">Rockwell</option>
      </select>
    </div>
  );
}