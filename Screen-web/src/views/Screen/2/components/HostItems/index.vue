<template>
    <div class="bg_div">
        <div class="bg_title">
            热门事项办件量
        </div>
        <div class="bg_body">
            <div class="divSize">
                <a-row v-for="(item, index) in hotEvent" :key="index"
                       style="margin-top: 50px; position: relative;padding-left: 120px; top: 0px">
                    <span class="text">{{item.qlNames}}</span>
                    <a-col :span="15">
                        <div class="tiao">
                            <img :src="`/images/common/tiao_${index + 1}_0.png`"
                                 :style="{width: '100%',height:'12px',position:'absolute',top:0,left:'55px'}"/>
                            <img :src="`/images/common/tiao_${index + 1}_1.png`"
                                 :style="{width: parseInt(item.point)+'%',height:'12px',position:'absolute',top:0,left:'55px'}"/>

                        </div>
                    </a-col>
                    <a-col :span="4" style="padding-left: 10px;position: relative;left: 55px">
                        <span class="text_1" style="font-size: 16px">{{item.count}}件</span>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script>
    import { Row, Col } from 'ant-design-vue'
    import {getToken} from "@/remote/screen2";
    import {autoDoFn} from "@/utils/util";
    import {getHot} from "@/remote/screen2";

    export default {
        name: "index",
        components: {
            ARow: Row,
            ACol: Col
        },
        data() {
            return{
                token: '',
                hotEvent: [{qlNames: '', count: 0,point: 0}],
            }
        },
        created() {
            autoDoFn(async () => {
                const res = await getToken();
                if (res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    //获取组织
                    this.getHot(res.data)
                }
            });
        },
        methods: {
            getHot(token) {
                autoDoFn(async () => {
                    const res = await getHot({token});
                    if (res.success) {
                        this.hotEvent = res.data
                    }
                });
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/less/bg_div.less";
    .bg_div{
        >.bg_body{
            height: 312px;
            .divSize{
                height: 110%;
                top: -43px
            }
        }
    }


</style>
