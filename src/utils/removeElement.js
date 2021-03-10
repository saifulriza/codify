export default function removeElement(id) {
  let element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
