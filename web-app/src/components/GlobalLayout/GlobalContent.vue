<template>
    <a-content :style="{ background: '#fff', borderLeft: '1px solid #d5d9df' }">
        <router-view/>
    </a-content>
</template>

<script>
import { Layout } from 'ant-design-vue';

const { Content } = Layout;

export default {
  name: 'GlobalContent',
  components: {
    AContent: Content,
  },
};
</script>

<style lang="less">
    .slide-fade{
        position: absolute;
        left:0;
        right: 0;
    }
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        left:0;
        right: 0;
        transform: translateX(50px);
        opacity: 0;
    }
</style>
