<template>
    <a-layout>
        <global-header></global-header>
        <a-layout :style="{'margin-top':top}">
            <global-menu></global-menu>
            <global-content></global-content>
        </a-layout>
    </a-layout>
</template>

<script>
import GlobalHeader from '@/components/GlobalLayout/GlobalHeader.vue';
import GlobalMenu from '@/components/GlobalLayout/GlobalMenu.vue';
import GlobalContent from '@/components/GlobalLayout/GlobalContent.vue';
import { Layout } from 'ant-design-vue';

export default {
  name: 'IndexWrap',
  components: {
    ALayout: Layout,
    GlobalHeader,
    GlobalMenu,
    GlobalContent,
  },
  data() {
      return {
        code:'',
        top:'0px',
        val:0,
      }
  },
  mounted: function () {
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  watch:{
    $route(){
        this.code = this.$route.query.code
        if(this.code==='staff'||this.code==='department'||this.code==='window'||this.code==='complaint'){
            var agent = navigator.userAgent.toLowerCase() ;
            var regStr_chrome = /chrome\/[\d.]+/gi ;
            if(agent.indexOf("chrome") > 0&&agent.match(regStr_chrome)=="chrome/72.0.3610.2"){
                this.val=this.val+80;
                this.top = this.val+'px';
            }
            else
              {
                this.top = '80px';
              }
        }
        document.querySelector("#"+this.code).scrollIntoView(true);
    },
  },
  methods: {
        handleScroll: function () {
            // 设备/屏幕高度
             var staff = document.getElementById("staff").getBoundingClientRect();
             var department = document.getElementById("department").getBoundingClientRect();
             var window = document.getElementById("window").getBoundingClientRect();
             var complaint = document.getElementById("complaint").getBoundingClientRect();
             if(complaint.top<=250){
                 document.getElementById("complaint1").parentNode.className="ant-menu-item ant-menu-item-selected";
                 document.getElementById("window1").parentNode.className="ant-menu-item";
                 document.getElementById("department1").parentNode.className="ant-menu-item";
                 document.getElementById("staff1").parentNode.className="ant-menu-item";
                 return;
             }
             if(window.top<=250){
                 document.getElementById("window1").parentNode.className="ant-menu-item ant-menu-item-selected";
                 document.getElementById("complaint1").parentNode.className="ant-menu-item";
                 document.getElementById("department1").parentNode.className="ant-menu-item";
                 document.getElementById("staff1").parentNode.className="ant-menu-item";
                 return;
             }
             if(department.top<=250){
                 document.getElementById("department1").parentNode.className="ant-menu-item ant-menu-item-selected";
                 document.getElementById("complaint1").parentNode.className="ant-menu-item";
                 document.getElementById("window1").parentNode.className="ant-menu-item";
                 document.getElementById("staff1").parentNode.className="ant-menu-item";
                 return;
             }
             document.getElementById("staff1").parentNode.className="ant-menu-item ant-menu-item-selected";
             document.getElementById("complaint1").parentNode.className="ant-menu-item";
             document.getElementById("department1").parentNode.className="ant-menu-item";
             document.getElementById("window1").parentNode.className="ant-menu-item";
        }
    },
    destroyed: function () {
        window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
    }
};
</script>

<style>
    @import "../../common/base.less";
    .common-title{
        background-color: #0cd3f0;
        line-height: 2;
        padding-left: 35px;
        color: #fff;
        font-size: 36px;
    }
    .common-subtitle{
        margin-left: 15px;
        font-size: 24px;
        line-height: 1.8;
        color: #222;
    }
    .common-sub-subtitle{
        margin-left: 30px;
        font-size: 20px;
        line-height: 1.8;
        color: #444;
    }
    .echarts {
        height: 100%;
        width: 100%;
    }
</style>
