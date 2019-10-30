<template>
  <div class="button-wrap">
    <div class="position-wrap">
      <p>您好，欢迎使用富阳区自助查询机</p>
      <img :src="icon1" @click="linkto('guide')" />
      <img :src="icon2" @click="linkto('question')" />
      <img :src="icon3" @click="linkto('selfForm')" />
    </div>
  </div>
</template>

<script>
import { Button } from "ant-design-vue";
import icon1 from "@/assets/icon1.png";
import icon2 from "@/assets/icon2.png";
import icon3 from "@/assets/icon3.png";

export default {
  name: "HomePage",
  components: {
    AButton: Button
  },
  data() {
    return {
      icon1,
      icon2,
      icon3
    };
  },
  methods: {
    linkto(froms) {
      let _url = "";
      if (froms == "guide") {
        _url = "/index/userguide";
      } else if (froms == "question") {
        _url = "/index/consultquestion";
      } else if (froms == "selfForm") {
        _url = "/index/selfform";
      }
      this.$router.push(_url);
    }
  }
};
</script>

<style scoped lang="less">
.button-wrap {
  height: 100%;
  position: relative;
  background-image: url("/images/common/bg.png");
  background-size: cover;
  .position-wrap {
    position: absolute;
    width: 100%;
    height: 300px;
    top: 50%;
    margin-top: -230px;
    text-align: center;
    img {
      margin: 0 0.5%;
      cursor: pointer;
    }
    p {
      font-size: 45px;
      text-align: center;
      margin-bottom: 80px;
      color: #10457a;
    }
  }
}
</style>
