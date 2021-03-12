import removeElement from "@/utils/removeElement";
import createTabElement from "@/utils/createTabElement";
export default function minimizeElement(el) {
  let remove = removeElement;
  let create = createTabElement;
  remove(el);
  create(el);
}
