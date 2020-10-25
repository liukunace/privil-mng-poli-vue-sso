<template>

  <div class="zm underline" style="width: 1200px;">
    <zmap-button type="warning" >Test</zmap-button>
    <zmap-select v-model="data" multiple class="wid115" >
      <zmap-option label="测试1" value="test1"></zmap-option>
      <zmap-option label="测试2" value="test2"></zmap-option>
      <zmap-option label="测试3" value="test3"></zmap-option>
      <zmap-option label="测试5" value="test5"></zmap-option>
    </zmap-select>
    <zmap-map @click="mapClickTest(this)" ref="baseMap" overView="bottom-left">
    </zmap-map>

  </div>

</template>

<script>
  export default {
    name: "zmap",
    components: {
    },
    data () {
      return {
        msg: '欢迎使用 zmap-ui，智耘科技',
        show1: false,
        size: '',
        data: ['test1'],
      }
    },
    methods: {
      showSize(item) {
        this.size = item;
        this.show1 = true
      },
      mapClickTest(e){
        let map=this.$def.map;
        console.log("外部调用测试信息：outer info");
      }
    }
  }
</script>

<style scoped>

</style>
