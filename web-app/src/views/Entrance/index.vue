<template>
  <div class="out">
    <div class="div1">
      <p class="p1" @click="enter('/index/userguide')"></p>
    </div>
    <div class="div2">
      <p class="p2" @click="enter('/index/consultquestion')"></p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    enter(url) {
      this.$router.push(url);
    }
  }
};
</script>


<style lang="less" scoped>
* {
  margin: 0px;
  padding: 0px;
}
.out {
  background: url("/images/common/bg.png");
  height: calc(100%);
}
.div1 {
  height: 50%;
  position: relative;
}
.div2 {
  height: 50%;
  position: relative;
}
.p1 {
  background: url("/images/common/icon1.png") no-repeat center;
  background-size: 200px 200px;
  height: 200px;
  width: 200px;
  border-radius: 15px;
  position: absolute;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
.p2 {
  background: url("/images/common/icon2.png") no-repeat center;
  background-size: 200px 200px;
  height: 200px;
  width: 200px;
  border-radius: 15px;
  position: absolute;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
.ant-layout-content {
      background: rgb(255, 255, 255);
    border-left: 1px solid rgb(213, 217, 223);
  height: 100%;
}
</style>
