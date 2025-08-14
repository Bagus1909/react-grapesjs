// DefaultEditor.tsx
import grapesjs from "grapesjs";
import GjsEditor from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css"; // CSS langsung import
import basicBlocks from "grapesjs-blocks-basic";

export default function DefaultEditor() {
  const onEditor = (editor: any) => {
    console.log("Editor loaded", { editor });

    // Tambah block sederhana
    editor.BlockManager.add("my-block", {
      label: "Simple Block",
      category: "Basic",
      content: `<div style="padding: 20px; background: #f5f5f5;">
                  Hello World!
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
    </div>
  );
}
