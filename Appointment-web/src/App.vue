<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="less">
    #app {
        height: 100%;
        overflow: hidden;
        font-size: 14px;

    }
    #app .ant-layout {
        position: relative;
        height: 100%;
        width: 100%;
    }
    #app .ant-layout-content{
        overflow-y: auto;
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
