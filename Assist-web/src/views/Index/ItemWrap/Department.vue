<template>
    <div class="department-wrap">
        <h1 class="common-title">部门业务管理</h1>
        <h3 class="common-subtitle">{{month}}月绩效排名</h3>
        <a-row :gutter="96" class="order-wrap">
            <a-col :span="12">
                <div class="item-wrap"
                     :key="item.organizationId"
                     v-show="listData1.length>0"
                     v-for="(item, index) in listData1">
                    <a-tooltip placement="topRight" >
                        <template slot="title">
                            <span>第{{ index + 1}}名{{item.organizationName}}</span>
                        </template>
                        <p class="title">
                            第{{ index + 1}}名{{item.organizationName}}
                        </p>
                    </a-tooltip>
                    <a-progress :strokeWidth="15"
                                status="normal"
                                :percent="item.finalScore" :format="(value) => `${value}分`" />
                </div>
            </a-col>
            <a-col :span="12">
                <div class="item-wrap"
                     :key="item.organizationId"
                     v-show="listData2.length>0"
                     v-for="(item, index) in listData2">
                    <a-tooltip placement="topRight" >
                        <template slot="title">
                            <span>第{{ index + 11}}名{{item.organizationName}}</span>
                        </template>
                        <p class="title">
                            第{{ index + 11}}名{{item.organizationName}}
                        </p>
                    </a-tooltip>
                    <a-progress :strokeWidth="15"
                                status="normal"
                                :percent="item.finalScore" :format="(value) => `${value}分`" />
                </div>
                <div v-if="listData1.length<=0">暂无数据</div>
            </a-col>
        </a-row>
        <hr style="height:1px;border:none;border-top:1px solid #eef1f3;">
        <h3 class="common-subtitle">平均办件时长</h3>
        <div class="time-wrap clearfix">
            <!--图表-->
            <div class="time-chart" style="width: calc(100% - 300px)">
                <v-chart v-if="init" ref="charts" :options="optition"/>
            </div>
            <ul class="order-list">
                <li v-for="(item, index) in averageMinuteList" :key='index'>
                    <p class="num">{{ index + 1 }}</p>
                    <a-tooltip placement="topLeft" >
                        <template slot="title">
                            <span>第{{index + 1}}名</span>
                        </template>
                        <p class="name">{{item.deptName}}</p>
                    </a-tooltip>
                    <p class="time">{{item.averageMinute}}分钟</p>
                </li>
            </ul>
        </div>
      <h3 class="common-subtitle">各部门工作人员详情</h3>
      <search-box @onSearch="handleSearch" @onReset="handleReset">
        <search-box-item label="组织结构：">
          <a-tree-select
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="orgTreeData"
            showSearch
            treeNodeFilterProp="title"
            placeholder='请选择组织机构'
            treeDefaultExpandAll
            v-model="searchParams.orgId"/>
        </search-box-item>
        <search-box-item  label="查询时间：" :span="1">
          <a-range-picker :allowClear="false"
                          v-model="searchParams.searchTime"
                          style="width: 95%"
                          format="YYYY-MM-DD"
                          :placeholder="['开始日期','结束日期']">
          </a-range-picker>
        </search-box-item>
        <search-box-item label="姓名：">
          <a-input v-model="searchParams.empName" placeholder="请输入姓名"/>
        </search-box-item>
      </search-box>
      <div class="content">
        <a-table :columns="columns"
                 :dataSource="data"
                 :loading="loading"
                 :scroll="scroll"
                 :rowKey="record => String(record.id)"
                 @change="onPageChange"
                 :pagination="pagination">
        </a-table>
        <div style="position: relative; left: 0px;top: -70px;width: 400px">
          <span style="margin: 20px 20px;">页/行</span>
          <a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;"
                    placeholder=''
                    :getPopupContainer="triggerNode => triggerNode.parentNode">
            <a-select-option value = '10'>10/行</a-select-option>
            <a-select-option value = '30'>30/行</a-select-option>
            <a-select-option value = '50'>50/行</a-select-option>
            <a-select-option value = '100'>100/行</a-select-option>
          </a-select>
          <span style="margin-left: 10px">共{{pagination.total}}条</span>
        </div>
      </div>

    </div>
</template>

<script>
  import { departManager, averageMinute,getWorkerDetail } from '@/remote/index';
  import 'echarts/lib/chart/bar';
  import moment from 'moment';
  import {
      Row,
      Col,
      Input,
      Button,
      Table,
      Form,
      Select,
      DatePicker,
      Icon,
      Divider,
      Popconfirm,
      Modal,
      TreeSelect
    } from 'ant-design-vue';
  import { getOrgTree } from '@/remote/base';
  import SearchBox from '@/components/SearchBox/SearchBox.vue';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
  import { autoDoFn, transformTree } from '@/utils/util';

  const { Item } = Form;
  const { Option } = Select;
  const {RangePicker} = DatePicker;

  const columns = [
    {
      title: '姓名',
      dataIndex: 'employeeName',
      width: 200,
    },
    {
      title: '迟到',
      dataIndex: 'beLateTimes',
      width: 200,
    },
    {
      title: '请假',
      dataIndex: 'isLeaveTimes',
      width: 200,
    },
    {
      title: '早退',
      dataIndex: 'leaveEarlyTimes',
      width: 200,
    },
    {
      title: '未打卡',
      dataIndex: 'punchTimes',
      width: 200,
    },
    {
      title: '考核得分',
      dataIndex: 'finalScore',
      width: 200,
    },
    {
      title: '加减分项',
      dataIndex: 'description',
      width: 400,
    },
  ];
    export default {
    name: 'Department',

      components: {
        ARow: Row,
        ACol: Col,
        ATable: Table,
        AFormItem: Item,
        ASelect: Select,
        ASelectOption: Option,
        ADatePicker: DatePicker,
        ARangePicker: RangePicker,
        AIcon: Icon,
        ADivider: Divider,
        APopconfirm: Popconfirm,
        ATreeSelect: TreeSelect,
        SearchBox,
        SearchBoxItem,
      },

    data() {
      return {
        data:[],
        list: [],
        columns,
        orgTreeData: [],
        loading: false,
        searchParams: {
          searchTime: [],
          empName:'',
        },
        departmentCode: '1',
        scroll: {
          y: document.documentElement.clientHeight - 360,
        },
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
          pageSize: '10',
          defaultCurrent: 1,
          total: 0,
          rows: 10,
          page: 0,
        },
        init: false,
        listData1: [],
        listData2: [],
        averageMinuteList: [],
        optition:{},
        month:moment().subtract(1, 'months').format('MM')
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init = true;
      })
    },
    created() {
      this.departManager();
      this.averageMinute();
      this.initList();
      this.initBaseData();
      this.getWorkerDetail();
    },
    methods: {
      onShowSizeChange() {
        this.pagination.rows = this.pagination.pageSize
        this.initList()
      },
      initList() {
        autoDoFn(async () => {
          this.loading = true;
          const res = await getWorkerDetail({
            ...this.searchParams,
            ...this.pagination,
            startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD")+' 00:00:00':'',
            endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD")+' 23:59:59': '',
          });
          if (res.success) {
            this.data = res.data.list;
            console.log("data"+this.data);
            this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize;
          }
          this.loading = false;
        });
      },
      initBaseData() {
        autoDoFn(async () => {
          const orgRes = await getOrgTree();
          if (orgRes) {
            this.orgTreeData = transformTree(orgRes.data);
          }
        });
      },
      onPageChange(pagination) {
        this.pagination.page = pagination.current;
        this.$nextTick(() => {
          this.initList();
        });
      },
      handleSearch() {
        this.initList();
      },
      handleReset() {
        this.searchParams = {
          empName:'',
          orgId: '',
        };
        this.classify = {};
        this.pagination = {
          defaultCurrent: 1,
          total: 0,
          row: 10,
          page: 0,
        };
        this.$nextTick(() => {
          this.initList();
        });
      },
      barEvent(data) {
        let xdata=[];
        data.forEach(function (item, index) {
          xdata.push(
              item.deptName
          );
        });
        return {
          color: ['#0cd3f0'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          xAxis :{
              type : 'category',
              data : xdata,
              axisTick: {
                show: false,
              },
              axisLine: {
                  lineStyle: {
                      color: 'rgba(123, 124, 124, 1)',
                  },
              },
              axisLabel: {
                  fontSize: 12,
              },
          },
          yAxis: {
            name: '分',
            nameTextStyle:
            {
                fontSize: 16,
            },
            axisLine: {
              lineStyle: {
                  color: 'rgba(123, 124, 124, 1)',
              },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(159, 165, 168, 0.54)',
                },
            },
            scale: true,
            min:0,
        },
          series : [
            {
              label: {
                normal: {
                    show: true,
                    position: 'top'
                }
              },
              name:'直接访问',
              type:'bar',
              barWidth: '60%',
              data:data.map(item => item.averageMinute),
            }
          ]
        }
      },
      async departManager() {
        const res = await departManager();
        if(res){
          this.listData1 = res.data.slice(0, 6);
          this.listData2 = res.data.slice(6);
        }
      },
      async averageMinute() {
        const res = await averageMinute();
        if(res){
          this.averageMinuteList = res.data;
          this.optition = this.barEvent(res.data)
        }
      },
    },
  };
</script>

<style lang="less">
    .department-wrap{
        .order-wrap{
            margin-bottom: 20px;
            padding-right: 25px;
            .item-wrap{
                display: flex;
                font-size: 18px;
                margin-bottom: 15px;
                .title{
                    flex-basis: 200px;
                    width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: right;
                    padding-right: 10px;
                    margin-bottom: 0;
                    cursor: default;
                }
                .ant-progress-line{
                    flex: 1;
                    font-size: 18px;
                }
            }
        }
        .time-wrap{
            width: 100%;
            .time-chart{
                height: 500px;
                float: left;
            }
            .order-list{
                float: left;
                width: 300px;
                margin: 0;
                padding: 0;
                li{
                    display: flex;
                    cursor: default;
                    &:nth-child(1),
                    &:nth-child(2),
                    &:nth-child(3){
                        .num{
                            background-color: #0cd3f0;
                        }
                    }
                    .num{
                        width: 36px;
                        height: 36px;
                        background-color: #dbdcdd;
                        color: #fff;
                        text-align: center;
                        line-height: 36px;
                        font-size: 18px;
                        border-radius: 50%;
                    }
                    .name{
                        line-height: 36px;
                        padding-left: 14px;
                        padding-right: 15px;
                        font-size: 20px;
                        flex-basis: 180px;
                        width: 180px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .time{
                        line-height: 36px;
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>
