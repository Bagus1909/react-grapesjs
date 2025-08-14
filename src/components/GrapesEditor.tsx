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

        layerManager: {
          appendTo: ".layers-container",
        },
        selectorManager: {
          appendTo: ".styles-container",
        },
        styleManager: {
          appendTo: ".styles-container",
          sectors: [
            {
              name: "Dimension",
              open: false,
              buildProps: ["width", "min-height", "padding"],
              properties: [
                {
                  type: "integer",
                  name: "The width",
                  property: "width",
                  units: ["px", "%"],
                  defaults: "auto",
                  min: 0,
                },
              ],
            },
            {
              name: "Extra",
              open: false,
              buildProps: ["background-color", "box-shadow", "custom-prop"],
              properties: [
                {
                  id: "custom-prop",
                  name: "Custom Label",
                  property: "font-size",
                  type: "select",
                  defaults: "32px",
                  options: [
                    { id: "tiny", value: "12px", name: "Tiny" },
                    { id: "medium", value: "18px", name: "Medium" },
                    { id: "big", value: "32px", name: "Big" },
                    // { value: "12px", name: "Tiny" },
                    // { value: "18px", name: "Medium" },
                    // { value: "32px", name: "Big" },
                  ],
                },
              ],
            },
          ],
        },

        panels: {
          defaults: [
            {
              id: "layers",
              el: ".panel__right",
              resizable: {
                maxDim: 350,
                minDim: 200,
                tc: false,
                cl: true,
                cr: false,
                bc: false,
                keyWidth: "flex-basis",
              },
            },
            {
              id: "panel-switcher",
              el: ".panel__switcher",
              buttons: [
                {
                  id: "show-layers",
                  active: true,
                  label: "Layers",
                  command: "show-layers",
                  togglable: false,
                },
                {
                  id: "show-style",
                  active: true,
                  label: "Styles",
                  command: "show-styles",
                  togglable: false,
                },
              ],
            },
          ],
        },

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

      // Simpan instance
      editorRef.current = editor;

      // Custom block
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

      // Panel atas
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
            active: true,
            className: "btn-toggle-borders",
            label: "<u>B</u>",
            command: "sw-visibility",
          },
          {
            id: "export",
            className: "btn-open-export",
            label: "Exp",
            command: "export-template",
            context: "export-template",
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

      // Commands
      editor.Commands.add("show-layers", {
        getRowEl(editor: any) {
          return editor.getContainer().closest(".editor-row");
        },
        getLayersEl(row: any) {
          return row.querySelector(".layers-container");
        },
        run(editor) {
          const lmEl = this.getLayersEl(this.getRowEl(editor));
          lmEl.style.display = "";
        },
        stop(editor) {
          const lmEl = this.getLayersEl(this.getRowEl(editor));
          lmEl.style.display = "none";
        },
      });
      editor.Commands.add("show-styles", {
        getRowEl(editor: any) {
          return editor.getContainer().closest(".editor-row");
        },
        getStyleEl(row: any) {
          return row.querySelector(".styles-container");
        },
        run(editor) {
          const smEl = this.getStyleEl(this.getRowEl(editor));
          smEl.style.display = "";
        },
        stop(editor) {
          const smEl = this.getStyleEl(this.getRowEl(editor));
          smEl.style.display = "none";
        },
      });

      // Event logs
      editor.on("run:export-template:before", (opts) => {
        console.log("Before the command run");
        if (0 /* some condition */) {
          opts.abort = 1;
        }
      });
      editor.on("run:export-template", () =>
        console.log("After the command run")
      );
      editor.on("abort:export-template", () => console.log("Command aborted"));

      // web-builder
    }
  }, []);

  return (
    <div>
      <div className="panel__top">
        <div className="panel__basic-actions"></div>
        <div className="panel__switcher"></div>
      </div>
      <div className="editor-row">
        <div className="editor-canvas">
          <div ref={containerRef}></div>
        </div>
        <div className="panel__right">
          <div className="layers-container"></div>
          <div className="styles-container"></div>
        </div>
      </div>
      <div id="blocks"></div>
    </div>
  );
}
