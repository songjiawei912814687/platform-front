<template>
    <div class="screen-wrap2">
        <div class="title">
            <span class="title_img">
                <span>富</span> <span>阳</span>
                <span>区</span> <span>政</span>
                <span>务</span> <span>服</span>
                <span>务</span> <span>大</span>
                <span>数</span> <span>据</span>
                <span>平</span> <span>台</span>
            </span>
        </div>
        <a-row :gutter="20">
            <a-col :span="6" class="content">
                <satisfaction></satisfaction>
                <waiting-person></waiting-person>
                <situation-rotates-sow></situation-rotates-sow>
            </a-col>
            <a-col :span="12" class="content">
                <business-people></business-people>
            </a-col>
            <a-col :span="6" class="content">
                <do-things></do-things>
                <visiting></visiting>
                <hot-items></hot-items>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {Row, Col} from 'ant-design-vue'
    import Satisfaction from './components/Satisfaction'
    import WaitingPerson from './components/WaitingPerson'
    import SituationRotatesSow from './components/SituationRotatesSow'
    import BusinessPeople  from './components/BusinessPeople'
    import DoThings from './components/DoThings'
    import Visiting from './components/Visiting'
    import HotItems from './components/HostItems'
    export default {
        name: "index",
        components:{
            ARow: Row,
            ACol: Col,
            Satisfaction,
            WaitingPerson,
            SituationRotatesSow,
            BusinessPeople,
            DoThings,
            Visiting,
            HotItems
        }
    }
</script>

<style lang="less" scoped>
    html { -ms-overflow-style:none; overflow:-moz-scrollbars-none;}html::-webkit-scrollbar{width:0px}
.screen-wrap2{
    overflow-y: hidden;
    .title{
        text-align: center;
        background-size:cover;
        background-image: url(../../../assets/screen/title.png);
        background-position: center;
        .title_img{
            font-size: 100px;
            color: rgb(41  227  255);
            font-family: "Arial","Microsoft YaHei";
            font-weight: 500;
            span{
                margin: 10px;
            }
        }
    }

    background-color: #0e1026;
    height: 100vh;
    padding: 0 20px 20px 20px;

}
</style>
