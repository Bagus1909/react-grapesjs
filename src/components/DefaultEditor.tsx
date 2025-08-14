"use client"; // kalau pakai Next.js app router

import grapesjs from "grapesjs";
import GjsEditor from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css";
import basicBlocks from "grapesjs-blocks-basic";

export default function DefaultEditor() {
  const onEditor = (editor: any) => {
    console.log("Editor loaded", { editor });

    // Tambah semua block forms
    editor.BlockManager.add("form", {
      label: "Form",
      category: "Forms",
      content: `<form style="padding: 20px;"><input placeholder="Your name" /></form>`,
    });

    editor.BlockManager.add("input", {
      label: "Input",
      category: "Forms",
      content: `<div>
        <label>Name</label>
        <input placeholder="input name..." type="text" />
      </div>`,
    });

    editor.BlockManager.add("textarea", {
      label: "Textarea",
      category: "Forms",
      content: `<textarea placeholder="Write something..."></textarea>`,
    });

    editor.BlockManager.add("button", {
      label: "Button",
      category: "Forms",
      content: `<button>Click Me</button>`,
    });

    // Tambah layout columns
    editor.BlockManager.add("column1", {
      label: "1 Column",
      category: "Layout",
      content: `<div class="row"><div class="cell">1 column</div></div>`,
    });

    editor.BlockManager.add("column2", {
      label: "2 Columns",
      category: "Layout",
      content: `<div class="row"><div class="cell">Column 1</div><div class="cell">Column 2</div></div>`,
    });

    // Custom block contoh
    editor.BlockManager.add("my-block", {
      label: "Custom Block",
      category: "Custom",
      content: `<div style="padding: 20px; background: #e3f2fd; text-align:center;">
                  Custom Hello World!
                </div>`,
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: "100%",
          storageManager: false,
          fromElement: true, // biar UI bawaan muncul (panel kanan atas)
          plugins: [basicBlocks],
          pluginsOpts: {
            "grapesjs-blocks-basic": {
              flexGrid: true, // aktifkan grid
            },
          },
        }}
        onEditor={onEditor}
      />
      <div>
        <label>Name</label>
        <input type="text" />
      </div>
    </div>
  );
}
