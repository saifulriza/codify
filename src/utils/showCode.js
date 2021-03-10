import createElement from "@/utils/createElement";
import getExstension from "@/utils/getExstension";
import checkElement from "@/utils/checkElement";
import detectLang from "@/utils/LanguangeDetect";
import initEditor from "@/utils/initEditor";
import removeElement from "@/utils/removeElement";
import { get } from "idb-keyval";
export default async function showCode(path) {
  const ext = getExstension(path);
  let lang;
  if (!checkElement(path)) {
    createElement(path);
    const code = get(path).then((code) => {
      detectLang(ext).then((lang) => {
        initEditor(path, code, lang, "monokai-transparent-2");
      });
    });
  } else {
    removeElement(path);
  }
}
