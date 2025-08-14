import { useEffect, useRef } from "react";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";

export default function GrapesEditor() {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: containerRef.current!,
        fromElement: true,
        height: "300px",
        width: "auto",
        storageManager: false,
        panels: { defaults: [] },
        blockManager: {
          appendTo: "#blocks",
          blocks: [
            {
              id: "section",
              label: "<b>Section</b>",
              attributes: { class: "gjs-block-section" },
              content: `<section>
                <h1>This is a simple title</h1>
                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
              </section>`,
            },
            {
              id: "text",
              label: "Text",
              content: '<div data-gjs-type="text">Insert your text here</div>',
            },
            {
              id: "image",
              label: "Image",
              select: true,
              content: { type: "image" },
              activate: true,
            },
          ],
        },
      });

      // Simpan ke ref
      editorRef.current = editor;

      // custom block
      editor.BlockManager.add("my-block-id", {
        label: "My Custom Block",
        content: {
          tagName: "div",
          draggable: false,
          attributes: { "some-attribute": "some-value" },
          components: [
            {
              tagName: "span",
              content: "<b>Some static content</b>",
            },
            {
              tagName: "div",
              components: "<span>HTML at some point</span>",
            },
          ],
        },
      });
      // Editor Panel
      editor.Panels.addPanel({
        id: "panel-top",
        el: ".panel__top",
      });
      editor.Panels.addPanel({
        id: "basic-actions",
        el: ".panel__basic-actions",
        buttons: [
          {
            id: "visibility",
            active: true, // active by default
            className: "btn-toggle-borders",
            label: "<u>B</u>",
            command: "sw-visibility", // Built-in command
          },
          {
            id: "export",
            className: "btn-open-export",
            label: "Exp",
            command: "export-template",
            context: "export-template", // For grouping context of buttons from the same panel
          },
          {
            id: "show-json",
            className: "btn-show-json",
            label: "JSON",
            context: "show-json",
            command(editor: any) {
              editor.Modal.setTitle("Components JSON")
                .setContent(
                  `<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`
                )
                .open();
            },
          },
        ],
      });
    }
  }, []);

  return (
    <div>
      <div className="panel__top">
        <div className="panel__basic-actions"></div>
      </div>
      <div ref={containerRef} id="gjs">
        <h1>Testing Grapes</h1>
      </div>
      <div id="blocks"></div>
    </div>
  );
}
