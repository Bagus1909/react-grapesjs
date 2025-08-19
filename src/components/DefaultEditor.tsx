"use client"; // kalau pakai Next.js app router

import grapesjs from "grapesjs";
import GjsEditor from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css";
import basicBlocks from "grapesjs-blocks-basic";
import { useState } from "react";

export default function DefaultEditor() {
  const [variables, setVariables] = useState<any>({
    user_company: "PT. Excellent Infotama Kreasindo",
    client_company: "Setiawan Corp",
  });

  const [editorInstance, setEditorInstance] = useState<any>(null);

  const onEditor = (editor: any) => {
    console.log("Editor loaded", { editor });

    let isPreview = false;

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

    // Custom block example
    editor.BlockManager.add("my-block", {
      label: "Custom Block",
      category: "Custom",
      content: `<div style="padding: 20px; background: #e3f2fd; text-align:center;">
                  Custom Hello World!
                </div>`,
    });

    // Preview
    editor.Commands.add("preview-with-vars", {
      run: (ed: any) => {
        ed.runCommand("preview");
        const iframe = ed.Canvas.getFrameEl();

        if (!isPreview) {
          // masuk preview mode
          ed.runCommand("preview");

          let html = ed.getHtml();

          // replace {{var}}
          html = html.replace(/{{(.*?)}}/g, (_: any, key: any) => {
            return variables[key.trim()] || `{{${key}}}`;
          });

          // inject ke iframe preview
          iframe.contentDocument.body.innerHTML = html;
          iframe.contentDocument.body.style.backgroundColor = "#fff";

          isPreview = true;
        } else {
          // keluar preview mode
          ed.stopCommand("preview");
          isPreview = false;
        }
      },
    });

    // Ganti tombol default preview pakai command kita
    // const pn = editor.Panels;
    // const btn = pn.getButton("options", "preview");
    // if (btn) {
    //   btn.set("command", "preview-with-vars");
    // }

    editor.Panels.addButton("options", {
      id: "preview-with-vars-btn",
      className: "fa fa-eye",
      command: "preview-with-vars",
      attributes: { title: "Preview with Variables" },
    });

    setEditorInstance(editor);
  };

  const getFinalHTML = () => {
    if (!editorInstance) return;
    let html = editorInstance.getHtml();

    // replace {{var}} dengan nilai
    html = html.replace(/{{(.*?)}}/g, (_: any, key: any) => {
      return variables[key.trim()] || `{{${key}}}`;
    });

    console.log("Final HTML:", html);
    alert(html);
  };

  return (
    <div style={{ height: "100vh" }}>
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: "100%",
          storageManager: false,
          fromElement: true,
          plugins: [basicBlocks],
          pluginsOpts: {
            "grapesjs-blocks-basic": {
              flexGrid: true,
            },
          },
        }}
        onEditor={onEditor}
      />
      <div style={{ padding: "10px", background: "#f4f4f4" }}>
        <h3>Set Variables</h3>
        <label>
          Client Company:
          <input
            type="text"
            value={variables.client_company}
            onChange={(e) =>
              setVariables({ ...variables, client_company: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          User Company:
          <input
            type="text"
            value={variables.user_company}
            onChange={(e) =>
              setVariables({ ...variables, user_company: e.target.value })
            }
          />
        </label>
        <br />
        <button onClick={getFinalHTML}>Export HTML with Variables</button>
      </div>
    </div>
  );
}
