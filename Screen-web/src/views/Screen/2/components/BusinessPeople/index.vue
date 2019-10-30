<template>
  <div class="bg_div1">
    <div class="bg_title">{{organizationName}}</div>
    <div class="bg_body">
      <a-row>
        <a-col :span="1">
          <p style="padding-top: 10px">负责人</p>
        </a-col>
        <a-col :span="4">
          <img
            style="width: 130px; max-height:160px;height: 160px "
            :src="(!principal.icon || principal.icon.length < 10) ? './images/common/defaultAvatar.png' : principal.icon"
          >
        </a-col>
        <a-col :span="9">
          <p>姓名：{{principal.name}}</p>
          <p style="margin: 23px 0">工号：{{principal.employeeNo}}</p>
          <p>电话：{{principal.officePhone}}</p>
        </a-col>
        <a-col :span="10">
          <p>
            本区域共设服务窗口
            <span class="number">{{windowCount}}</span>个
          </p>
          <p style="margin: 23px 0">
            当前开放
            <span class="number">{{openWindowCount}}</span>个
          </p>
          <p
            style="overflow: hidden; text-overflow: ellipsis;white-space: nowrap;width: 18em;"
            v-if="openWindow && openWindow.length"
          >
            可办理窗口
            <span class="number" v-for="item in openWindow">{{item}}</span>
          </p>
          <p v-else>可办理窗口：无</p>
        </a-col>
      </a-row>
      <a-row class="content-two">
        <a-col :span="6">
          <p class="content_1">
            平均等待时长
            <span class="number">{{averageaitingime}}</span>分钟
          </p>
          <p class="content_1">
            当前等待人数
            <span class="number">{{currentWaitingNumber}}</span>人
          </p>
          <p class="content_1">
            网上预约
            <span class="number">{{bookingOnLine}}</span>人
          </p>
        </a-col>
        <a-col class="content_col_2" :span="6">
          <span>上岗情况</span>
          <p style="text-align: center">
            <span class="number" style="font-size: 28px">{{boardingSituation}}%</span>
          </p>
          <div class="content-two-d">
            <div class="two-title">
              <p>未上岗情况</p>
            </div>
            <div class="two-body">
              <ul>
                <li v-for="item in absenceOfPosts">窗口{{item}}</li>
              </ul>
            </div>
          </div>
        </a-col>
        <a-col class="content_col_2" :span="6">
          <span>满意度</span>
          <p style="text-align: center">
            <span class="number" style="font-size: 28px">{{situation}}%</span>
          </p>
          <div class="content-two-d">
            <div class="two-title">
              <p>不满意情况</p>
            </div>
            <div class="two-body">
              <ul>
                <li
                  v-for="item in dissatisfaction"
                >{{item.windowNo}}窗口{{item.dissatisfactionCount}}件</li>
              </ul>
            </div>
          </div>
        </a-col>
        <a-col class="content_col_2" :span="6">
          <span>今日办件量</span>
          <p style="text-align: center">
            <span class="number" style="font-size: 28px">{{todayVolume}}件</span>
          </p>
          <div class="content-two-d">
            <div class="two-title">
              <p>各窗口办件</p>
            </div>
            <div class="two-body">
              <ul>
                <li v-for="item in windowTodayVolume">{{item}}</li>
              </ul>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="content-three">
        <a-col
          :span="8"
          v-for="(item,index) in employeeList.slice(6*employeeIndex, 6*(employeeIndex+1))"
          :key="item.id"
          :class="{'left':(index+1)%3===1,'center':(index+1)%3===2,'right':(index+1)%3===0}"
        >
          <div class="photo">
            <img
              class="photo-img"
              :src="(!item.icon || item.icon.length < 10) ? './images/common/defaultAvatar.png' : item.icon"
            >
            <img src="../../../../../assets/screen/boder.png" class="photo-border">
          </div>
          <div class="message">
            <p>姓&nbsp;&nbsp;名：{{item.name}}</p>
            <p>工&nbsp;&nbsp;号：{{item.employeeNo}}</p>
            <p>满意度：{{item.satisfaction}}</p>
            <p class="evaluate" v-if="item.isStar === 1">
              月度示范窗口：
              <img
                src="../../../../../assets/screen/star.png"
                v-for="o in item.amputated"
                style="width: 15px;height:14px;"
              >
            </p>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { Row, Col } from "ant-design-vue";
import { autoDoFn } from "@/utils/util";
import { getToken } from "@/remote/screen2";
import {
  getOrganization,
  getPerson,
  condition,
  getHot,
  getWindowCount,
  getWindowOpenCount,
  getOpenWindow,
  getAverageaitingime,
  getCurrentWaitingNumber,
  getBookingOnLine,
  getBoardingSituation,
  getAbsenceOfPosts,
  getSituation,
  getDissatisfaction,
  getTodayVolume,
  getWindowTodayVolume,
  getEmployeeList
} from "@/remote/screen2";

export default {
  name: "index",
  components: {
    ARow: Row,
    ACol: Col
  },
  data() {
    return {
      token: "",
      allNum: 5000, //热门事件总技术
      principal: "", //负责人
      windowCount: "", //窗口个数
      openWindowCount: "", //开放窗口个数
      openWindow: [], //可办理窗口
      averageaitingime: "", //平均等待时长
      currentWaitingNumber: "", //等待人生
      bookingOnLine: "", //网上预约
      boardingSituation: "", //上岗情况接口
      absenceOfPosts: "", //未上岗情况
      situation: "", //满意度
      dissatisfaction: "", //不满意情况
      todayVolume: "", //今日办件量
      windowTodayVolume: "", //各窗口办件量
      employeeList: [], //窗口人员列表
      organizationName: "",
      organIndex: 0,
      employeeIndex: "",
      timer4: null,
      timer1: null,
      timer5: null,
      timer6: null,
      timer7: null
    };
  },
  created() {
    autoDoFn(async () => {
      const res = await getToken();
      if (res) {
        localStorage.screenToken = res.data;
        this.token = res.data;
        this.getOrganization(res.data);
      }
    });
  },
  methods: {
    jump() {
      this.$router.push({
        path: "/screen8",
        name: "screen8"
      });
    },
    getOrganization(token) {
      var _this = this;
      autoDoFn(async () => {
        const res = await getOrganization({ token });
        if (res === undefined) {
          this.$router.push({
            path: "/screen9",
            name: "screen9"
          });
        }
        if (res.success) {
          var index = 0;
          if (this.organIndex > res.data.length - 1) {
            this.jump();
          } else {
            let id = res.data[this.organIndex].id;
            this.organizationName = res.data[this.organIndex].name;
            this.getMiddleData(id, token);
          }
          // this.timer1 = setInterval(() => {
          //     if (index > res.data.length - 1) {
          //         // this.jump();
          //     } else {
          //         index++
          //     }
          //     let id = res.data[index].id
          //
          //     this.organizationName = res.data[index].name;
          //     this.getMiddleData(id, token);
          // }, 30 * 1000);
          // let id = res.data[index].id
          // this.organizationName = res.data[index].name;
          // this.getMiddleData(id, token);
        }
      });
    },
    getMiddleData(id, token) {
      this.getPersons(id, token);
      this.getWindowCount(id, token);
      this.getWindowOpenCount(id, token);
      this.getOpenWindow(id, token);
      this.getAverageaitingime(id, token);
      this.getCurrentWaitingNumber(id, token);
      this.getBookingOnLine(id, token);
      this.getBoardingSituation(id, token);
      this.getAbsenceOfPosts(id, token);
      this.getSituation(id, token);
      this.getDissatisfaction(id, token);
      this.getTodayVolume(id, token);
      this.getWindowTodayVolume(id, token);
      this.getEmployeeList(id, token);
    },
    getPersons(organizationId, token) {
      autoDoFn(async () => {
        const res = await getPerson({ organizationId, token });
        if (res.success) {
          this.principal = res.data[0];
        }
      });
    },
    getWindowCount(organizationId, token) {
      autoDoFn(async () => {
        const res = await getWindowCount({ organizationId, token });
        if (res.success) {
          this.windowCount = res.data;
        }
      });
    },
    getWindowOpenCount(organizationId, token) {
      autoDoFn(async () => {
        const res = await getWindowOpenCount({ organizationId, token });
        if (res.success) {
          this.openWindowCount = res.data;
        }
      });
    },
    getOpenWindow(organizationId, token) {
      autoDoFn(async () => {
        const res = await getOpenWindow({ organizationId, token });
        if (res.success) {
          this.openWindow = res.data;
        }
      });
    },
    getAverageaitingime(organizationId, token) {
      autoDoFn(async () => {
        const res = await getAverageaitingime({ organizationId, token });
        if (res.success) {
          this.averageaitingime = res.data;
        }
      });
    },
    getCurrentWaitingNumber(organizationId, token) {
      autoDoFn(async () => {
        const res = await getCurrentWaitingNumber({ organizationId, token });
        if (res.success) {
          this.currentWaitingNumber = res.data;
        }
      });
    },
    getBookingOnLine(organizationId, token) {
      autoDoFn(async () => {
        const res = await getBookingOnLine({ organizationId, token });
        if (res.success) {
          this.bookingOnLine = res.data;
        }
      });
    },
    getBoardingSituation(organizationId, token) {
      autoDoFn(async () => {
        const res = await getBoardingSituation({ organizationId, token });
        if (res.success) {
          this.boardingSituation = res.data;
        }
      });
    },
    getAbsenceOfPosts(organizationId, token) {
      this.absenceOfPosts = "";
      clearInterval(this.timer4);
      autoDoFn(async () => {
        const res = await getAbsenceOfPosts({ organizationId, token });
        if (res.success) {
          if (res.data.length >= 3) {
            var num = 3;
            console.log(res.data);
            this.absenceOfPosts = res.data.slice(0, 2);
            this.timer4 = setInterval(() => {
              this.absenceOfPosts.shift();
              this.absenceOfPosts.push(res.data[num]);
              if (num >= res.data.length - 1) {
                num = 0;
              } else {
                num++;
              }
            }, 3000);
          } else {
            this.absenceOfPosts = res.data;
          }
        }
      });
    },
    getSituation(organizationId, token) {
      autoDoFn(async () => {
        const res = await getSituation({ organizationId, token });
        if (res.success) {
          this.situation = res.data;
        }
      });
    },
    getDissatisfaction(organizationId, token) {
      autoDoFn(async () => {
        const res = await getDissatisfaction({ organizationId, token });
        if (res.success) {
          if (res.data.length >= 3) {
            var num = 3;
            this.dissatisfaction = res.data.slice(0, 2);
            this.timer5 = setInterval(() => {
              this.dissatisfaction.shift();
              this.dissatisfaction.push(res.data[num]);
              if (num >= res.data.length - 1) {
                num = 0;
              } else {
                num++;
              }
            }, 3000);
          } else {
            this.dissatisfaction = res.data;
          }
        }
      });
    },
    getTodayVolume(organizationId, token) {
      autoDoFn(async () => {
        const res = await getTodayVolume({ organizationId, token });
        if (res.success) {
          this.todayVolume = res.data;
        }
      });
    },
    getWindowTodayVolume(organizationId, token) {
      autoDoFn(async () => {
        const res = await getWindowTodayVolume({ organizationId, token });
        if (res.success) {
          if (res.data.length >= 3) {
            var num = 3;
            this.windowTodayVolume = res.data.slice(0, 2);
            this.timer6 = setInterval(() => {
              this.windowTodayVolume.shift();
              this.windowTodayVolume.push(res.data[num]);
              if (num >= res.data.length - 1) {
                num = 0;
              } else {
                num++;
              }
            }, 3000);
          } else {
            this.windowTodayVolume = res.data;
          }
        }
      });
    },
    getEmployeeList(organizationId, token) {
      clearInterval(this.timer7);
      autoDoFn(async () => {
        const res = await getEmployeeList({ organizationId, token });

        if (res.success) {
          this.employeeList = res.data;
          this.employeeIndex = 0;
          let max = res.data.length / 6;
          console.log("max" + max);
          if (res.data.length <= 0) {
            this.organIndex++;
            this.getOrganization(token);
          }
          this.timer7 = setInterval(() => {
            if (this.employeeIndex >= max - 1) {
              this.organIndex++;
              this.getOrganization(token);
              console.log("我想看看走不走这里");
            } else {
              console.log(this.employeeIndex);
              ++this.employeeIndex;
            }
          }, 5000);
        }
      });
    }
  },
  destroyed() {
    clearInterval(this.timer1);
    clearInterval(this.timer4);
    clearInterval(this.timer5);
    clearInterval(this.timer6);
    clearInterval(this.timer7);
  }
};
</script>

<style lang="less" scoped>
.bg_div1 {
  height: 1032px;
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
    height: 1015px;
    background-color: rgba(1, 21, 24, 0.8);
    padding: 10px 30px;
    text-align: center;
    font-size: 28px;
    font-family: "SimHei";
    color: rgb(249, 253, 252);

    .ant-row {
      padding-top: 0px;
    }

    p {
      text-align: left;
      font-size: 26px;
      font-family: "SimHei";

      .number {
        color: #30ffff;
        padding: 0 10px;
      }
    }

    .content-two {
      position: relative;
      top: 30px;

      .content_col_2 {
        position: relative;
        left: 30px;
        font-size: 28px;
      }

      .content_1 {
        margin-top: 30px;
        font-size: 30px;
        width: 355px;
      }

      p {
        margin: 10px 0;

        .number {
          font-size: 30px;
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
      margin-top: 30px;

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
          width: 140px;
          height: 200px;
          z-index: 10;
          position: absolute;
          top: -5px;
          left: 5px;
        }
      }

      .message {
        height: 123px;

        p {
          font-size: 27px;
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
</style>
