<template>
  <div id="app">
    <!-- keep-alive 被keep-alive包裹的组件都会被缓存下来，不会销毁 -->
    <!-- 通过include属性设置需要缓存的组件 -->
    <keep-alive include="index">
      <router-view/>
    </keep-alive>
  </div>
</template>

<style lang="less">
</style>
