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
        <div>
          <div class="drag p-2 m-2">
            <div
              id="editor-section"
              class="resize p-2 m-2"
              style="height:80vh; widht:90vw; padding:6px"
            ></div>
          </div>

          <div
            id="editor-section-2"
            style="height:80vh; widht:90vw; padding:6px"
          ></div>
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
            console.log(event.type, event.target);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      });
    }

    const showCode = async (path) => {
      console.log("clicked");
      const code = await get(path).then((code) => {
        initEditor(
          "editor-section-2",
          code,
          "javascript",
          "monokai-transparent-2"
        );
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
      console.log(nama.split(".").pop());
    });

    return { showFolder, folder, showCode };
  },
};
</script>
<style lang="scss">
#editor-section {
  border: 1px solid rgb(92, 92, 92);
}
#editor-section-2 {
  border: 1px solid rgb(92, 92, 92);
}
.monaco-scrollable-element .editor-scrollable {
  background: transparent;
}
</style>
