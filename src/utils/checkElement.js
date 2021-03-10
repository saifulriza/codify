export default function checkElement(id) {
  let element = document.getElementById(id);
  if (element) return true;
  return false;
}
