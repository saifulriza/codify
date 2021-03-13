<template>
  <button class="btn btn-outline-info btn-sm m-2">
    Index.vue <span>Ⓧ</span>
  </button>
</template>

<script>
import { ref } from "vue";

export default {
  name: "tab",
  props: {
    el: String,
  },
  setup(props) {
    let el = ref(props.el);
    return {
      el,
    };
  },
};
</script>
