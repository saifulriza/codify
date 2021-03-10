export default function createElemen(id) {
  let base = document.getElementById("base-editor");
  let parent = document.createElement("div");
  let elem = document.createElement("div");

  parent.setAttribute("class", "resize p-2 m-2");

  elem.setAttribute("id", id);
  elem.setAttribute("class", "drag p-2 m-2 editor-section");
  elem.setAttribute("style", "height:80vh; widht:90vw; padding:6px; z-index:1");

  parent.appendChild(elem);
  base.appendChild(parent);
}
