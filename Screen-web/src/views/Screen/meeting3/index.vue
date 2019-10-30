<template>
  <div class="screenBox">
    <a-row :gutter="10" style="height: 277px;">
      <a-col class="col_2" :span="10" style="float: right;">
        <div
          style="font-size: 75px;font-family: initial;color: rgb(0, 101, 173);margin-top: 110px;margin-left: 135px;"
        >{{dates}}</div>
      </a-col>
    </a-row>

    <a-row :gutter="20" v-if="show">
      <a-col class="col_1" :span="8" style="text-align: center;width: 100%">
        <table style="width:97%;margin:100px auto;">
          <thead>
            <tr>
              <td
                style="border: 1px solid #000; height: 80px; line-height: 80px; text-align: left; font-size: 40px;width: 80%;padding-left: 40px;letter-spacing: 4px;border-left: none;color:#0055A2;font-weight: 600;font-family: 黑体;"
              >项目名称</td>
              <td
                style="border: 1px solid #000; height: 80px; line-height: 80px; text-align: left;font-size: 40px; padding-left: 40px;letter-spacing: 4px;border-right:none;color:#0055A2;font-weight: 600;font-family: 黑体;"
              >开标时间</td>
            </tr>
          </thead>
          <tr v-for="pit in pits">
            <td
              style="border: 1px solid #000;height: 80px; line-height: 80px;  text-align: left; font-size: 38px;width: 80%;padding-left: 40px;letter-spacing: 2px;border-left: none;color:#0055A2;font-weight: 500;font-family: 黑体;"
            >{{pit.name}}</td>
            <td
              style="border: 1px solid #000;height: 80px; line-height: 80px; text-align: left; font-size: 38px;padding-left: 40px;letter-spacing: 2px;border-right:none;color:#0055A2;font-weight: 500;font-family: 黑体;"
            >{{pit.time}}</td>
          </tr>
        </table>
        <!-- <h1
          style="font-size: 115px;margin: 260px 40px 120px;letter-spacing: 12px;color: #042b48;font-weight: bold;"
        >{{theme}}</h1>-->
        <!-- <div style="font-size: 55px;color: rgb(4, 43, 72);font-weight: bold;text-align: left;padding-left: 35%">
                    主办单位：{{organizationName}}<br/>
                    会议时间：{{time}}
        </div>-->
      </a-col>
    </a-row>
    <a-row :gutter="20" v-if="showt">
      <a-col class="col_1" :span="8" style="text-align: center;width: 100%">
        <h1
          style="font-size: 100px;margin: 240px 0px 110px;letter-spacing: 12px;color: #042b48;font-weight: bold;"
        >暂无会议</h1>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from "moment";
import { getMeetings } from "@/remote/screen6";
import { autoDoFn, formatWeek } from "@/utils/util";
import { getToken } from "../../../remote/screen2";
import { Row, Col } from "ant-design-vue";
import Weather from "./components/weather";

export default {
  name: "index",
  components: {
    Weather,
    ARow: Row,
    ACol: Col
  },
  data() {
    return {
      times: "", //时分秒
      dates: "", //年月日
      weeks: "", //周几
      name: "",
      meetingInfo: "",
      nextdata: "",
      nexttime: "",
      theme: "",
      organizationName: "",
      time: "",
      timer: null,
      thirtyTimer: null,
      show: true,
      showt: false,
      pits: [],
      datas: [],
      totalDatas: [],
      index0: 0,
      index1: 0,
      index2: 0,
      index3: 0,
      index4: 0,
      sleep0: 0,
      sleep1: 0,
      sleep2: 0,
      sleep3: 0,
      sleep4: 0,
      page: 0,
      pageSize: 5,
      start: 0
    };
  },
  created() {
    this.getData();
    this.setTimes();
    clearInterval(this.thirtyTimer);
    this.thirtyTimer = setInterval(() => {
      this.getData();
    }, 20000);
  },
  methods: {
    moment,
    setTimes() {
      this.times = moment().format("HH:mm:ss");
      this.dates = moment().format("YYYY/MM/DD");
      this.weeks = formatWeek(moment().format("d"));
      this.timer = setInterval(() => {
        this.times = moment().format("HH:mm:ss");
        this.dates = moment().format("YYYY / MM / DD");
        this.weeks = formatWeek(moment().format("d"));
      }, 1000);
    },
    currentPageData() {
      if (this.start === 0) {
        this.start = 1;
      }
      this.currentPageData = setInterval(() => {
        this.getDatas();
      }, 10000);
    },
    getData() {
      autoDoFn(async () => {
        const res = await getToken();
        if (res) {
          localStorage.screenToken = res.data;
          this.getMeeting(res.data);
        }
      });
    },
    roller() {
      this.roller = setInterval(() => {
        if (this.datas && this.datas.length > 0) {
          this.pits = this.datas.map(item => {
            if (item.theme.length > 30) {
              if (item.id == 0) {
                item.name = item.theme.substring(this.index0, this.index0 + 30);
                if (item.theme.length > 30 + this.index0) {
                  this.index0 += 1;
                } else {
                  if (this.sleep0 <= 10) {
                    this.sleep0 += 1;
                  } else {
                    this.sleep0 = 0;
                    this.index0 = 0;
                  }
                }
              } else if (item.id == 1) {
                item.name = item.theme.substring(this.index1, this.index1 + 30);
                if (item.theme.length > 30 + this.index1) {
                  this.index1 += 1;
                } else {
                  if (this.sleep1 <= 10) {
                    this.sleep1 += 1;
                  } else {
                    this.sleep1 = 0;
                    this.index1 = 0;
                  }
                }
              } else if (item.id == 2) {
                item.name = item.theme.substring(this.index2, this.index2 + 30);
                if (item.theme.length > 30 + this.index2) {
                  this.index2 += 1;
                } else {
                  if (this.sleep2 <= 10) {
                    this.sleep2 += 1;
                  } else {
                    this.sleep2 = 0;
                    this.index2 = 0;
                  }
                }
              } else if (item.id == 3) {
                item.name = item.theme.substring(this.index3, this.index3 + 30);
                if (item.theme.length > 30 + this.index3) {
                  this.index3 += 1;
                } else {
                  if (this.sleep3 <= 10) {
                    this.sleep3 += 1;
                  } else {
                    this.sleep3 = 0;
                    this.index3 = 0;
                  }
                }
              } else if (item.id == 4) {
                item.name = item.theme.substring(this.index4, this.index4 + 30);
                if (item.theme.length > 30 + this.index4) {
                  this.index4 += 1;
                } else {
                  if (this.sleep4 <= 10) {
                    this.sleep4 += 1;
                  } else {
                    this.sleep4 = 0;
                    this.index4 = 0;
                  }
                }
              }
              return item;
            } else {
              item.name = item.theme;
              return item;
            }
          });
        } else {
          this.pits = [];
        }
      }, 500);
    },
    // 获取会议详情接口
    getMeeting(token) {
      autoDoFn(async () => {
        const res = await getMeetings({ token });
        if (
          res &&
          res.success &&
          res.data &&
          Object.prototype.toString.call(res.data) === "[object Array]"
        ) {
          if (res.data.length > 0) {
            this.totalDatas = res.data.map((item, index) => {
              item.time = item.time.split("-")[0];
              if (item.time.split(":")[0] < 10) {
                item.time = "0" + item.time;
              }
              return item;
            });
            this.show = true;
            this.showt = false;
          } else {
            this.pits = [];
            this.show = false;
            this.showt = true;
          }
          //   if (res.data.theme) {
          //     this.theme = res.data.theme;
          //     this.time = res.data.time;
          //     this.organizationName = res.data.hostUnit;

          //   } else {
          //     this.theme = "";
          //     this.time = "";
          //     this.organizationName = "";
          //     this.meetingInfo = res.data;

          //   }
        } else {
          this.pits = [];
          this.show = false;
          this.showt = true;
        }
        this.reset();
        this.getDatas();
        if (this.start === 0) {
          this.currentPageData();
          this.roller();
        }
      });
    },
    getDatas() {
      var begin = this.page * this.pageSize + 1;
      var end = (this.page + 1) * this.pageSize;
      if (end >= this.totalDatas.length) {
        this.page = 0;
      } else {
        this.page += 1;
      }
      this.datas = this.totalDatas.filter((item, index) => {
        if (index + 1 >= begin && index + 1 <= end) {
          return item;
        }
      });
      this.datas = this.datas.map((item, index) => {
        item.id = index;
        return item;
      });
    },
    reset() {
      (this.index0 = 0),
        (this.index1 = 0),
        (this.index2 = 0),
        (this.index3 = 0),
        (this.index4 = 0),
        (this.sleep0 = 0),
        (this.sleep1 = 0),
        (this.sleep2 = 0),
        (this.sleep3 = 0),
        (this.sleep4 = 0),
        (this.page = 0);
    }
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.thirtyTimer);
    clearInterval(this.currentPageData);
    clearInterval(this.roller);
  }
};
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
    .wea {
      position: relative;
      top: -240px;
      font-size: 40px;
    }
    .timesBox {
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
  .col_2 {
    text-align: center;
    .title {
      text-align: left;
      width: 1500px;
      background-color: #2c3842;
      position: absolute;
      top: -195px;
      left: -55px;
      font-size: 72px;
      color: #c5c8ce;
    }
    .h2 {
      color: white;
      font-size: 80px;
      width: 1500px;
      margin-top: 50px;
      overflow: hidden; /*自动隐藏文字*/
      text-overflow: ellipsis; /*文字隐藏后添加省略号*/
      // white-space: nowrap; /*强制不换行*/
      width: 16em; /*不允许出现半汉字截断*/
    }
    .h3 {
      font-size: 72px;
      margin-top: 50px;
      width: 1314px;
      color: white;
    }
    .h4 {
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
