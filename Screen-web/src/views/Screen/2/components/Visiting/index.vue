<template>
    <div class="l-section bg_div">
        <div class="bg_title">
            来访人数
        </div>
        <div class="bg_body">
            <div class="divSize">
                <p class="echarts_title">
                    <span style="background:#5854b8;height:auto;font-size: 18px;padding: 2px 10px;border-radius: 3px;margin-left: 70px">取号人数</span>
                    <span style="font-size: 18px;margin: 0 30px 0 10px">{{takeNumber}}人</span>
                    <span style="background:rgb(12, 71, 83);height:auto;font-size: 18px;padding: 2px 10px;border-radius: 3px">办理人数</span>
                    <span style="font-size: 18px;;margin: 0 0 0 10px">{{completeNumber}}人</span>
                </p>
                <v-chart :options="linePolar"/>
            </div>
        </div>
    </div>
</template>

<script>

    import 'echarts/lib/chart/line';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/pie';
    import {autoDoFn} from "@/utils/util";
    import {getToken} from "@/remote/screen2";
    import {visitorsNumber} from "@/remote/screen2";

    export default {
        name: "index",
        components:{

        },
        data() {
            return{
                token: '',
                completeNumber: 0,
                takeNumber: 0,
                linePolar: {
                    legend: {},
                    tooltip: {},
                    xAxis: {
                        type: 'category',
                        data: [],
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#fff',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            fontSize: 20,
                            interval: 0,
                            rotate: 45,

                        },
                    },
                    yAxis: {
                        name: '人',
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 26,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#fff',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        min: 0,
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#0b4051',
                            },
                        },
                        scale: true,
                        axisLabel: {
                            fontSize: 26,
                            margin: 1,
                            formatter(value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = `${value / 10000}万`;
                                } else if (value >= 10000000) {
                                    value = `${value / 10000000}千万`;
                                }
                                return value;
                            },
                        },
                    },
                    grid: {
                        left: 65,
                        right: 0,
                    },
                    series: [{
                        //办理人数
                        type: 'line',
                        symbol: 'none',
                        smoothMonotone: 'x',
                        color: '',
                        smooth: true,
                        lineStyle: {
                            opacity: 0,
                        },
                        areaStyle: {
                            color: {
                                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#193051' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#0c4754' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        data: [],
                    }, {
                        //取号人数
                        type: 'line',
                        symbol: 'none',
                        smoothMonotone: 'x',
                        smooth: true,
                        lineStyle: {
                            opacity: 0,
                        },
                        areaStyle: {
                            color: {
                                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgb(45,244,255)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgb(117,110,239)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        data: [],
                    }

                    ],
                },
            }
        },
        created() {
            autoDoFn(async () => {
                const res = await getToken();
                if (res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    //获取组织
                    this.visitorsNumber(res.data)
                }
            });
        },
        methods: {
            visitorsNumber(token) {
                autoDoFn(async () => {
                    const res = await visitorsNumber({token});
                    if (res.success) {
                        res.data.visitorsNumberOutputList.forEach((item, index) => {
                            if (index % 4 === 0 || index === (res.data.length - 1)) {
                                this.linePolar.xAxis.data.push(this.splits(item.date))
                            } else {
                                this.linePolar.xAxis.data.push('')
                            }
                            this.linePolar.series[0].data.push(item.handleNumber)
                            this.linePolar.series[1].data.push(item.fetchNumber)
                        })
                        this.completeNumber = res.data.completeNumber
                        this.takeNumber = res.data.takeNumber
                    }
                });
            },
            splits(value) {
                if (value) {
                    let value1 = value.slice(5);
                    console.log(value1)
                    return value1;
                }
                return ''
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/less/bg_div.less";
    .l-section {
        margin: 30px 0;
    }
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
