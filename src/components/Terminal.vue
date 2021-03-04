<template>
  <div class="console" id="terminal-1"></div>
</template>
<script>
import { onBeforeUnmount, onMounted } from "vue";
// import * as Terminal from 'xterm'
import xterm from "@/utils/Xterm";
export default {
  name: "Console",
  props: {
    terminal: {
      type: Object,
      default: {},
    },
  },
  setup() {
    let dir = "PS D:/Project/Codify> ";
    onMounted(() => {
      let terminalContainer = document.getElementById("terminal-1");
      xterm.open(terminalContainer);
      xterm.write("Jendela Powerhell \r\n");
      xterm.write(
        "Copyright (C) 2021 Mikrosop Corporation. All rights reserved. \r\n"
      );
      xterm.write(dir);
      xterm.onKey((keyboard) => {
        if (keyboard.key == "\u007f") {
          xterm.write("\b \b");
        } else if (keyboard.key == "\r") {
          entering();
        } else {
          xterm.write(keyboard.key);
        }
      });
    });
    function entering() {
      xterm.write("\r\n" + dir);
    }

    onBeforeUnmount(() => {});

    return {};
  },
};
</script>
<style src="../../node_modules/xterm/css/xterm.css"></style>
