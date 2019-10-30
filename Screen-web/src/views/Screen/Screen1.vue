<template>
  <div class="screen-wrap">
    <div class="title">
      <span class="title_img">
        <span>富</span>
        <span>阳</span>
        <span>区</span>
        <span>政</span>
        <span>务</span>
        <span>服</span>
        <span>务</span>
        <span>大</span>
        <span>数</span>
        <span>据</span>
        <span>平</span>
        <span>台</span>
      </span>
    </div>
    <a-row :gutter="20">
      <a-col :span="7">
        <!--<div class="l-section2">-->
        <!--<h2 class="sub-title">办事楼层导引</h2>-->
        <!--<div class="border">-->
        <!--<p v-if="roomIndex === 2">-->
        <!--<img src="../../assets/screen/room1.png"/>-->
        <!--</p>-->
        <!--<p v-if="roomIndex === 2" class="text">三楼：公共资源 社保 出入境 窗口数25</p>-->
        <!--<p v-if="roomIndex === 1">-->
        <!--<img src="../../assets/screen/room2.png"/>-->
        <!--</p>-->
        <!--<p v-if="roomIndex === 1" class="text">二楼：公共资源 社保 出入境 窗口数25</p>-->
        <!--<p v-if="roomIndex === 0">-->
        <!--<img src="../../assets/screen/room3.png"/>-->
        <!--</p>-->
        <!--<p v-if="roomIndex === 0" class="text">一楼：公共资源 社保 出入境 窗口数25</p>-->
        <!--</div>-->
        <!--</div>-->
        <div class="y-section1">
          <h2 class="sub-title">“最多跑一次”行政审批服务效能指数</h2>
          <ul class="border">
            <li v-for="item in performance.list">
              <div class="name">第{{item.index}}名：{{item.departmentName}}</div>
              <a-progress
                :strokeWidth="20"
                :percent="item.score"
                :showInfo="false"
                status="active"
              />
              <span class="score">{{item.score.toFixed(2)}}分</span>
            </li>
          </ul>
        </div>
      </a-col>
      <a-col :span="11">
        <!--<div class="l-section1">
                    <h2 class="sub-title">服务承诺</h2>
                    <div class="border" style="height: 218px">
                        <p v-for="item in pledgeData"><span>{{item.name}}</span></p>
                    </div>
        </div>-->
        <div class="m-section1" style="margin-top: 0; padding-top: 40px">
          <h2 class="sub-title">"就近办"办事分布图</h2>
          <div class="border">
            <a-row class="num-title">
              <a-col :span="12">
                <h2>总办件数</h2>
                <p>{{totalData.allCount}}</p>
              </a-col>
              <a-col :span="12">
                <h2>总窗口数</h2>
                <p>{{totalData.windowCount}}</p>
              </a-col>
            </a-row>
            <div class="img">
              <div class="img-position">
                <img src="../../assets/screen/map.png">
                <div
                  :class=" ('point' + (index + 1)) + ' point-body'"
                  v-for="(item,index) in countList"
                >
                  <h2>{{item.centerName}}</h2>
                  <p>窗口数量{{item.windowCount}}个</p>
                  <p>办件事项{{item.thingCount}}个</p>
                  <p>接通专线{{item.lineCount}}条</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="r-section1" style="margin-top: 10px; ">
          <h2 class="sub-title">移动办事之城</h2>
          <div class="border" style="padding-top: 70px;padding-right: 50px">
            <a-progress
              v-for="item in mobileData "
              type="circle"
              :format="() => ''"
              :percent="item.configValue"
              :width="item.width"
              :class="item.class"
              strokeLinecap="square"
              :strokeColor="item.color"
              gapPosition="right"
              :strokeWidth="10"
            ></a-progress>

            <!--<v-chart :options="piePolar"/>-->
            <div class="legend">
              <p>一窗受理接入</p>
              <p>网上办</p>
              <p>简化办</p>
              <p>就近办</p>
              <p>移动办</p>
            </div>
          </div>
        </div>

        <div class="r-section1">
          <h2 class="sub-title">大数据调用量</h2>
          <div class="border">
            <v-chart :options="barPolar"/>
          </div>
        </div>
        <div class="r-section1">
          <h2 class="sub-title">办件趋势</h2>
          <div class="border">
            <v-chart :options="linePolar"/>
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
  Progress
} from "ant-design-vue";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/component/legend";
import {
  getToken,
  getCount,
  getTotal,
  getMobileService,
  getPledgeData,
  getBigDataInvoke,
  getTrend,
  getPerformance
} from "@/remote/screen1";
import { autoDoFn } from "@/utils/util";

const monthName = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月"
];
let timer = null;
export default {
  name: "screen1",
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
    AProgress: Progress
  },
  data() {
    return {
      token: "",
      roomIndex: 0,
      piePolar: {
        center: ["40%", "60%"],
        angleAxis: {
          startAngle: 0,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          type: "category",
          data: ["就近办理率", "简化办理率", "一窗受理办理率", "移动办事率"],
          z: 10,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: "#fff"
          }
        },
        polar: {},
        series: [
          {
            type: "bar",
            data: [0, 0, 0, 0],
            coordinateSystem: "polar",
            color(params) {
              const colorList = [
                "#e9d22c",
                "#f9a110",
                "#fcb476",
                "#fd400c",
                "#00ffff"
              ].reverse();
              return colorList[params.dataIndex];
            }
          }
        ],
        legend: {
          show: false
        },
        grid: {
          left: 35,
          right: 90
        }
      },
      barPolar: {
        legend: {},
        tooltip: {},
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 26
          }
        },
        yAxis: {
          name: "件",
          nameTextStyle: {
            fontSize: 24,
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },

          min: 0,
          splitLine: {
            lineStyle: {
              color: "#0b4051"
            }
          },
          scale: true,
          axisLabel: {
            fontSize: 24,
            margin: 0,
            formatter(value, index) {
              if (value >= 10000 && value < 10000000) {
                value = `${value / 10000}万`;
              } else if (value >= 10000000) {
                value = `${value / 10000000}千万`;
              }
              return value;
            }
          }
        },
        grid: {
          left: 65,
          right: 40
        },
        series: [
          {
            type: "bar",
            color: ["#2ff9ff"],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      linePolar: {
        legend: {
          data: ["富阳行政中心", "场口分中心窗口", "新登分中心窗口"],
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize: 20
          }
        },
        tooltip: {},
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 24
          }
        },
        yAxis: {
          name: "件",
          nameTextStyle: {
            color: "#fff",
            fontSize: 20
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#0b4051"
            }
          },
          scale: true,
          min: 0,
          axisLabel: {
            margin: 2,
            fontSize: 24,
            formatter(value, index) {
              if (value >= 10000 && value < 10000000) {
                value = `${value / 10000}万`;
              } else if (value >= 10000000) {
                value = `${value / 10000000}千万`;
              }
              return value;
            }
          }
        },
        grid: {
          left: 55,
          right: 0,
          bottom: 30
        },
        series: [
          {
            name: "富阳行政中心",
            type: "line",
            color: ["#d4d12a"],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "场口分中心窗口",
            type: "line",
            color: ["#fd5502"],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "新登分中心窗口",
            type: "line",
            color: ["#fda803"],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      countList: [],
      totalData: {
        allCount: 0,
        windowCount: 0
      },
      mobileServiceData: [],
      mobileData: [],
      pledgeData: [],
      bigDataInvoke: [],
      trendList: [],
      performance: {
        list: [],
        page: 1,
        rows: 10,
        lastPage: 0
      },
      timer: null,
      roomTimer: null,
      jumpTimer: null,
      isFullScreen: false,
      ApplicationForm: "", //网上申报率
      NearbyHandlingRate: "", //就近办理率
      SimplifyHandlingRate: "", //简化办理率
      OneWindowAcceptanceRate: "", //一窗受理率
      MobileServiceRate: "" //移动办事率
    };
  },
  created() {
    this.jumpTimer = setTimeout(() => {
      this.jump();
    }, 30 * 1000);
    autoDoFn(async () => {
      const res = await getToken();
      if (res) {
        localStorage.screenToken = res.data;
        this.token = res.data;
        this.getCount(res.data);
        this.getTotal(res.data);
        this.getMobileService(res.data);
        this.getPledgeData(res.data);
        this.getBigDataInvoke(res.data);
        this.getTrend(res.data);
        this.getPerformance(res.data);
        clearInterval(timer);
        timer = setInterval(() => {
          this.performance.page++;
          this.$nextTick(async () => {
            if (res) {
              this.getPerformance(res.data);
            }
          });
        }, 10 * 1000);
      }
    });
  },
  computed: {},
  watch: {
    mobileServiceData() {
      this.piePolar.series[0].data = this.mobileServiceData.map(item =>
        parseInt(item.configValue)
      );
    },
    bigDataInvoke() {
      this.barPolar.series[0].data = this.bigDataInvoke.map(item =>
        parseInt(item.count)
      );
      this.barPolar.xAxis.data = this.bigDataInvoke.map(
        item => monthName[item.date.split("-")[1] - 1]
      );
    },
    trendList() {
      const data = _.groupBy(this.trendList, "organizationName");

      let series = [];
      for (let key in data) {
        series.push({
          name: key,
          type: "line",
          color: ["#d4d12a", "#fd5502", "#fda803"][
            Object.keys(data).findIndex(item => item === key)
          ],
          data: data[key].map(item => item.totalAmount)
        });
      }
      this.linePolar.series = series;
      this.linePolar.xAxis.data = data[Object.keys(data)[0]].map(
        item => monthName[item.yearAndMonth.split("-")[1] - 1]
      );
    }
  },
  methods: {
    jump() {
      this.$router.push({
        path: "screen5",
        name: "screen5"
      });
    },
    getCount(token) {
      autoDoFn(async () => {
        const res = await getCount({ token });
        if (res) {
          this.countList = res.data;
        }
      });
    },
    getTotal(token) {
      autoDoFn(async () => {
        const res = await getTotal({ token });
        if (res) {
          this.totalData = res.data;
        }
      });
    },
    getMobileService(token) {
      autoDoFn(async () => {
        const res = await getMobileService({ token });
        if (res) {
          this.mobileServiceData = res.data;
          res.data.sort(function(a, b) {
            return (
              Number(b.configValue.substring(0, b.configValue.length - 1)) -
              Number(a.configValue.substring(0, a.configValue.length - 1))
            );
          });
          this.mobileData = res.data.map((item, index) => {
            item.configValue = parseInt(
              item.configValue.substring(0, item.configValue.length - 1)
            );
            if (index === 0) {
              item.width = 80;
              item.class = "realize3";
            } else if (index === 1) {
              item.width = 110;
              item.class = "realize2";
            } else if (index === 2) {
              item.width = 150;
              item.class = "realize1";
            } else if (index === 3) {
              item.width = 200;
              item.class = "realize";
            } else if (index === 4) {
              item.width = 260;
              item.class = "satisfaction";
            }
            if (item.configKey === "一窗受理接入率") {
              item.color = "rgb(254 64 14)";
            } else if (item.configKey === "网上申报率") {
              item.color = "rgb(252 181 119)";
            } else if (item.configKey === "简化办理率") {
              item.color = "rgb(250 161 17)";
            } else if (item.configKey === "就近办理率") {
              item.color = "rgb(234 211 45)";
            } else {
              item.color = "rgb(1 255 255)";
            }
            return item;
          });
          console.log(this.mobileData);
        }
      });
    },
    getPledgeData(token) {
      autoDoFn(async () => {
        const res = await getPledgeData({ token });
        if (res) {
          this.pledgeData = res.data;
        }
      });
    },
    getBigDataInvoke(token) {
      autoDoFn(async () => {
        const res = await getBigDataInvoke({ token });
        if (res) {
          this.bigDataInvoke = res.data;
        }
      });
    },
    getTrend(token) {
      autoDoFn(async () => {
        const res = await getTrend({ token });
        if (res) {
          this.trendList = res.data;
        }
      });
    },
    getPerformance(token) {
      autoDoFn(async () => {
        const res = await getPerformance({
          token,
          page: this.performance.page,
          rows: 9
        });
        if (res) {
          const list = res.data.list.map((item, index) => ({
            index: (res.data.pageNum - 1) * 9 + index + 1,
            score: item.score || 0,
            departmentName: item.departmentName
          }));
          this.performance = {
            list: list,
            page: res.data.pageNum,
            rows: 9,
            lastPage: res.data.lastPage
          };
        }
      });
    },
    fullScreen() {
      let el = document.documentElement;
      let isFullscreen =
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
      if (!isFullscreen) {
        //进入全屏,多重短路表达式
        (el.requestFullscreen && el.requestFullscreen()) ||
          (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
          (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
          (el.msRequestFullscreen && el.msRequestFullscreen());
      } else {
        //退出全屏,三目运算符
        document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : "";
      }
    }
  },
  mounted() {
    this.roomTimer = setInterval(() => {
      this.roomIndex = this.roomIndex + 1;
      if (this.roomIndex > 2) {
        this.roomIndex = 0;
      }
    }, 5 * 1000);
  },
  beforeDestroy() {
    clearInterval(timer);
    clearInterval(this.roomTimer);
  }
};
</script>

<style lang="less">
html {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

html::-webkit-scrollbar {
  width: 0px;
}

.screen-wrap {
  background-color: #0e1026;
  height: 100vh;
  padding: 0 20px 20px 20px;
  overflow-y: hidden;

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
    font-size: 40px;
    position: relative;
    top: -10px;
  }

  .border {
    border: 1px solid #0b4051;
  }

  .l-section1 {
    margin-top: 0px;
    margin-bottom: 30px;

    > div {
      padding: 15px 75px 0;
    }

    p {
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #ddda2a;
      border-bottom: 1px solid #0b4051;
      font-size: 24px;
      margin-bottom: 15px;

      &:nth-child(4) {
        border-bottom: none;
      }

      span {
        color: #ddda2a;
      }
    }
  }

  .l-section2 {
    > div {
      padding: 110px 0;
    }

    p {
      text-align: center;
      margin-bottom: 20px;
      color: #fff;
      font-size: 16px;

      &.text {
        padding-top: 70px;
      }

      img {
        height: 400px;
        width: auto;
      }
    }
  }

  .m-section1 {
    position: relative;
    padding-bottom: 33px;
    margin-bottom: 20px;

    .num-title {
      font-weight: bold;
      padding: 15px 0 15px 50px;

      h2 {
        color: #30ffff;
        font-size: 24px;
        line-height: 30px;
      }

      p {
        color: #fff;
        font-size: 24px;
        line-height: 30px;
      }
    }

    .img {
      text-align: center;
      margin: 55px;

      .img-position {
        display: inline-block;
        width: 687px;
        height: 832px;
        top: 45px;
        position: relative;

        img {
          height: 830px;
          margin-left: -190px;
        }

        .point-body {
          background-color: rgba(10, 78, 94, 0.8);
          min-width: 120px;
          padding: 10px;
          line-height: 50px;
          font-size: 28px;
          color: #fff;
          position: absolute;

          h2 {
            font-size: 28px;
            color: #fff;
            text-align: center;
          }

          &.point1 {
            width: 250px;
            height: 230px;
            top: -120px;
            left: 610px;
          }

          &.point2 {
            width: 250px;
            height: 230px;
            right: 520px;
            top: 583px;
          }

          &.point3 {
            width: 250px;
            height: 230px;
            top: -80px;
            left: 110px;
          }
        }
      }
    }
  }

  .m-section2 {
    > ul {
      padding: 30px 20px 0 20px;
      list-style: none;
      height: 330px;
      text-align: center;
      overflow: hidden;

      li {
        margin-bottom: 30px;
        padding-left: 50px;
        display: inline-block;
        text-align: left;

        > span {
          display: inline-block;
          color: #fff;
          font-size: 20px;
          width: 100px;

          &.name {
            width: 300px;
          }
        }

        .ant-progress-line {
          font-size: 20px;
          position: relative;
          display: inline-block;
          width: 200px;
          margin: 0 20px;

          .ant-progress-inner {
            background-color: transparent;
          }
        }
      }
    }
  }

  .r-section1 {
    margin-bottom: 20px;
    margin-top: 10px;

    &:last-child {
      margin-bottom: 0;

      > div {
        height: 336px;
      }
    }

    > div {
      padding: 20px;
      height: 313px;
      position: relative;
    }

    .legend {
      position: absolute;
      top: 10px;
      right: 10px;

      p {
        color: #fff;
        margin-bottom: 10px;
        font-size: 20px;

        &:nth-child(1) {
          &:before {
            background-color: rgb(254 64 14);
          }
        }

        &:nth-child(2) {
          &:before {
            background-color: rgb(252 181 119);
          }
        }

        &:nth-child(3) {
          &:before {
            background-color: rgb(250 161 17);
          }
        }

        &:nth-child(4) {
          &:before {
            background-color: rgb(234 211 45);
          }
        }

        &:nth-child(5) {
          &:before {
            background-color: rgb(1 255 255);
          }
        }

        &:before {
          content: "";
          display: inline-block;
          width: 40px;
          height: 20px;
          border-radius: 5px;
          background-color: #0099ff;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }
  }

  .y-section1 {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 28px;
    color: white;

    .border {
      height: 1063px;

      .ant-progress-line {
        width: 75%;
      }

      li {
        margin-top: 0px;
        margin-bottom: 30px;
        padding-left: 50px;
        display: inline-block;
        text-align: left;

        > div {
          display: inline-block;
          color: #fff;
          font-size: 28px;
          width: 100px;

          &.name {
            width: 500px;
          }
        }

        .score {
          position: relative;
          left: 50px;
          top: 15px;
        }

        .ant-progress-line {
          font-size: 20px;
          position: relative;
          display: inline-block;
          margin: 0 0px;
          top: 15px;

          .ant-progress-inner {
            background-color: transparent;
          }
        }
      }
    }
  }

  .satisfaction {
    position: absolute;
    top: 40px;
    left: 10px;

    .ant-progress-circle-trail {
      stroke: rgb(14 16 39);
    }

    .ant-progress-circle-path {
      stroke: rgb(254 64 14);
    }
  }

  .realize {
    position: absolute;
    top: 70px;
    left: 40px;

    .ant-progress-circle-trail {
      stroke: rgb(25 28 83);
    }

    .ant-progress-circle-path {
      stroke: rgb(252 181 119);
    }
  }

  .realize1 {
    position: absolute;
    top: 95px;
    left: 65px;

    .ant-progress-circle-trail {
      stroke: rgb(29 44 109);
    }

    .ant-progress-circle-path {
      stroke: rgb(250 161 17);
    }
  }

  .realize2 {
    position: absolute;
    top: 115px;
    left: 85px;

    .ant-progress-circle-trail {
      stroke: rgb(63 68 150);
    }

    .ant-progress-circle-path {
      stroke: rgb(234 211 45);
    }
  }

  .realize3 {
    position: absolute;
    top: 130px;
    left: 100px;

    .ant-progress-circle-trail {
      stroke: rgb(101 137 251);
    }

    .ant-progress-circle-path {
      stroke: rgb(1 255 255);
    }
  }

  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
