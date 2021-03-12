import createElement from "@/utils/createElement";
import getExstension from "@/utils/getExstension";
import checkElement from "@/utils/checkElement";
import detectLang from "@/utils/LanguangeDetect";
import { editor, KeyCode, KeyMod } from "monaco-editor";
import removeElement from "@/utils/removeElement";
import { get, set } from "idb-keyval";
let Editor = null;

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  if ((await fileHandle.queryPermission(options)) === "granted") {
    return true;
  }
  if ((await fileHandle.requestPermission(options)) === "granted") {
    return true;
  }
  return false;
}

async function verifyRead(fileHandle) {
  const options = {
    mode: "read",
  };
  if ((await fileHandle.queryPermission(options)) === "granted") {
    return true;
  }
  if ((await fileHandle.requestPermission(options)) === "granted") {
    return true;
  }
  return false;
}

async function isFileHandle(el) {
  let file = await get(el);
  if (typeof file == "object") {
    return true;
  } else if (typeof file == "string") {
    return false;
  } else {
    return false;
  }
}

function addEditor(el, val, lang) {
  Editor = editor.create(document.getElementById(el), {
    language: lang,
    value: val,
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  });

  Editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, async function() {
    const options = {
      mode: "readwrite",
    };
    try {
      isFileHandle(el).then(async (file) => {
        let code = new Blob([Editor.getValue()], { type: "text/plain" });
        if (file) {
          let fileHandle = await get(el);
          verifyPermission(fileHandle, true).then(async (write) => {
            if (write) {
              await writeFile(fileHandle, code);
            } else {
              console.error("Tidak diizinkan mengedit file");
            }
          });
        } else {
          const [fileHandle] = await window.showOpenFilePicker();
          await set(el, fileHandle);
          await writeFile(fileHandle, code);
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  //   Editor.onDidChangeModelContent(function(e) {
  //     console.log("event", e);
  //   });
}
export default async function showCode(path) {
  const ext = getExstension(path);
  if (!checkElement(path)) {
    createElement(path);
    const code = get(path).then((code) => {
      if (typeof code !== "string") {
        detectLang(ext).then(async (lang) => {
          verifyRead(code).then(async (read) => {
            if (read) {
              const file = await code.getFile();
              const contents = await file.text();
              addEditor(path, contents, lang);
            } else {
              console.error("Tidak diizinkan membaca file");
            }
          });
        });
      } else {
        detectLang(ext).then((lang) => {
          addEditor(path, code, lang);
        });
      }
    });
  } else {
    removeElement(path);
  }
}
