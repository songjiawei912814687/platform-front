<template>
    <a-popover title="Home" >
        <template slot="content" >
            <a-row style="width: 40vh">
                <a-col span="8">
                    <a :href="systemUrl.bigdata" :target="self" style="margin: 2px" v-if="authorityActionList.indexOf('A_PERSONNEL_SYSTEM') > -1">
                        <img src="../../assets/icon/大数据平台.png" style="width: 10vh"/>
                        <p class="item__title">大数据汇聚平台</p>
                    </a>
                </a-col>
                <a-col span="8">
                    <a :href="systemUrl.personnel" :target="self" style="margin: 2px" v-if="authorityActionList.indexOf('A_PERSONNEL_PERSONNEL') > -1">
                        <img src="../../assets/icon/人力资源.png" style="width: 10vh"/>
                        <p class="item__title">人员管理系统</p>
                    </a>
                </a-col>
                <a-col span="8">
                    <a :href="systemUrl.attendance"  :target="self" style="margin: 2px" v-if="authorityActionList.indexOf('A_PERSONNEL_ATTENDANCE') > -1">
                        <img src="../../assets/icon/考勤.png" style="width: 10vh"/>
                        <p class="item__title">考勤请假系统</p>
                    </a>
                </a-col>
            </a-row>
            <a-row style="width: 40vh">
                <a-col span="8">
                    <a :href="systemUrl.meeting" class="list__item" :target="self" v-if="authorityActionList.indexOf('A_PERSONNEL_MEETING') > -1">
                        <img src="../../assets/icon/会议.png" style="width: 10vh"/>
                        <p class="item__title">会议室预约系统</p>
                    </a>
                </a-col>
                <a-col span="8">
                    <a :href="systemUrl.assessment" class="list__item" :target="self" v-if="authorityActionList.indexOf('A_PERSONNEL_ASSESSMENT') > -1">
                        <img src="../../assets/icon/考核.png" style="width: 10vh"/>
                        <p class="item__title">效能考核系统</p>
                    </a>
                </a-col>
                <a-col span="8">
                    <a id="message" :href="systemUrl.message" class="list__item" :target="self" v-if="authorityActionList.indexOf('A_PERSONNEL_MESSAGE') > -1">
                        <img src="../../assets/icon/短信发送.png" style="width: 10vh"/>
                        <p class="item__title">短信发送系统</p>
                    </a>
                </a-col>
            </a-row>

            <a-row style="width: 40vh">
                <a-col span="8">
                    <a id="feedblank" :href="systemUrl.feedblank" class="list__item" :target="self" v-if="authorityActionList.indexOf('A_PERSONNEL_FEEDBACK') > -1">
                        <img src="../../assets/icon/投诉建议.png" style="width: 10vh"/>
                        <p class="item__title">投诉建议系统</p>
                    </a>
                </a-col>
                <a-col span="8">
                    <a id="knowledge" :href="systemUrl.knowledge" class="list__item" :target="self" v-if="authorityActionList.indexOf('A_PERSONNEL_KNOWLEDGE') > -1">
                        <img src="../../assets/icon/知识库.png" style="width: 10vh"/>
                        <p class="item__title">知识库系统</p>
                    </a>
                </a-col>


               <!--<a-col span="8">-->
                   <!--<a id="hkPlatform" :href="systemUrl.hkPlatform + this.token" target="_blank" class="list__item">-->
                       <!--<img src="../../assets/icon/道闸门禁.png" style="width: 10vh"/>-->
                       <!--<p class="item__title">道闸门禁系统</p>-->
                   <!--</a>-->
               <!--</a-col>-->


            </a-row>









<!--
                <a-col span="8">
                    <a id="lineUp" :href="systemUrl.lineUp" target="_blank" class="list__item">
                        <img src="../../assets/icon/排队叫号.png" style="width: 10vh"/>
                        <p class="item__title">排队叫号系统</p>
                    </a>
                </a-col>
-->


<!--

           <a-row style="width: 40vh">
               <a-col span="8">
                   <a id="decision" :href="systemUrl.decision" target="_blank" class="list__item">
                       <img src="../../assets/icon/辅助决策.png" style="width: 10vh"/>
                       <p class="item__title">辅助决策系统</p>
                   </a>
               </a-col>
-->


<!--
               <a-col span="8">
                   <a id="plate" :href="systemUrl.plate" target="_blank" class="list__item">
                       <img src="../../assets/icon/智慧餐盘.png" style="width: 10vh"/>
                       <p class="item__title">智慧餐盘系统</p>
                   </a>
               </a-col>

           </a-row>
-->













        </template>

        <a-button icon="home" style="background-color: transparent;border: transparent"></a-button>

    </a-popover>
</template>

<script>
    import {Popover, Card, Button, Row, Col} from 'ant-design-vue';

    export default {
        name: 'index',
        components: {
            APopover: Popover,
            ACard: Card,
            AButton: Button,
            ARow: Row,
            ACol: Col
        },
        data() {
            return {
                systemUrl: window.defaultConfig.systemUrl,
                authorityActionList: window.authorityActionList,
            }
        }
    };
</script>

<style scoped>

</style>
