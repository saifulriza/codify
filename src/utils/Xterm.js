import { Terminal } from "xterm";
import { SearchAddon } from "xterm-addon-search";
import { FitAddon } from "xterm-addon-fit";
const xterm = new Terminal({
  cursorBlink: true,
  cols: 50,
  rows: 4,
});
xterm.loadAddon(new SearchAddon());
xterm.loadAddon(new FitAddon());
export default xterm;
