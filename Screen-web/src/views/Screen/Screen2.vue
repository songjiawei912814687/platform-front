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
                                                :percent="80"
                                                class="satisfaction"
                                                :strokeWidth="13"
                                                strokeColor="#2df5ff"
                                                strokeLinecap="square">

                                    </a-progress>
                                </div>
                            </a-col>
                            <a-col :span="12">
                                <p>实现率</p>
                                <div class="divSize">
                                    <a-progress type="circle"
                                                :percent="69"
                                                class="realize"
                                                :strokeWidth="13"
                                                strokeColor="#1ab199"
                                                strokeLinecap="square"/>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
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
                <div class="bg_div">
                    <div class="bg_title">
                        满意情况
                    </div>
                    <div class="bg_body">
                        <div class="divSize">
                            <ul>
                                <li v-for="item in evaluation"><p class="text_li">{{item}}</p></li>
                                <!-- <li><p>工号1005被评价满意跑多次</p></li>
                                 <li><p>工号1006被评价不满意</p></li>
                                 <li><p>工号1007被评价满意且跑一次</p></li>
                                 <li><p>工号1004被评价不满意</p></li>
                                 <li><p>工号1003被评价满意且跑一次</p></li>
                                 <li><p>工号1002被评价不满意</p></li>
                                 <li><p>工号1001被评价满意跑多次</p></li>-->
                            </ul>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="12" class="content">
                <div class="bg_div1">
                    <div class="bg_title">
                        {{organizationName}}
                    </div>
                    <div class="bg_body">
                        <a-row>
                            <a-col :span="1">
                                <p style="padding-top: 10px">负责人</p>
                            </a-col>
                            <a-col :span="4">
                                <img style="width: 160px; max-height:160px;height: 160px "
                                     :src="(!principal.icon || principal.icon.length < 10) ? './images/common/defaultAvatar.png' : principal.icon"/>
                            </a-col>
                            <a-col :span="9">
                                <p>姓名：{{principal.name}}</p>
                                <p style="margin: 23px 0">工号：{{principal.employeeId}}</p>
                                <p>电话：{{principal.officePhone}}</p>

                            </a-col>
                            <a-col :span="10">
                                <p>本区域共设服务窗口<span class="number">{{windowCount}}</span>个</p>
                                <p style="margin: 23px 0">当前开放<span class="number">{{openWindowCount}}</span>个</p>
                                <p v-if="openWindow && openWindow.length">可办理窗口<span class="number"
                                                                                     v-for="item in openWindow">{{item.windowNo}}</span>
                                </p>
                                <p v-else>可办理窗口：无</p>
                            </a-col>
                        </a-row>
                        <a-row class="content-two">
                            <a-col :span="6">
                                <p>平均等待时长<span class="number">{{averageaitingime}}</span>分钟</p>
                                <p>当前等待人数<span class="number">{{currentWaitingNumber}}</span>人</p>
                                <p>网上预约<span class="number">{{bookingOnLine}}</span>人</p>
                            </a-col>
                            <a-col :span="6">
                                <span>上岗情况</span>
                                <p style="text-align: center"><span class="number" style="font-size: 28px">{{boardingSituation}}</span>
                                </p>
                                <div class="content-two-d">
                                    <div class="two-title">
                                        <p>未上岗情况</p>
                                    </div>
                                    <div class="two-body">
                                        <ul>
                                            <li v-for="item in absenceOfPosts">窗口{{item.windowNo}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="6">
                                <span>满意度</span>
                                <p style="text-align: center"><span class="number"
                                                                    style="font-size: 28px">{{situation}}</span>
                                </p>
                                <div class="content-two-d">
                                    <div class="two-title">
                                        <p>不满意情况</p>
                                    </div>
                                    <div class="two-body">
                                        <ul>
                                            <li v-for="item in dissatisfaction">
                                                {{item.windowNo}}窗口{{item.dissatisfactionCount}}件
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="6">
                                <span>今日办件量</span>
                                <p style="text-align: center"><span class="number" style="font-size: 28px">{{todayVolume}}件</span>
                                </p>
                                <div class="content-two-d">
                                    <div class="two-title">
                                        <p>各窗口办件</p>
                                    </div>
                                    <div class="two-body">
                                        <ul>
                                            <li v-for="item in windowTodayVolume">{{item.windowNo}}窗口{{item.count}}件
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row class="content-three">
                            <a-col :span="8"
                                   v-for="(item,index) in employeeList.slice(6*employeeIndex, 6*(employeeIndex+1))"
                                   :key="item.id"
                                   :class="{'left':(index+1)%3===1,'center':(index+1)%3===2,'right':(index+1)%3===0}">
                                <div class="photo">
                                    <img class="photo-img"
                                         :src="(!item.icon || item.icon.length < 10) ? './images/common/defaultAvatar.png' : item.icon"/>
                                    <img src="../../assets/screen/photo-border.png" class="photo-border"/>
                                </div>
                                <div class="message">
                                    <p>姓&nbsp;&nbsp;名：{{item.name}}</p>
                                    <p>工&nbsp;&nbsp;号：{{item.employeeId}}</p>
                                    <p>满意度：{{item.satisfaction}}</p>
                                    <p class="evaluate" v-if="item.isStar === 1">
                                        月度示范窗口：
                                        <img src="../../assets/screen/star.png" v-for="o in item.amputated"
                                             style="width: 15px;height:14px;"/>
                                    </p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </a-col>
            <a-col :span="6" class="content">
                <div class="bg_div">
                    <div class="bg_title">
                        办件情况
                    </div>
                    <div class="bg_body">
                        <div class="divSize">
                            <p class="echarts_title">
                                <span style="background:#30ffff;height:auto;font-size: 20px;padding: 2px 10px;border-radius: 3px">本月</span>
                                <span style="font-size: 20px;margin: 0 30px 0 10px">{{monthNum}}件</span>
                                <span style="background:#1ab199;height:auto;font-size: 20px;padding: 2px 10px;border-radius: 3px">今日</span>
                                <span style="font-size: 20px;;margin: 0 0 0 10px">{{todayNum}}件</span>
                            </p>
                            <v-chart :options="barEvent"/>
                        </div>
                    </div>
                </div>
                <div class="l-section bg_div">
                    <div class="bg_title">
                        来访人数
                    </div>
                    <div class="bg_body">
                        <div class="divSize">
                            <p class="echarts_title">
                                <span style="background:#5854b8;height:auto;font-size: 20px;padding: 2px 10px;border-radius: 3px">取号人数</span>
                                <span style="font-size: 20px;margin: 0 30px 0 10px">{{handleNumber}}人</span>
                                <!--<span style="background:rgb(12, 71, 83);height:auto;font-size: 12px;padding: 2px 10px;border-radius: 3px">办理人数</span>-->
                                <!--<span style="font-size: 12px;;margin: 0 0 0 10px">{{fetchNumber}}人</span>-->
                            </p>
                            <v-chart :options="linePolar"/>
                        </div>
                    </div>
                </div>
                <div class="bg_div">
                    <div class="bg_title">
                        热门事项办件量
                    </div>
                    <div class="bg_body">
                        <div class="divSize">
                            <a-row v-for="(item, index) in hotEvent" :key="index"
                                   style="margin-top: 50px; position: relative;padding-left: 120px">
                                <span class="text">{{item.qlNames}}</span>
                                <a-col :span="20">
                                    <div class="tiao">
                                        <img :src="`/images/common/tiao_${index + 1}_0.png`"
                                             :style="{width: '100%',height:'12px',position:'absolute',top:0,left:0}"/>
                                        <img :src="`/images/common/tiao_${index + 1}_1.png`"
                                             :style="{width: parseInt(item.count/allNum*100)+'%',height:'12px',position:'absolute',top:0,left:0}"/>
                                        <!--<img :src="`/images/common/tiao_${index + 1}_2.png`"-->
                                             <!--:style="{position:'absolute',top:'-6px',left:parseInt(item.count/allNum*100)-5+'%'}"/>-->
                                    </div>
                                </a-col>
                                <a-col :span="4" style="padding-left: 10px">
                                    <span class="text_1" style="font-size: 24px">{{item.count}}件</span>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {
        Row,
        Col,
        Input,
        Button,
        Table,
        Form,
        Select,
        DatePicker,
        Upload,
        Icon,
        Divider,
        Popconfirm,
        Progress,
    } from 'ant-design-vue';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/pie';
    import {
        findSatisfaction, getEvaluation, waitingNumber, visitorsNumber, getOrganization, getPerson, condition,
        getHot, getWindowCount, getWindowOpenCount, getOpenWindow, getAverageaitingime, getCurrentWaitingNumber,
        getBookingOnLine, getBoardingSituation, getAbsenceOfPosts, getSituation, getDissatisfaction, getTodayVolume,
        getWindowTodayVolume, getEmployeeList
    } from '@/remote/screen2';
    import {getToken} from '@/remote/screen1';
    import {autoDoFn} from '@/utils/util';

    export default {
        name: 'screen1',
        components: {
            AInput: Input,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATable: Table,
            AForm: Form,
            ASelect: Select,
            ASelectOption: Option,
            ADatePicker: DatePicker,
            AUpload: Upload,
            AIcon: Icon,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            AProgress: Progress,
        },
        data() {
            return {
                satisfaction: {
                    satisfactionRate: 0,
                    implementRate: 0
                },//
                evaluation: [],
                organizationId: '',//组织id
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
                                size: '40px',

                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 45,

                        },
                    },
                    yAxis: {
                        name: '人',
                        nameTextStyle: {
                            color: '#fff',
                          fontSize: 30,
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
                        left: 35,
                        right: 0,
                        bottom: 100
                    },
                    series: [{
                        type: 'bar',
                        color: ['#30ffff'],
                        data: [],
                    }],
                },
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

                        },
                    },
                    yAxis: {
                        name: '件',
                        nameTextStyle: {
                            color: '#fff',
                          fontSize: 20,
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
                        left: 55,
                        right: 0,
                    },
                    series: [{
                        type: 'bar',
                        color: ['#30ffff'],
                        data: [],
                    }],
                },
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
                            interval: 0,
                            rotate: 45,

                        },
                    },
                    yAxis: {
                        name: '件',
                        nameTextStyle: {
                            color: '#fff',
                          fontSize: 20,
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
                        left: 35,
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
                hotEvent: [{qlNames: '', count: 0}],
                allNum: 5000,//热门事件总技术
                principal: '',//负责人
                windowCount: '',//窗口个数
                openWindowCount: '',//开放窗口个数
                openWindow: [],//可办理窗口
                averageaitingime: '',//平均等待时长
                currentWaitingNumber: '',//等待人生
                bookingOnLine: '',//网上预约
                boardingSituation: '',//上岗情况接口
                absenceOfPosts: '',//未上岗情况
                situation: '',//满意度
                dissatisfaction: '',//不满意情况
                todayVolume: '',//今日办件量
                windowTodayVolume: '',//各窗口办件量
                employeeList: [],//窗口人员列表
                organizationName: '',
                handleNumber: 0,
                fetchNumber: 0,
                todayNum: 0,
                monthNum: 0,
                employeeIndex: 0,
                timer: 0,
                timer1: null,
                timer2: null,
                timer3: null,
                timer4: null,
                timer5: null,
                timer6: null,
                timer7: null,
            };
        },
        created() {
            // this.jump()
            autoDoFn(async () => {
                const res = await getToken();
                if (res) {
                    localStorage.screenToken = res.data;
                    this.token = res.data;
                    //获取组织
                    this.getOrganization(res.data)
                    this.findSatisfaction(res.data)
                    this.getEvaluation(res.data)
                    this.waitingNumber(res.data)
                    this.visitorsNumber(res.data)
                    this.condition(res.data)
                    this.getHot(res.data)
                }
            });
        },
        methods: {
            jump() {
                this.$router.push({
                    path: 'screen1',
                    name: 'screen1',
                });
            },
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
            getEvaluation(token) {
                autoDoFn(async () => {
                    const res = await getEvaluation({token});

                    if (res.success) {
                        console.log(res.data)
                        var num = 10
                        if (res.data.length > num) {
                            this.evaluation = res.data.slice(0, num)
                            console.log("wo kankan" + this.evaluation)
                            this.timer2 = setInterval(() => {
                                this.evaluation.shift()
                                this.evaluation.push(res.data[num])
                                console.log("num" + num)
                                console.log("len" + res.data.length)
                                if (res.data.length >= num) {
                                    num++
                                } else {
                                    num = 0
                                }
                            }, 2000)
                        } else {
                            this.evaluation = res.data
                        }
                    }
                });
            },
            waitingNumber(token) {
                autoDoFn(async () => {
                    const res = await waitingNumber({token});
                    if (res.success) {
                        var num = 8;
                        for (var i = 0; i < num; i++) {
                            this.barPeople.xAxis.data.push(res.data[i].organizationName)
                            this.barPeople.series[0].data.push(res.data[i].organizationFetchNumber)
                        }
                        this.timer3 = setInterval(() => {
                            this.barPeople.xAxis.data.shift()
                            this.barPeople.xAxis.data.push(res.data[num].organizationName)
                            this.barPeople.series[0].data.shift()
                            this.barPeople.series[0].data.push(res.data[num].organizationFetchNumber)
                            if (num >= res.data.length - 1) {
                                num = 0
                            } else {
                                num++
                            }
                        }, 3000)
                    }
                });
            },
            visitorsNumber(token) {
                autoDoFn(async () => {
                    const res = await visitorsNumber({token});
                    if (res.success) {
                        res.data.forEach((item, index) => {
                            if (index % 6 === 0 || index === (res.data.length - 1)) {
                                this.linePolar.xAxis.data.push(item.date)
                            } else {
                                this.linePolar.xAxis.data.push('')
                            }
                            this.linePolar.series[0].data.push(item.handleNumber)
                            this.linePolar.series[1].data.push(item.fetchNumber)
                        })
                    }
                });
            },
            condition(token) {
                autoDoFn(async () => {
                    const res = await condition({token});
                    if (res.success) {
                        res.data.forEach((item, index) => {
                            if (index % 4 === 0 || index === (res.data.length - 1)) {
                                this.barEvent.xAxis.data.push(item.data)
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
                    }
                });
            },
            getHot(token) {
                autoDoFn(async () => {
                    const res = await getHot({token});
                    if (res.success) {
                        this.hotEvent = res.data
                    }
                });
            },
            getOrganization(token) {
                var _this = this;
                autoDoFn(async () => {
                    const res = await getOrganization({token});
                    if (res.success) {
                        var index = 0;
                        this.timer1 = setInterval(() => {
                            if (index >= res.data.length - 1) {
                                // this.jump();
                            } else {
                                index++
                            }
                            let id = res.data[index].id
                            this.organizationName = res.data[index].name;
                            this.getMiddleData(id, token);
                        }, 30 * 1000);
                        let id = res.data[index].id
                        this.organizationName = res.data[index].name;
                        this.getMiddleData(id, token);
                    }
                });
            },
            getPersons(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getPerson({organizationId, token})
                    if (res.success) {
                        this.principal = res.data
                    }
                });
            },
            getWindowCount(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getWindowCount({organizationId, token})
                    if (res.success) {
                        this.windowCount = res.data
                    }
                });
            },
            getWindowOpenCount(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getWindowOpenCount({organizationId, token})
                    if (res.success) {
                        this.openWindowCount = res.data
                    }
                });
            },
            getOpenWindow(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getOpenWindow({organizationId, token})
                    if (res.success) {
                        this.openWindow = res.data
                    }
                });
            },
            getAverageaitingime(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getAverageaitingime({organizationId, token})
                    if (res.success) {
                        this.averageaitingime = res.data
                    }
                });
            },
            getCurrentWaitingNumber(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getCurrentWaitingNumber({organizationId, token})
                    if (res.success) {
                        this.currentWaitingNumber = res.data
                    }
                });
            },
            getBookingOnLine(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getBookingOnLine({organizationId, token})
                    if (res.success) {
                        this.bookingOnLine = res.data
                    }
                });
            },
            getBoardingSituation(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getBoardingSituation({organizationId, token})
                    if (res.success) {
                        this.boardingSituation = res.data
                    }
                });
            },
            getAbsenceOfPosts(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getAbsenceOfPosts({organizationId, token})
                    if (res.success) {
                        if (res.data.length >= 3) {
                            var num = 3;
                            console.log(res.data)
                            this.absenceOfPosts = res.data.slice(0, 2)
                            this.timer4 = setInterval(() => {
                                this.absenceOfPosts.shift()
                                this.absenceOfPosts.push(res.data[num])
                                if (num >= res.data.length - 1) {
                                    num = 0
                                } else {
                                    num++
                                }
                            }, 3000)
                        } else {
                            this.absenceOfPosts = res.data
                        }
                    }
                });
            },
            getSituation(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getSituation({organizationId, token})
                    if (res.success) {
                        this.situation = res.data
                    }
                });
            },
            getDissatisfaction(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getDissatisfaction({organizationId, token})
                    if (res.success) {
                        if (res.data.length >= 3) {
                            var num = 3;
                            this.dissatisfaction = res.data.slice(0, 2)
                            this.timer5 = setInterval(() => {
                                this.dissatisfaction.shift()
                                this.dissatisfaction.push(res.data[num])
                                if (num >= res.data.length - 1) {
                                    num = 0
                                } else {
                                    num++
                                }
                            }, 3000)
                        } else {
                            this.dissatisfaction = res.data
                        }
                    }
                });
            },
            getTodayVolume(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getTodayVolume({organizationId, token})
                    if (res.success) {
                        this.todayVolume = res.data
                    }
                });
            },
            getWindowTodayVolume(organizationId, token) {
                autoDoFn(async () => {
                    const res = await getWindowTodayVolume({organizationId, token})
                    if (res.success) {
                        if (res.data.length >= 3) {
                            var num = 3;
                            this.windowTodayVolume = res.data.slice(0, 2)
                            this.timer6 = setInterval(() => {
                                this.windowTodayVolume.shift()
                                this.windowTodayVolume.push(res.data[num])
                                if (num >= res.data.length - 1) {
                                    num = 0
                                } else {
                                    num++
                                }
                            }, 3000)
                        } else {
                            this.windowTodayVolume = res.data
                        }
                    }
                });
            },
            getEmployeeList(organizationId, token) {
                clearInterval(this.timer7);
                autoDoFn(async () => {
                    const res = await getEmployeeList({organizationId, token})
                    if (res.success) {
                        this.employeeList = res.data;
                        this.employeeIndex = 0;
                        if (res.data.length > 6) {
                            this.timer7 = setInterval(() => {
                                this.employeeIndex++;
                            }, 5000);
                        }
                    }
                });
            },

            getMiddleData(id, token) {
                this.getPersons(id, token)
                this.getWindowCount(id, token)
                this.getWindowOpenCount(id, token)
                this.getOpenWindow(id, token)
                this.getAverageaitingime(id, token)
                this.getCurrentWaitingNumber(id, token)
                this.getBookingOnLine(id, token)
                this.getBoardingSituation(id, token)
                this.getAbsenceOfPosts(id, token)
                this.getSituation(id, token)
                this.getDissatisfaction(id, token)
                this.getTodayVolume(id, token)
                this.getWindowTodayVolume(id, token)
                this.getEmployeeList(id, token)
            },
        },
        destroyed() {
            clearInterval(this.timer1);
            clearInterval(this.timer2);
            clearInterval(this.timer3);
            clearInterval(this.timer4);
            clearInterval(this.timer5);
            clearInterval(this.timer6);
        }
    };
</script>

<style lang="less" scoped>
    .screen-wrap2 {
        background-color: #0e1026;
        height: 1200px;
        padding: 0 20px 20px 20px;

        .title {
            text-align: center;
            background-size: cover;
            background-image: url(../../assets/screen/title.png);
            background-position: center;

            .title_img {
                font-size: 100px;
                color: rgb(41 227 255);
                font-family: "Arial", "Microsoft YaHei";
                font-weight: 500;

                span {
                    margin: 10px;
                }
            }
        }

        .sub-title {
            color: #fff;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 24px;
        }

        .content {
            height: 1032px;
        }

        .bg_div1 {
            height: 1032px;
            margin: 0;

            > .bg_title {
                width: 100%;
                height: 60px;
                background-color: rgb(2, 55, 68);
                font-size: 40px;
                font-family: "SimHei";
                color: rgb(253, 249, 249);
                border-radius: 4px;
                padding-top: 4px;
                padding-left: 25px;
            }

            > .bg_body {
                width: 100%;
                height: 1002px;
                background-color: rgba(1, 21, 24, 0.8);
                padding: 10px 30px;
                text-align: center;
                font-size: 28px;
                font-family: "SimHei";
                color: rgb(249, 253, 252);

                .ant-row {
                    padding-top: 20px;
                }

                p {
                    text-align: left;
                    font-size: 28px;
                    font-family: "SimHei";

                    .number {
                        color: #30ffff;
                        padding: 0 10px;
                    }
                }

                .content-two {
                    p {
                        margin: 10px 0;

                        .number {
                            font-size: 32px;
                        }
                    }

                    .content-two-d {
                        width: 112px;
                        height: auto;
                        margin: 0 auto;

                        .two-title {
                            width: 140px;
                            height: 35px;
                            background-color: #023744;

                            p {
                                font-size: 26px;
                                font-family: "Microsoft YaHei";
                                color: rgb(252, 254, 255);
                                text-align: center;
                            }

                        }

                        .two-body {
                            background-color: rgba(21, 44, 75, 0.38);
                            width: 140px;
                            height: 80px;
                            overflow: hidden;

                            ul {
                                li {
                                    list-style: none;
                                    font-size: 24px;
                                    font-family: "Microsoft YaHei";
                                    color: rgba(252, 254, 255, 0.6);
                                }
                            }
                        }

                    }
                }

                .content-three {
                    .center {
                        padding-left: 30px;
                    }

                    .right {
                        padding-left: 60px;
                    }

                    .photo {
                        width: 151px;
                        height: 151px;
                        overflow: hidden;
                        border-radius: 50%;
                        margin: 10px 0;
                        position: relative;

                        .photo-border {
                            z-index: 100;
                            position: absolute;
                            top: 0px;
                            left: 0px;
                        }

                        .photo-img {
                            width: 151px;
                            height: 151px;
                            z-index: 10;
                            position: absolute;
                            top: 0px;
                            left: 0px;
                        }
                    }

                    .message {
                        height: 123px;

                        p {
                            font-size: 22px;
                            font-family: "Microsoft YaHei";
                            color: rgb(252, 254, 255);
                        }

                        .evaluate {
                            font-size: 16px;
                            font-family: "Microsoft YaHei";
                            color: rgb(252, 254, 255);
                            margin-left: -20px;
                        }

                    }
                }
            }
        }

        .bg_div {
            height: 324px;
            margin: 0;

            > .bg_title {
                width: 100%;
                height: 60px;
                line-height: 45px;
                background-color: rgb(2, 55, 68);
                font-size: 40px;
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
                    font-size: 30px;
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
                            color: rgb(253, 251, 251);
                        }
                    }
                }
            }
        }

        .l-section {
            margin: 30px 0;
        }

        .echarts {
            width: 100%;
            height: 100%;
        }

        .ant-progress-circle .ant-progress-text {
            color: #fff;
        }

        .ant-progress-circle-trail {
            stroke: #ffff00;
        }

        .satisfaction {
            .ant-progress-circle-path {
                stroke: #2df5ff;
            }
        }

        .realize {
            .ant-progress-circle-path {
                stroke: #1ab199;
            }
        }

    }
</style>
