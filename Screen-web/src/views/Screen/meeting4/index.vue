<template>
    <div class="screenBox">
        <a-row :gutter="10" style="    height: 277px;">
            <a-col class="col_2" :span="10" style="float: right;">
                <div style="   font-size: 75px;font-family: initial;color: rgb(0, 101, 173);margin-top: 110px;margin-left: 180px;">
                    {{dates}}
                </div>
            </a-col>
        </a-row>

        <a-row :gutter="20" v-if="show">
            <a-col class="col_1" :span="8" style="text-align: center;width: 100%">

                <h1 style="font-size: 115px;margin: 215px 40px 215px;letter-spacing: 12px;color: #042b48;font-weight: bold;">

                    {{theme}}
                </h1>
                <div style="font-size: 55px;color: rgb(4, 43, 72);font-weight: bold;text-align: left;padding-left: 35%">
                    主办单位：{{organizationName}}<br/>
                    会议时间：{{time}}
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="20" v-if="showt">
            <a-col class="col_1" :span="8" style="text-align: center;width: 100%">
                <h1 style="font-size: 85px;margin: 240px 0px 110px;letter-spacing: 12px;color: #042b48;font-weight: bold;">
                    暂无会议
                </h1>

            </a-col>
        </a-row>



    </div>
</template>

<script>
    import moment from 'moment';
    import {getMeeting} from "@/remote/screen5";
    import {autoDoFn, formatWeek} from "@/utils/util";
    import {getToken} from "../../../remote/screen2";
    import {Row, Col} from 'ant-design-vue'
    import Weather from './components/weather'

    export default {
        name: "index",
        components: {
            Weather,
            ARow: Row,
            ACol: Col
        },
        data() {
            return {
                times:'',   //时分秒
                dates:'',   //年月日
                weeks:'',   //周几
                name: '',
                meetingInfo: '',
                nextdata: '',
                nexttime: '',
                theme: '',
                organizationName: '',
                time: '',
                timer: null,
                thirtyTimer: null,
                show:true,
                showt:false,

            }
        },
        created() {
            this.getData();
            this.setTimes();
            clearInterval(this.thirtyTimer);
            this.thirtyTimer = setInterval(() => {
                this.getData();
            }, 10000)
        },
        methods: {
            moment,
                setTimes() {
                this.times = moment().format('HH:mm:ss');
                this.dates = moment().format('YYYY/MM/DD');
                this.weeks = formatWeek(moment().format('d'));
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this.times = moment().format('HH:mm:ss');
                    this.dates = moment().format('YYYY / MM / DD');
                    this.weeks = formatWeek(moment().format('d'));
                }, 1000)
            },
            getData() {
                console.log("wowowowo")
                autoDoFn(async () => {
                    const res = await getToken();
                    if (res) {
                        localStorage.screenToken = res.data;
                        this.getMeeting(res.data)
                    }
                });
            },
            // 获取会议详情接口
            getMeeting(token) {
                autoDoFn(async () => {
                    const res = await getMeeting({token});
                    if(res && res.success && res.data) {
                        if(res.data.theme){
                            this.theme = res.data.theme;
                            this.time = res.data.realStartTime;
                            this.organizationName = res.data.hostUnit;
                            this.show = true;
                            this.showt=false;
                        }else {
                            this.theme = '';
                            this.time = '';
                            this.organizationName = "";
                            this.meetingInfo = res.data;
                            this.show = false;
                            this.showt=true;
                        }
                    }
                });
            },



        },
        destroyed() {
            clearInterval(this.timer);
            clearInterval(this.thirtyTimer);
        }
    }
</script>

<style lang="less" scoped>
    .screenBox {
        height: 100vh;
        background-size: cover;
        background-image: url(../../../assets/screen/meettingBg.jpg);
        background-position: center;
        overflow-y: hidden;
        overflow-x: hidden;

        .col_1 {

            .wea{
                position: relative;
                top: -240px;
                font-size: 40px;
            }
            .timesBox{
                font-size: 80px;
                position: relative;
                top: -400px;
                color: #f0f5ff;
            }
            .roomName {
                h1 {
                    color: white;
                    font-size: 150px;
                }

            }
        }
        .col_2{

            text-align: center;
            .title{
                text-align: left;
                width: 1500px;
                background-color: #2c3842;
                position: absolute;
                top: -195px;
                left: -55px;
                font-size: 72px;
                color: #c5c8ce;
            }
            .h2{

                color: white;
                font-size: 80px;
                width: 1500px;
				margin-top: 50px;
                overflow: hidden; /*自动隐藏文字*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                // white-space: nowrap; /*强制不换行*/
                width: 16em; /*不允许出现半汉字截断*/
            }
            .h3{
                font-size: 72px;
				margin-top: 50px;
                width: 1314px;
                color: white;
            }
            .h4{
                font-size: 72px;
                width: 1328px;
				margin-top: 50px;
                color: white;
            }
            .roomName {
                h1 {
                    color: white;
                    font-size: 150px;
                }
            }
        }
    }


</style>
