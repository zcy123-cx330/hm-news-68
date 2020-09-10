<template>
  <div class="deom">
      <vue-cropper></vue-cropper>
  </div>
</template>

<script>
// ==注意1：引入的图片地址不能是本地的==

// ==需要给父盒子指定宽高==

import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  }
}
</script>

<style lang="less">
.deom {
    width: 100%;
    height: 100%;
    position: fixed;
}

</style>
