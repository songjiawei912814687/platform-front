<template>
    <a-layout>
        <global-header></global-header>
        <a-layout style="height: calc(100% - 80px);">
            <global-content></global-content>
        </a-layout>
    </a-layout>
</template>

<script>
import GlobalHeader from '@/components/GlobalLayout/GlobalHeader.vue';
import GlobalContent from '@/components/GlobalLayout/GlobalContent.vue';
import { Layout } from 'ant-design-vue';

export default {
  name: 'IndexWrap',
  components: {
    ALayout: Layout,
    GlobalHeader,
    GlobalContent,
  },
};
</script>

<style scoped>
    /* @import "../common/base.less"; */
    @import '../common/common.css';
</style>
