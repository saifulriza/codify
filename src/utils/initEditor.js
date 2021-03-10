import * as monaco from "monaco-editor";
import Convergence from "@convergence/convergence";
import MonacoConvergenceAdapter from "@/utils/EditorAdapter";
import checkId from "@/utils/StrangerCollaboration";
const CONVERGENCE_URL =
  "http://192.168.99.100:8000/api/realtime/convergence/default";

// const sourceUser = {
// id: "source",
// label: "Source User",
// color: "transparent",
// };

const username = "Coder-" + Math.round(Math.random() * 10000);
// const staticUser = {
// id: "static",
// label: "Static User",
// color: "blue",
// };

let codeEditor = null;
export default function initEditor(el, val, lang, theme) {
  codeEditor = monaco.editor.create(document.getElementById(el), {
    automaticLayout: true,
    value: val,
    language: lang,
    theme: theme,
    minimap: {
      enabled: false,
    },
  });

  let domain;

  Convergence.connectAnonymously(CONVERGENCE_URL, username)
    .then((d) => {
      domain = d;
      return domain.models().openAutoCreate({
        collection: "editor-section",
        id: checkId(),
        data: {
          text: val,
        },
      });
    })
    .then((model) => {
      console.log("connected to websocket");
      const adapter = new MonacoConvergenceAdapter(
        codeEditor,
        model.elementAt("text")
      );
      adapter.bind();
    })
    .catch((error) => {
      console.error("Could not open model ", error);
    });
}
