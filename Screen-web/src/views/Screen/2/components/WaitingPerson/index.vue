<template>
    <div class="l-section bg_div">
        <div class="bg_title">
            当前大厅等待人数
        </div>
        <div class="bg_body">
            <div class="divSize">
                <v-chart :options="barPeople"/>
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
    import {waitingNumber} from "@/remote/screen2";

    export default {
        name: "index",
        data() {
            return{
                token:'',
                timer3: null,
                barPeople: {

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
                            show: true,
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            fontSize: 20,
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
                            margin: 1,
                            fontSize: 26,
                            formatter(value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = `${value / 10000}万`;
                                } else if (value >= 10000000) {
                                    value = `${value / 10000000}千万`;
                                }
                                return value.toFixed(0);
                            },
                        },
                    },
                    grid: {
                        left: 65,
                        right: 0,
                        bottom: 110
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
                if(res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    //获取组织
                    this.waitingNumber(res.data)
                }
            })
        },
        methods: {
            waitingNumber(token) {
                autoDoFn(async () => {
                    const res = await waitingNumber({token});
                    if (res.success) {
                        var num = 8;
                        for (var i = 0; i < num; i++) {
                            this.barPeople.xAxis.data.push(this.splits(res.data[i].organizationName))
                            this.barPeople.series[0].data.push(res.data[i].number)
                        }
                        this.timer3 = setInterval(() => {
                            this.barPeople.xAxis.data.shift()
                            this.barPeople.xAxis.data.push(this.splits(res.data[num].organizationName))
                            this.barPeople.series[0].data.shift()
                            this.barPeople.series[0].data.push(res.data[num].number)
                            if (num >= res.data.length - 1) {
                                num = 0
                            } else {
                                num++
                            }
                        }, 3000)
                    }
                });
            },
            splits(value){
                if(value){
                    if (value.length > 5){
                        let value1 = value.slice(0,5);
                        console.log(value1)
                        return value1;
                    }
                    return value
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
