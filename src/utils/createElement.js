import removeElement from "@/utils/removeElement";

function createScript() {
  var script = document.createElement("script");
  script.innerHTML = removeElement;
  document.head.appendChild(script);
}

export default function createElemen(id) {
  createScript();
  let base = document.getElementById("base-editor");
  let parent = document.createElement("div");
  let elem = document.createElement("div");
  let spanTitle = document.createElement("span");

  parent.setAttribute("class", "resize p-2 m-2");

  elem.setAttribute("id", id);
  elem.setAttribute(
    "class",
    "drag p-2 m-2 editor-section text-white font-weight-bold"
  );
  elem.setAttribute(
    "style",
    "height:80vh; widht:90vw; padding:6px; z-index:1;"
  );
  elem.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
  <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
  <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5" onclick="removeElement('${id}')"></circle>
  <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5" ></circle>
  <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle>
  </g>
  </svg>`;

  spanTitle.setAttribute("class", "m-2");
  spanTitle.innerHTML = id;

  elem.appendChild(spanTitle);
  parent.appendChild(elem);

  base.appendChild(parent);
}
