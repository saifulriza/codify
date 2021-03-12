<template>
  <div id="container-fluid">
    <div class="row m-2">
      <div class="col-xl-2 drag resize">
        <div class="btn btn-success btn-sm m-2" @click="showFolder">
          Open
        </div>
        <!-- <div class="btn btn-danger btn-sm m-2" @click="openCollab">
          Collab
        </div> -->
        <div class="btn btn-danger btn-sm m-2" @click="clearProject">
          New
        </div>
        <ul id="demo">
          <file-view
            class="item"
            v-for="(child, index) in tree"
            :key="index"
            :data="child"
          ></file-view>
        </ul>
      </div>
      <div class="col-xl-10">
        <div class="row" id="base-tab"></div>
        <div id="base-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import "bootstrap";

// import Terminal from "@/components/Terminal";
// import FolderList from "@/components/FolderList";
import { onMounted, ref } from "vue";
import { get, set, clear } from "idb-keyval";
import interact from "interactjs";
import { directoryOpen } from "browser-fs-access";
import { editor } from "monaco-editor";

import { addNode, tree } from "@/utils/Tree";
import fileView from "@/components/FileView";
// import showCode from "@/utils/showCode";
import createElement from "@/utils/createElement";
import initEditor from "@/utils/initEditor";
import { useRoute } from "vue-router";
import checkSupport from "@/utils/checkSupport";

export default {
  name: "Home",
  components: {
    fileView,
    // Terminal,
    // FolderList,
  },
  setup(props, ctx) {
    let folder = ref([]);
    let folderTree = ref([]);
    const route = useRoute();

    // function setZIndex() {
    //   let elem = document.getElementById("drag");
    //   elem.addEventListener("dragend", function(event) {
    //     event.target.style.zIndex = "2";
    //   });
    // }

    function isAlreadyCollab(el) {
      let elem = document.getElementById(el);
      if (elem) {
        return true;
      } else {
        return false;
      }
    }
    let idEl = Math.round(Math.random() * 10000);
    function openCollab() {
      if (!isAlreadyCollab(idEl)) {
        createElement(idEl);
        initEditor(idEl);
      }
    }
    function openCollabExist(id) {
      if (!isAlreadyCollab(id)) {
        createElement(id);
        initEditor(id);
      }
    }
    function clearProject() {
      clear();
      tree.value = {};
    }

    function addDrag(el) {
      const position = { x: 0, y: 0 };
      interact(el).draggable({
        listeners: {
          start(event) {},
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
          end(event) {},
        },
      });
    }

    const getFile = (blobs) => {
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

    async function changeTheme() {
      await fetch("/themes/monokai-transparent-2.json")
        .then((data) => data.json())
        .then((data) => {
          editor.defineTheme("monokai-transparent-2", data);
          editor.mi;
          editor.setTheme("monokai-transparent-2");
        });
    }

    onMounted(() => {
      if (checkSupport()) {
        changeTheme();
        addResize(".xterm-screen");
        addDrag(".drag");
        addResize(".resize");
        if (route.query.id) {
          openCollabExist(route.query.id);
        }
      } else {
        alert(
          "browser anda tidak disupport, silahkan gunakan chrome versi terbaru atau edge"
        );
      }
    });

    return {
      showFolder,
      folder,
      // showCode,
      tree,
      folderTree,
      clearProject,
      openCollab,
    };
  },
};
</script>
<style lang="scss">
// @import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
ul {
  list-style: none;
}
.editor-section {
  border: 1px solid rgb(92, 92, 92);
}

.monaco-scrollable-element .editor-scrollable {
  background: transparent !important;
}
.monaco-remote-cursor {
  background: none !important;
}
</style>
