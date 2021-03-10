<template>
  <div id="container-fluid">
    <div class="row m-2">
      <div class="col-xl-2">
        <!-- <span v-for="(name, index) in folder" :key="index">
          <folder-list :name="name" class="m-1" @click="showCode(name)" />
        </span> -->
        <div class="btn btn-success" @click="showFolder">
          Open folder
        </div>
        <ul id="demo">
          <file-view
            class="item"
            v-for="(child, index) in tree"
            :key="index"
            :data="child"
            @click="showCode(child.path)"
          ></file-view>
        </ul>
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
        <!-- <terminal class="m-2" /> -->
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

import Terminal from "@/components/Terminal";
import FolderList from "@/components/FolderList";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { get, set } from "idb-keyval";
import interact from "interactjs";
import { fileOpen, directoryOpen, fileSave } from "browser-fs-access";

// import * as MonacoCollabExt from "@convergencelabs/monaco-collab-ext";

import { addNode, tree } from "@/utils/Tree";
import fileView from "@/components/FileView";
import showCode from "@/utils/showCode";
import initEditor from "@/utils/initEditor";
export default {
  name: "Home",
  components: {
    fileView,
    Terminal,
    FolderList,
  },
  setup(props, ctx) {
    let nodes = ref([]);
    let folder = ref([]);
    let folderTree = ref([]);

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

    const getFile = (blobs) => {
      const panjang = blobs.length;
      console.log(blobs);
      Promise.all(
        blobs.map(async (blob, i) => {
          if (blob.name) {
            blob.text().then((text) => {
              set(blob.webkitRelativePath, text);
            });
          }
          folderTree.value.push(addNode(blob));
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

    onMounted(() => {
      initEditor(
        "editor-section",
        "function hello() {\n\talert('Hello world!');\n}",
        "javascript",
        "vs-dark"
      );

      nodes.value.push({
        name: "2.txt",
        size: 0,
        type: "file",
        path: "/storage/test/asdf/2.txt",
      });
      changeTheme();
      addResize(".resize");
      addResize(".xterm-screen");
      addDrag(".drag");
      setZIndex();
    });

    return { showFolder, folder, showCode, tree, folderTree };
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
