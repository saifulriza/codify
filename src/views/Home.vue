<template>
  <div id="container-fluid">
    <div class="row m-2">
      <div class="col-xl-2">
        <span v-for="(name, index) in folder" :key="index">
          <folder-list :name="name" class="m-1" @click="showCode(name)" />
        </span>
        <div class="btn btn-success" @click="showFolder">
          Open folder
        </div>
        <pre id="pre"></pre>
      </div>
      <div class="col-xl-10">
        <div id="base-editor">
          <div class="drag p-2 m-2" id="drag">
            <div
              id="editor-section"
              class="resize p-2 m-2 editor-section"
              style="height:80vh; widht:90vw; padding:6px; z-index:1"
            ></div>
            <!-- <div
              id="source-editor"
              class="resize p-2 m-2 editor-section"
              style="height:80vh; widht:90vw; padding:6px; z-index:1"
            ></div> -->
          </div>
        </div>
        <terminal class="m-2" />
      </div>
    </div>
    <!-- <button class="btn btn-primary" @click="runCode">Run</button> -->

    <!-- <div class="row m-2 d-flex flex-row justify-content-end">
      <div class="col-xl-10">
        <terminal class="m-2" />
      </div>
    </div> -->
  </div>
</template>

<script>
import "bootstrap";
import * as monaco from "monaco-editor";
import Terminal from "@/components/Terminal";
import FolderList from "@/components/FolderList";
import { onMounted, ref } from "vue";
import { get, set } from "idb-keyval";
import interact from "interactjs";
import { fileOpen, directoryOpen, fileSave } from "browser-fs-access";
import detectLang from "@/utils/LanguangeDetect";
// import * as MonacoCollabExt from "@convergencelabs/monaco-collab-ext";
import Convergence from "@convergence/convergence";
import MonacoConvergenceAdapter from "@/utils/EditorAdapter";
import checkId from "@/utils/StrangerCollaboration";

export default {
  name: "Home",
  components: {
    Terminal,
    FolderList,
  },
  setup(props, ctx) {
    let codeEditor = null;
    let nama = "src/composnent/file.vue";
    let folder = ref([]);
    let curId = ref("");

    const CONVERGENCE_URL =
      "http://192.168.99.100:8000/api/realtime/convergence/default";

    const sourceUser = {
      id: "source",
      label: "Source User",
      color: "transparent",
    };

    const username = "User-" + Math.round(Math.random() * 10000);
    const staticUser = {
      id: "static",
      label: "Static User",
      color: "blue",
    };

    function createElemen(id) {
      let elem = document.createElement("div");
      let base = document.getElementById("base-editor");
      elem.setAttribute("id", id);
      elem.setAttribute("class", "drag p-2 m-2 editor-section");
      elem.setAttribute(
        "style",
        "height:80vh; widht:90vw; padding:6px; z-index:1"
      );
      base.appendChild(elem);
    }

    function initEditor(el, val, lang, theme) {
      codeEditor = monaco.editor.create(document.getElementById(el), {
        automaticLayout: true,
        value: val,
        language: lang,
        theme: theme,
        minimap: {
          enabled: false,
        },
      });

      // baru
      let domain;

      Convergence.connectAnonymously(CONVERGENCE_URL, username)
        .then((d) => {
          domain = d;
          console.log("domaiinnya", d);
          // Now open the model, creating it using the initial data if it does not exist.
          return domain.models().openAutoCreate({
            collection: "editor-section",
            id: checkId(),
            data: {
              text: val,
            },
          });
        })
        .then((model) => {
          const adapter = new MonacoConvergenceAdapter(
            codeEditor,
            model.elementAt("text")
          );
          adapter.bind();
          console.log("loaded");
        })
        .catch((error) => {
          console.error("Could not open model ", error);
        });

      // lama

      // const remoteCursorManager = new MonacoCollabExt.RemoteCursorManager({
      //   editor: codeEditor,
      //   tooltips: true,
      //   tooltipDuration: 2,
      // });
      // const sourceUserCursor = remoteCursorManager.addCursor(
      //   sourceUser.id,
      //   sourceUser.color,
      //   sourceUser.label
      // );
      // const staticUserCursor = remoteCursorManager.addCursor(
      //   staticUser.id,
      //   staticUser.color,
      //   staticUser.label
      // );
      // const remoteSelectionManager = new MonacoCollabExt.RemoteSelectionManager(
      //   { editor: codeEditor }
      // );
      // remoteSelectionManager.addSelection(
      //   sourceUser.id,
      //   sourceUser.color,
      //   sourceUser.label
      // );
      // remoteSelectionManager.addSelection(
      //   staticUser.id,
      //   staticUser.color,
      //   staticUser.label
      // );

      // const targetContentManager = new MonacoCollabExt.EditorContentManager({
      //   editor: codeEditor,
      // });
      // const source = monaco.editor.create(
      //   document.getElementById("source-editor"),
      //   {
      //     value: val,
      //     theme: theme,
      //     language: lang,
      //   }
      // );

      // source.onDidChangeCursorPosition((e) => {
      //   const offset = source.getModel().getOffsetAt(e.position);
      //   sourceUserCursor.setOffset(offset);
      // });

      // source.onDidChangeCursorSelection((e) => {
      //   const startOffset = source
      //     .getModel()
      //     .getOffsetAt(e.selection.getStartPosition());
      //   const endOffset = source
      //     .getModel()
      //     .getOffsetAt(e.selection.getEndPosition());
      //   remoteSelectionManager.setSelectionOffsets(
      //     sourceUser.id,
      //     startOffset,
      //     endOffset
      //   );
      // });

      // const sourceContentManager = new MonacoCollabExt.EditorContentManager({
      //   editor: source,
      //   onInsert(index, text) {
      //     codeEditor.updateOptions({ readOnly: false });
      //     targetContentManager.insert(index, text);
      //     codeEditor.updateOptions({ readOnly: true });
      //   },
      //   onReplace(index, length, text) {
      //     codeEditor.updateOptions({ readOnly: false });
      //     targetContentManager.replace(index, length, text);
      //     codeEditor.updateOptions({ readOnly: true });
      //   },
      //   onDelete(index, length) {
      //     codeEditor.updateOptions({ readOnly: false });
      //     targetContentManager.delete(index, length);
      //     codeEditor.updateOptions({ readOnly: true });
      //   },
      // });
    }
    function setZIndex() {
      let elem = document.getElementById("drag");
      elem.addEventListener("dragend", function(event) {
        console.log("mulai set z index");
        event.target.style.zIndex = "2";
        console.log("selesai set z index");
      });
    }

    async function changeTheme() {
      await fetch("/themes/monokai-transparent-2.json")
        .then((data) => data.json())
        .then((data) => {
          monaco.editor.defineTheme("monokai-transparent-2", data);
          monaco.editor.mi;
          monaco.editor.setTheme("monokai-transparent-2");
        });
    }

    function addDrag(el) {
      const position = { x: 0, y: 0 };
      interact(el).draggable({
        listeners: {
          start(event) {
            console.log("id nya", event.target.id);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
          end(event) {
            console.log("dapat idnya", event.target.id);
          },
        },
      });
    }
    const getExstension = (path) => {
      console.log("path", path);
      return path.split(".").pop();
    };
    const showCode = async (path) => {
      const ext = getExstension(path);
      let lang;
      createElemen(path);
      const code = get(path).then((code) => {
        console.log("kodenya 1", code);
        detectLang(ext).then((lang) => {
          console.log("kodenya", code);
          initEditor(path, code, lang, "monokai-transparent-2");
        });
      });
    };

    const getFile = (blobs) => {
      const panjang = blobs.length;
      Promise.all(
        blobs.map(async (blob, i) => {
          if (blob.name) {
            blob.text().then((text) => {
              // if (panjang === i + 1) {
              //   initEditor("editor-section", text, "javascript", "vs-dark");
              // }
              set(blob.webkitRelativePath, text);
            });
          }
          folder.value.push(blob.webkitRelativePath);
        })
      );
    };

    async function showFolder() {
      const options = {
        recursive: true,
      };
      try {
        const directoryName = await get("directory-name");
        if (directoryName) {
          getFile(directoryName);
          return;
        }
        const blobs = await directoryOpen(options);
        await set("directory-name", JSON.parse(JSON.stringify(blobs)));
        getFile(blobs);
      } catch (error) {
        console.log(error.name, error.message);
      }
    }
    function addResize(el) {
      interact(el).resizable({
        edges: { top: true, left: true, bottom: true, right: true },
        listeners: {
          move: function(event) {
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
          },
        },
      });
    }

    // function removeElement(className) {
    //   var elements = document.getElementsByClassName(className);
    //   while (elements.length > 0) {
    //     elements[0].parentNode.removeChild(elements[0]);
    //   }
    // }
    onMounted(() => {
      initEditor(
        "editor-section",
        "function hello() {\n\talert('Hello world!');\n}",
        "javascript",
        "vs-dark"
      );
      changeTheme();
      addResize(".resize");
      addResize(".xterm-screen");
      addDrag(".drag");
      setZIndex();
    });

    return { showFolder, folder, showCode };
  },
};
</script>
<style lang="scss">
.editor-section {
  border: 1px solid rgb(92, 92, 92);
}

.monaco-scrollable-element .editor-scrollable {
  background: transparent;
}
.monaco-remote-cursor {
  background: none !important;
}
</style>
