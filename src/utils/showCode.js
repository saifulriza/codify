import createElement from "@/utils/createElement";
import getExstension from "@/utils/getExstension";
import checkElement from "@/utils/checkElement";
import detectLang from "@/utils/LanguangeDetect";
import { editor } from "monaco-editor";
import removeElement from "@/utils/removeElement";
import { get } from "idb-keyval";
let Editor = null;
function addEditor(el, val, lang) {
  Editor = editor.create(document.getElementById(el), {
    language: lang,
    value: val,
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  });
}
export default async function showCode(path) {
  const ext = getExstension(path);
  if (!checkElement(path)) {
    createElement(path);
    const code = get(path).then((code) => {
      detectLang(ext).then((lang) => {
        addEditor(path, code, lang);
      });
    });
  } else {
    removeElement(path);
  }
}
