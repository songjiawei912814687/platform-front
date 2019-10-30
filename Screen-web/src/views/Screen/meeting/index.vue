<template>
    <div class="screenBox">
        <a-row :gutter="20">
            <a-col class="col_1" :span="8">
                <span class="roomName">
                    <h1>{{name}}</h1>
                </span>

            </a-col>
            <a-col class="col_2" :span="10">
                <div class="title">当前会议:</div>
                <span class="roomName">
                    <div v-if="this.theme === ''" class="h2">{{meetingInfo}}</div>
                    <div class="h2" >{{theme}}</div>
                    <div class="h3">{{time}}</div>
                    <div class="h4">{{organizationName}}</div>
                </span>
            </a-col>

        </a-row>
        <a-row :gutter="20">
            <a-col class="col_1" :span="8">
                <!-- <weather class="wea"></weather> -->
                <div class="timesBox left">
                    <div class="times">{{times}}</div>
                    <div class="dates">{{dates}} <span>{{weeks}}</span></div>
                </div>
            </a-col>
            <a-col class="col_2" :span="10">
                <div class="title">下一场会议:</div>
                <span class="roomName">
                    <div class="h2">{{nextdata}}</div>
                    <div class="h3">{{nexttime}}</div>
                </span>
            </a-col>
        </a-row>


    </div>
</template>

<script>
    import moment from 'moment';
    import {getMeetingRoom, getMeeting, nextMeeting} from "@/remote/screen4";
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
                this.dates = moment().format('YYYY 年 MM 月 DD日');
                this.weeks = formatWeek(moment().format('d'));
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this.times = moment().format('HH:mm:ss');
                    this.dates = moment().format('YYYY 年 MM 月 DD日');
                    this.weeks = formatWeek(moment().format('d'));
                }, 1000)
            },
            getData() {
                console.log("wowowowo")
                autoDoFn(async () => {
                    const res = await getToken();
                    if (res) {
                        localStorage.screenToken = res.data;
                        this.getMeetingRoom(res.data);
                        this.getMeeting(res.data)
                        this.nextMeeting(res.data)
                    }
                });
            },
            getMeetingRoom(token) {
                autoDoFn(async () => {
                    const res = await getMeetingRoom({token});
                    if (res && res.success && res.data) {
                        this.name = res.data.name;
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
                            this.time = res.data.time;
                            this.organizationName = res.data.organizationName
                        }else {
                            this.theme = '';
                            this.time = '';
                            this.organizationName = "";
                            this.meetingInfo = res.data;
                        }
                    }
                });
            },

            // 下场会议
            nextMeeting(token) {
                autoDoFn(async () => {
                    const res = await nextMeeting({token});
                    if(res && res.success && res.data) {
                        if(res.data.theme){
                            this.nextdata = res.data.theme;
                            this.nexttime = res.data.time
                        }else {
                            this.nextdata = "";
                            this.nexttime = "";
                            this.data = res.data;
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
        background-image: url(../../../assets/screen/metting.png);
        background-position: center;
        overflow-y: hidden;
        overflow-x: hidden;

        .col_1 {
            margin: 200px 50px;
            .wea{
                position: relative;
                top: -240px;
                font-size: 40px;
            }
            .timesBox{
                font-size: 80px;
                position: relative;
                top: -100px;
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
            margin: 200px 150px;
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
                overflow: hidden; /*自动隐藏文字*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                // white-space: nowrap; /*强制不换行*/
                width: 16em; /*不允许出现半汉字截断*/
            }
            .h3{
                font-size: 72px;
                width: 1314px;
                color: white;
            }
            .h4{
                font-size: 72px;
                width: 1328px;
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
