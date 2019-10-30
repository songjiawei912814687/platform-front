<template>
    <a-layout>
        <a-layout>
            <global-content></global-content>
        </a-layout>
    </a-layout>
</template>

<script>
import GlobalContent from '@/components/GlobalLayout/GlobalContent.vue';
import { Layout } from 'ant-design-vue';

export default {
  name: 'IndexWrap',
  components: {
    ALayout: Layout,
    GlobalContent,
  },
};
</script>

<style scoped>
    /* @import "../common/base.less"; */
    @import '../common/common.css';
</style>
