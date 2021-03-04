<template>
  <div class="card pointer text-center p-0 m-0 bg-black10">
    <div class="card-body p-2">
      <span class="badge badge-success">{{ name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "FileList",
  props: {
    name: String,
  },
  setup() {},
};
</script>

<style lang="scss">
@import "../styles/global.css";
.bg-black10 {
  background: #484747 !important;
}
</style>
