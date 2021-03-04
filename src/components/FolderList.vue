<template>
  <div class="card pointer text-center p-0 m-0 bg-black20">
    <div class="card-body p-2">
      <details>
        <summary
          ><span
            class="badge badge-primary text-wrap"
            style="max-width: 9rem;"
            >{{ name }}</span
          ></summary
        >
        <file-list name="index" />
      </details>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import FileList from "@/components/FileList.vue";
export default {
  components: {
    FileList,
  },
  name: "FolderList",
  props: {
    name: String,
  },
  setup() {
    const collapsed = ref(false);
    return {
      collapsed,
    };
  },
};
</script>

<style lang="scss">
@import "../styles/global.css";
details summary::-webkit-details-marker {
  display: none;
}
.bg-black20 {
  background: #b2b2b2 !important;
}
</style>
