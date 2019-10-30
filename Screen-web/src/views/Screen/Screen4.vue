<template>
    <div class="screenBox">

        <div class="topBox clearfix">
            <div class="nowRoom left">{{name}}</div>
            <div class="centers left">会议列表</div>
            <div class="timesBox left">
                <div class="times">{{times}}</div>
                <div class="dates">{{dates}} <span>{{weeks}}</span></div>
            </div>
        </div>

        <div class="contentBox clearfix">
            <div class="leftBox left">
                <div class="dateBox">
                    <div class="datename">{{meetingInfo.theme}}</div>
                    <div class="timesPlace">{{meetingInfo.time}}  {{meetingInfo.organizationName}}</div>
                </div>
                <div class="sceneImg">
                    <img src="../../assets/screen/scene.png" alt="">
                </div>
            </div>

            <div class="rightList left">

                <a-table
                    :columns="columns"
                    :dataSource="data"
                    :pagination="false"
                    :rowKey="record => String(record.id)"></a-table>

            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { Table } from 'ant-design-vue';
    import { getMeetingRoom, getMeeting, getMeetingList } from "../../remote/screen4";
    import {getToken} from '@/remote/screen1';
    import {autoDoFn, formatWeek} from '@/utils/util';

    const columns = [
        {
            title: '会议室名称',
            dataIndex: 'roomName'
        },
        {
            title: '会议室主题',
            dataIndex: 'theme'
        },
        {
            title: '日期',
            dataIndex: 'appointmentDate'
        },
        {
            title: '时间',
            dataIndex: 'time'
        },
        {
            title: '申请人',
            dataIndex: 'employeesName'
        }
    ]

  export default {
    name: 'screen',
    components:{
        ATable: Table,
    },
    data() {
      return {
        times:'',   //时分秒
        dates:'',   //年月日
        weeks:'',   //周几
        name:'',    //会议室名称
        meetingInfo:'',  //会议详情
        timer: null,    // 定时器
        thirtyTimer:null,
        columns,
        data :[]
      }
    },
    created() {
        this.getData();

        this.setTimes();
        clearInterval(this.thirtyTimer);
        this.thirtyTimer = setInterval(()=>{
            this.getData();
        },1800000)
    },
    methods: {
      moment,
      setTimes() {
        this.times = moment().format('hh:mm:ss');
        this.dates = moment().format('YYYY 年 MM 月 DD日');
        this.weeks = formatWeek(moment().format('d'));
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.times = moment().format('hh:mm:ss');
          this.dates = moment().format('YYYY 年 MM 月 DD日');
          this.weeks = formatWeek(moment().format('d'));
        }, 1000)
      },

      getData(){
        autoDoFn(async () => {
            const res = await getToken();
            if (res) {
                localStorage.screenToken = res.data;
                this.getMeetingList(res.data);
                this.getMeeting(res.data);
                this.getMeetingRoom(res.data);
            }
        });
      },

      // 会议列表
      getMeetingList(token) {
        autoDoFn(async () => {
          const res = await getMeetingList({token});
          if(res && res.success && res.data) {
                this.data = res.data.list;
            }
        });
      },

      // 获取会议详情接口
      getMeeting(token) {
        autoDoFn(async () => {
          const res = await getMeeting({token});
          if(res && res.success && res.data) {

                this.meetingInfo = res.data;
            }
        });
      },

      // 获取会议室接口
      getMeetingRoom(token) {
        autoDoFn(async () => {
          const res = await getMeetingRoom({token});
          if(res && res.success && res.data) {
                this.name = res.data.name;
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

<style scoped>
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .left {
        float: left;
    }

    .right {
        float: right;
    }

    input {
        background: inherit;
    }

    .weightfont {
        font-family: 'selffont', Helvetica, 'Avenir', Arial, sans-serif;
    }

    .boldFont {
        font-weight: 600;
    }

    .lightColor {
        color: rgba(255, 255, 255, 0.80);
    }

    a, a:hover {
        color: #2BF094;
    }

    .ellispsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .screenBox {
        width: 1920px;
        /* width:100%; */
        height: 1080px;
        overflow: hidden;
        background: rgba(3, 89, 102, 0.36) url('../../assets/screen/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        color: #fff;
    }

    .screenBox .topBox {
        padding: 20px 10px;
    }

    .screenBox .topBox > div {
        height: 185px;
        display: inline-block;
        border-radius: 10px 10px 0 0;
        background: rgba(3, 89, 102, 0.36);
    }

    .screenBox .topBox .nowRoom {
        width: 26%;
        font-size: 66px;
        line-height: 185px;
        text-align: center;
    }

    .screenBox .topBox .centers {
        width: 52%;
        margin: 0 10px;
        font-size: 48px;
        line-height: 185px;
        padding-left: 40px;
    }

    .screenBox .topBox .timesBox {
        width: calc(22% - 20px);
        position: relative;
    }

    .screenBox .topBox .timesBox .times {
        font-size: 40px;
        position: absolute;
        top: 20px;
        left: 50px;
    }

    .screenBox .topBox .timesBox .dates {
        font-size: 24px;
        position: absolute;
        bottom: 20px;
        left: 50px;
    }

    .screenBox .topBox .timesBox .dates span {
        margin-left: 20px;
    }

    .screenBox .contentBox {
        padding: 0 10px;
    }

    .screenBox .leftBox {
        width: 26%;
        margin-right: 10px;
    }

    .screenBox .leftBox .dateBox {
        height: 230px;
        text-align: center;
        padding-top: 60px;
        background: rgba(3, 89, 102, 0.36);
    }

    .screenBox .leftBox .datename {
        font-size: 43px;
    }

    .screenBox .leftBox .timesPlace {
        margin-top: 30px;
        font-size: 25px;
    }

    .screenBox .leftBox .sceneImg {
        width: 100%;
        margin-top: 10px;
    }

    .screenBox .leftBox .sceneImg img {
        width: 100%;
        height: 600px;
    }

    .screenBox .rightList {
        width: calc(74% - 10px);
    }

    .screenBox .ant-table-wrapper {
        height: 840px;
        background: rgba(3, 89, 102, 0.25)!important;
    }

    .screenBox .ant-table-thead > tr > th,
    .screenBox .ant-table-placeholder{
        background: transparent!important;
        height: 90px;
        font-size: 30px;
        color: #fff;
        border-bottom: 1px solid #2435415c;
    }

    .screenBox .ant-table-placeholder {
        height: 90px;
        font-size: 30px;
        color: #fff;
        border-bottom: 1px solid #2435415c;
    }
    .screenBox .rightList table {
        padding: 0 30px;
        box-sizing: border-box;
    }
    .screenBox .ant-table-tbody > tr > td {
        color: #fff;
        font-size: 30px;
        border-bottom: 1px solid #2435415c!important;
    }
    .screenBox .ant-table-thead > tr.ant-table-row-hover > td, .ant-table-tbody > tr.ant-table-row-hover > td, .ant-table-thead > tr:hover > td, .ant-table-tbody > tr:hover > td {
        background: transparent!important;
    }



</style>
