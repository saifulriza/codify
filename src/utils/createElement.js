export default function createElemen(id) {
  let elem = document.createElement("div");
  let base = document.getElementById("base-editor");
  elem.setAttribute("id", id);
  elem.setAttribute("class", "drag p-2 m-2 editor-section");
  elem.setAttribute("style", "height:80vh; widht:90vw; padding:6px; z-index:1");
  base.appendChild(elem);
}
