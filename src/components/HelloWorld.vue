<template>
  <div id="container m-2">
    <div class="row">
      <div class="col-xl-12">
        <div id="editor-section"></div>
      </div>
    </div>
    <button class="btn btn-primary" @click="runCode">Run</button>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { onMounted } from "vue";

export default {
  name: "HelloWorld",
  setup() {
    let codeEditor = null;

    function initEditor() {
      codeEditor = monaco.editor.create(
        document.getElementById("editor-section"),
        {
          value: "function hello() {\n\talert('Hello world!');\n}",
          language: "javascript",
          theme: "vs-dark",
        }
      );
    }

    function runCode() {
      console.log("runCode");
      console.log(codeEditor.getValue());
    }

    onMounted(() => {
      initEditor();
    });

    return { codeEditor, runCode };
  },
};
</script>
<style>
.btn {
  color: red;
}
</style>
