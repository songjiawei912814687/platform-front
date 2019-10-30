<template>
    <a-layout>
        <global-header></global-header>
        <a-layout>
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
};
</script>

<style scoped>
    @import "../../common/base.less";
</style>
