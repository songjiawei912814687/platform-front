<template>
    <div class="bg_div">
        <div class="bg_title">
            办件情况
        </div>
        <div class="bg_body">
            <div class="divSize">
                <p class="echarts_title">
                    <span style="background:#30ffff;height:auto;font-size: 18px;padding: 2px 10px;border-radius: 3px; margin-left: 30px;color: #0099ff">本月</span>
                    <span style="font-size: 18px;margin: 0 30px 0 10px">{{monthNum}}件</span>
                    <span style="background:#1ab199;height:auto;font-size: 18px;padding: 2px 10px;border-radius: 3px">今日</span>
                    <span style="font-size: 18px;;margin: 0 0 0 10px">{{todayNum}}件</span>
                </p>
                <v-chart :options="barEvent"/>
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
    import {condition} from "@/remote/screen2";

    export default {
        name: "index",
        components: {},
        data() {
            return {
                token: '',
                monthNum: 0,
                todayNum: 0,
                barEvent: {
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
                            interval: 0,
                            rotate: 45,
                            fontSize: 20

                        },
                    },
                    yAxis: {
                        name: '件',
                        nameTextStyle: {
                            fontSize: 26,
                            color: '#fff',
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
                            margin: 1,
                            fontSize: 26,
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
                        type: 'bar',
                        color: ['#30ffff'],
                        data: [],
                    }],
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
                    this.condition(res.data)
                }
            })
        },
        methods: {
            condition(token) {
                autoDoFn(async () => {
                    const res = await condition({token});
                    if (res.success) {
                        res.data.doConditionOutputList.forEach((item, index) => {
                            if (index % 4 === 0 || index === (res.data.length - 1)) {
                                this.barEvent.xAxis.data.push(this.splits(item.data))
                            } else {
                                this.barEvent.xAxis.data.push('')
                            }
                            if (index === res.data.length - 1) {
                                this.barEvent.series[0].data.push(
                                    {
                                        value: item.count,
                                        itemStyle: {
                                            color: '#1ab199'
                                        }
                                    })
                            } else {
                                this.barEvent.series[0].data.push(item.count)
                            }
                        })
                        this.monthNum = res.data.allCount
                        this.todayNum = res.data.todayCount
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

    .echarts {
        width: 100%;
        height: 100%;
    }

    .l-section {
        margin: 30px 0;
    }

    .bg_body {
        > .bg_body {
            width: 100%;
            height: 294px;
            background-color: rgba(1, 21, 24, 0.8);
            color: #fff;
        }
    }
</style>
