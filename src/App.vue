<template>
  <div id="app">
      <keep-alive :include="['Main']" :max="6">
          <router-view></router-view>
      </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
    }
  }
};
</script>

<style lang="less">
   
   #app{
    height: 100%;
    position: relative;
  }
</style>
