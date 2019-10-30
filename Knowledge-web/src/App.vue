<template>
    <a-locale-provider :locale="locale">
        <div id="app">
            <router-view/>
        </div>
    </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'ant-design-vue';

export default {
  components: {
    ALocaleProvider: LocaleProvider,
  },
  data() {
    return {
      locale: zhCN,
    };
  },
  created() {
    document.body.removeChild(document.getElementById('appLoading'));
    document.body.style.backgroundColor = '#fff';
    setTimeout(() => {
      document.getElementById('app').style.display = 'block';
    }, 500);
  },
};
</script>

<style lang="less">
    #app {
        height: 100%;
        overflow: hidden;
        font-size: 14px;
        .ant-layout {
            position: relative;
            height: 100%;
            width: 100%;
        }
    }

    #nprogress .bar {
        background: #fa541c !important;
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(150, 150, 150, 0.3);
    }

    ::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 1);
    }

    ::-webkit-scrollbar-track-piece {
        background-color: rgba(255, 255, 255, 0);
    }

</style>
