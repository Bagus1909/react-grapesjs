"use client"; // kalau pakai Next.js app router

import grapesjs from "grapesjs";
import GjsEditor from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css";
import basicBlocks from "grapesjs-blocks-basic";
import { useState, useEffect } from "react";

export default function DefaultEditor() {
  const [variables, setVariables] = useState<any>({
    user_company: "PT. Excellent Infotama Kreasindo",
    client_company: "Setiawan Corp",
  });

  const [editorInstance, setEditorInstance] = useState<any>(null);

  // Update variabel reference di editor setiap kali variabel berubah
  useEffect(() => {
    if (editorInstance && editorInstance.currentComponent) {
      editorInstance.currentComponent.variables = variables;
    }
  }, [variables, editorInstance]);

  const onEditor = (editor: any) => {
    console.log("Editor loaded", { editor });

    // Store reference ke component untuk akses variabel terbaru
    editor.currentComponent = { variables: variables };

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

    // Variable block - untuk memasukkan variabel ke dalam konten
    editor.BlockManager.add("variable-block", {
      label: "Variable Text",
      category: "Custom",
      content: `<div style="padding: 10px; border: 1px dashed #ccc;">
                  Click "Add Variable" button to insert variables
                </div>`,
    });

    // Command untuk preview dengan variables yang diperbaiki
    editor.Commands.add("preview-with-vars", {
      run: (ed: any) => {
        // Ambil HTML dan CSS dari editor
        let html = ed.getHtml();
        let css = ed.getCss();

        // Replace variabel dengan nilai sebenarnya - akses langsung dari state terbaru
        html = html.replace(/{{(.*?)}}/g, (_: any, key: any) => {
          // Akses variabel terbaru dari referensi yang disimpan
          const currentVars = ed.currentComponent.variables;
          return currentVars[key.trim()] || `{{${key}}}`;
        });

        // Buat window baru untuk preview
        const previewWindow = window.open("", "_blank", "width=800,height=600");

        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Preview</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                ${css}
                .row { display: flex; flex-wrap: wrap; }
                .cell { flex: 1; padding: 10px; min-height: 50px; }
              </style>
            </head>
            <body>
              ${html}
              <div style="position: fixed; top: 10px; right: 10px; z-index: 9999;">
                <button onclick="window.close()" style="padding: 10px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Close Preview
                </button>
              </div>
            </body>
            </html>
          `);
          previewWindow.document.close();
        }
      },
    });

    // Tambah tombol preview custom
    editor.Panels.addButton("options", {
      id: "preview-with-vars-btn",
      className: "fa fa-eye",
      command: "preview-with-vars",
      attributes: { title: "Preview with Variables" },
    });

    // Command untuk mengimpor variabel ke dalam teks yang dipilih
    editor.Commands.add("add-variable", {
      run: (ed: any) => {
        const selected = ed.getSelected();
        if (selected) {
          // Jika ada komponen yang dipilih, tambahkan variabel
          const currentContent =
            selected.get("content") || selected.getInnerHTML() || "";
          const newContent = currentContent + " {{client_company}}";
          selected.set("content", newContent);
        } else {
          // Jika tidak ada yang dipilih, tambahkan block variabel baru
          ed.BlockManager.add("temp-var", {
            content: "<span>{{client_company}}</span>",
          });

          const component = ed.addComponents(
            "<span>{{client_company}}</span>"
          )[0];
          ed.select(component);
        }
      },
    });

    // Tambah tombol untuk menambahkan variabel
    editor.Panels.addButton("options", {
      id: "add-variable-btn",
      className: "fa fa-plus",
      command: "add-variable",
      attributes: { title: "Add Variable" },
    });

    setEditorInstance(editor);
  };

  const getFinalHTML = () => {
    if (!editorInstance) return;

    let html = editorInstance.getHtml();
    let css = editorInstance.getCss();

    // Replace {{var}} dengan nilai
    html = html.replace(/{{(.*?)}}/g, (_: any, key: any) => {
      return variables[key.trim()] || `{{${key}}}`;
    });

    const finalHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Final Document</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
    ${css}
    .row { display: flex; flex-wrap: wrap; }
    .cell { flex: 1; padding: 10px; min-height: 50px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    console.log("Final HTML:", finalHTML);

    // Buat blob dan download
    const blob = new Blob([finalHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addNewVariable = () => {
    const varName = prompt("Enter variable name (without {{}}):");
    const varValue = prompt("Enter variable value:");

    if (varName && varValue) {
      setVariables({
        ...variables,
        [varName.trim()]: varValue,
      });
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
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
            canvas: {
              styles: [
                "body { margin: 0; padding: 10px; }",
                ".row { display: flex; flex-wrap: wrap; }",
                ".cell { flex: 1; padding: 10px; min-height: 50px; border: 1px dashed #ccc; }",
              ],
            },
          }}
          onEditor={onEditor}
        />
      </div>

      <div
        style={{
          padding: "15px",
          background: "#f8f9fa",
          borderTop: "1px solid #ddd",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 10px 0" }}>Variables:</h4>
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "inline-block",
                    width: "120px",
                    fontSize: "14px",
                  }}
                >
                  {key}:
                </label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) =>
                    setVariables({ ...variables, [key]: e.target.value })
                  }
                  style={{
                    padding: "4px 8px",
                    marginRight: "10px",
                    minWidth: "200px",
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={addNewVariable}
              style={{
                padding: "8px 16px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Variable
            </button>
            <button
              onClick={getFinalHTML}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Download HTML
            </button>
          </div>
        </div>

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          <strong>Tips:</strong>
          • Use "Variable Text" block to add variables to your content
          <br />• Or manually type {"{{`{variable_name}`}}"} in any text
          <br />
          • Click "Preview with Variables" to see final result
          <br />• Available variables: {Object.keys(variables).join(", ")}
        </div>
      </div>
    </div>
  );
}
