<template>
  <div id="app">
    <router-view />
    <comfirm-box></comfirm-box>
  </div>
</template>

<script>
import ComfirmBox from "./components/ConfirmBox/ComfirmBox.vue";
export default {
  components: {ComfirmBox},
  name: "App",
};
</script>

<style src="./styles/app.scss" lang="scss" />
