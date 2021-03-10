import { ref } from "vue";
export let tree = ref({});
export function addNode(obj) {
  let ptr = tree.value;
  let splitpath = obj.webkitRelativePath.replace(/^\/|\/$/g, "").split("/");

  for (let i = 0; i < splitpath.length; i++) {
    let node = {
      name: splitpath[i],
      type: "directory",
      size: obj.size,
      lastModified: obj.lastModified,
      path: obj.webkitRelativePath,
    };
    if (i == splitpath.length - 1) {
      node.size = obj.size;
      node.type = obj.type;
    }
    ptr[splitpath[i]] = ptr[splitpath[i]] || node;
    ptr[splitpath[i]].children = ptr[splitpath[i]].children || {};
    ptr = ptr[splitpath[i]].children;
  }
  let result = tree.value;
  tree.value = {};
  tree.value = result;
}
