<template>
    <div class="bg_div">
        <div class="bg_title">
            “最多跑一次”满意率和实现率
        </div>
        <div class="bg_body" style="padding-top:30px">
            <a-row>
                <a-col :span="12">
                    <p>满意率</p>
                    <div class="divSize">
                        <a-progress type='circle'
                                    :percent="satisfaction.satisfactionRate"
                                    class="satisfaction"
                                    :format="() => satisfaction.satisfactionRate+ '%' "
                                    :strokeWidth="13"
                                    strokeColor="#56b187"
                                    strokeLinecap="square">

                        </a-progress>
                    </div>
                </a-col>
                <a-col :span="12">
                    <p>实现率</p>
                    <div class="divSize">
                        <a-progress type="circle"
                                    :percent="satisfaction.implementRate"
                                    :format="() => satisfaction.implementRate+ '%' "
                                    class="realize"
                                    :strokeWidth="13"
                                    strokeColor="#1ab199"
                                    strokeLinecap="square"/>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    import {Col, Row, Progress} from 'ant-design-vue'
    import {autoDoFn} from "@/utils/util";
    import {findSatisfaction} from "@/remote/screen2";
    import {getToken} from "@/remote/screen2";

    export default {
        name: "index",
        components: {
            ACol: Col,
            ARow: Row,
            AProgress: Progress
        },
        data() {
            return {
                token: '',
                satisfaction: {
                    satisfactionRate: 0,
                    implementRate: 0
                },
            }
        },
        created() {
            autoDoFn(async () => {
                const res = await getToken();
                if (res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    this.findSatisfaction(res.data)
                }
            })
        },
        methods: {
            findSatisfaction(token) {
                autoDoFn(async () => {
                    const res = await findSatisfaction({token});
                    if (res.success) {
                        this.satisfaction = {
                            satisfactionRate: parseInt(res.data.satisfactionRate),
                            implementRate: parseInt(res.data.implementRate)
                        }
                    }
                });
            },
        }
    }
</script>

<style lang="less" >
    .bg_div {
        height: 324px;
        margin: 0;

        > .bg_title {
            width: 100%;
            height: 50px;
            background-color: rgb(2, 55, 68);
            font-size: 30px;
            font-family: "SimHei";
            color: rgb(253, 249, 249);
            border-radius: 4px;
            padding-top: 4px;
            padding-left: 25px;
        }

        > .bg_body {
            width: 100%;
            height: 294px;
            background-color: rgba(1, 21, 24, 0.8);
            color: #fff;

            p {
                text-align: center;
                font-size: 40px;
                font-family: "SimHei";
                color: rgb(249, 253, 252);
            }

            .ant-row {
                height: 100%;

                .ant-col-12 {
                    height: 100%;
                }
            }

            .divSize {
                height: 100%;
                padding: 0 20px;
                overflow: hidden;
                position: relative;

                .echarts_title {
                    position: absolute;
                    top: 20px;
                    left: 80px;
                }

                .button {
                    border-radius: 4px;
                    width: 32px;
                    height: 16px;
                    display: inline-block;
                }

                .text {
                    font-size: 24px;
                    font-family: "SimHei";
                    color: rgb(251, 254, 254);
                    position: absolute;
                    left: 0;
                    top: 2px;
                    overflow: hidden; /*自动隐藏文字*/
                    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                    white-space: nowrap; /*强制不换行*/
                    width: 5em; /*不允许出现半汉字截断*/
                }

                .tiao {
                    width: 100%;
                    height: 6px;
                    margin: 9px 0px;
                    position: relative;
                }

                .ant-row {
                    height: 1px;
                    margin: 10px 0;
                }

                ul {
                    padding-top: 20px;

                    li {
                        list-style: none;

                        .text_li {
                            float: left;
                            font-size: 26px;
                            padding-left: 30px;
                        }
                    }
                }

                .ant-progress {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    -moz-transform: translate(-50%, -50%);
                    -webkit-transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);

                    .ant-progress-text {
                        font-size: 26px;
                        font-family: "SimHei";
                        color: rgb(253, 251, 251); ;
                    }

                }

            }
        }
    }



    .satisfaction {
        .ant-progress-circle-path {
            stroke: #56b187;


        }
    }
    .realize {
        .ant-progress-circle-path {
            stroke: #1ab199;
        }
    }

</style>
