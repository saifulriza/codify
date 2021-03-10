<template>
  <li>
    <div
      :class="{
        'btn btn-success btn-sm m-1': isFolder,
        'btn btn-primary btn-sm m-1': !isFolder,
      }"
      @click="isFolder ? toggle() : showCode(file.path)"
      @dblclick="makeFolder"
    >
      {{ file.name }}

      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder && file.children">
      <file-view
        class="item"
        v-for="(child, index) in file.children"
        :key="index"
        :data="child"
        @make-folder="emit('make-folder', event)"
        @add-item="emit('add-item', event)"
      ></file-view>
      <li class="add" @click="emit('add-item', data)">+</li>
    </ul>
  </li>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
import showCode from "@/utils/showCode";
export default {
  name: "fileView",
  props: {
    data: Object,
  },
  setup(props, { emit }) {
    const file = ref(props.data);
    let isOpen = ref(false);
    const isFolder = computed(() => {
      if (typeof file.value !== "undefined") {
        if (typeof file.value !== "undefined") {
          if (typeof file.value.children !== "undefined") {
            if (file.value.type == "directory") {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
        return false;
      } else {
        return false;
      }
    });
    function toggle() {
      if (isFolder) {
        isOpen.value = !isOpen.value;
      }
    }

    function makeFolder() {
      if (!isFolder) {
        emit("make-folder", props.data);
        isOpen.value = true;
      }
    }
    watch(
      () => props.data,
      (first, second) => {}
    );
    onMounted(() => {});
    return {
      file,
      isFolder,
      isOpen,
      toggle,
      makeFolder,
      showCode,
    };
  },
};
</script>
