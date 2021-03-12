export default function createTabElement(el) {
  let base = document.getElementById("base-tab");
  let tab = `
<button class="btn btn-outline-info btn-sm m-2" onclick="showCode('${el}')">
Index.vue <span>Ⓧ</span>
</button>`;
  base.innerHTML = tab;
}
