<template>
    <div class="complaint-wrap">
        <h1 class="common-title">投诉建议反馈</h1>
        <h3 class="common-subtitle">热门事项排行榜</h3>
        <div class="order-wrap">
            <!--图表-->
            <div class="order-chart" v-if="init">
                <v-chart v-if="init" ref="charts" :options="option1"/>
            </div>
        </div>
        <hr style="height:1px;border:none;border-top:1px solid #eef1f3;">
        <h3 class="common-subtitle">满意率和实现率</h3>
        <div class="percent-wrap" style="height: 748px;">
            <h4 class="common-sub-subtitle">满意率</h4>
            <ul class="satis-wrap clearfix">
                <li class='satis-item' v-for="item in list">
                    <a-tooltip placement="top" >
                        <template slot="title">
                            <span>{{item.organizationName}}</span>
                        </template>
                        <p class="name">{{item.organizationName}}</p>
                    </a-tooltip>
                    <a-progress type="circle"
                                status="normal"
                                :strokeWidth="10"
                                :percent="item.satisPoint" />
                </li>
            </ul>
            <hr style="height:1px;border:none;border-top:1px solid #eef1f3;">
            <h4 class="common-sub-subtitle">实现率</h4>
            <ul class="complete-wrap clearfix">
                <li class='satis-item' v-for="item in list">
                    <a-tooltip placement="top" >
                        <template slot="title">
                            <span>{{item.organizationName}}</span>
                        </template>
                        <p class="name">{{item.organizationName}}</p>
                    </a-tooltip>
                    <a-progress type="circle"
                                status="normal"
                                :strokeWidth="10"
                                :percent="item.completePoint" />
                </li>
            </ul>
        </div>

        <h2 class="common-subtitle">本月各窗口实现率情况</h2>

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
          </search-box>
      <div class="content">
          <a-table :columns = "columns"
                  :dataSource = "data"
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
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/legend';
  import _ from 'lodash';
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

  import { hotDo, satisAndComplete, getCompThisMonth} from '@/remote/index';
  import { getOrgTree } from '@/remote/base';
  import SearchBox from '@/components/SearchBox/SearchBox.vue';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
  import { autoDoFn, transformTree } from '@/utils/util';

  const { Item } = Form;
  const { Option } = Select;
  const {RangePicker} = DatePicker;

  const columns = [
    {
      title: '业务名称',
      dataIndex: 'matters',
      width: 200,
    },
    {
      title: '满意跑多次件数',
      dataIndex: 'two',
      width: 200,
    },
    {
      title: '不满意跑一次件数',
      dataIndex: 'three',
      width: 200,
    },
    {
      title: '不满意跑多次件数',
      dataIndex: 'four',
      width: 200,
    },
  ];
  export default {
    name: 'Complaint',
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

        data: [],
        departmentCode: '1',
        init: false,
        list: [],
        option1:{},
        classifyList: [],
        columns,
        orgTreeData: [],
        loading: false,
        searchParams: {},
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
      }
    },

    created() {
      this.initBaseData();
      this.initList();
      this.hotDo();
      this.satisAndComplete();
      this.getCompThisMonth();
    },

    mounted() {
      this.$nextTick(() => {
        this.init = true;
      })
    },

    methods: {
      onShowSizeChange() {
        this.pagination.rows = this.pagination.pageSize
        this.initList()
      },
      onPageChange(pagination) {
        this.pagination.page = pagination.current;
        this.$nextTick(() => {
          this.initList();
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
      handleSearch() {
        this.initList();
      },
      handleReset() {
        this.searchParams = {
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

      initList() {
        autoDoFn(async () => {
          this.loading = true;
          const res = await getCompThisMonth({
            ...this.searchParams,
            ...this.pagination,
          });
          if (res.success) {
            this.data = res.data.list;
            console.log("data"+this.data);
            this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize;
          }else {
            console.log("没有数据");
          }
          this.loading = false;
        });
      },
      async hotDo() {
        let res = await hotDo();
        if(res){
          const data = _.groupBy(res.data, 'hotTime');
          this.option1 =  this.barEvent(data)
        }
      },
      async satisAndComplete() {
        const res = await satisAndComplete();
        if(res){
          this.list = res.data;
        }
      },
      barEvent(data) {
        const series = [];
        const legendData = [];
        let yName = [];
        if(Object.keys(data).length){
          Object.keys(data).forEach(item => {
            series.push({
              label: {
                normal: {
                    show: true,
                    position: 'right'
                }
              },
              name: item,
              type: 'bar',
              data: data[item].map(item => item.doCount)
            });
            legendData.push(item);
            yName = data[item].map(item => item.matters);
          })
        }
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: legendData,
            left:
                'center',
            textStyle:
                {
                    fontSize: 20,
                }
          },
          color: ['#0cd3f0', '#ffd85c'],
          grid: {
            left: '1%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: {
            name: '件',
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
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            axisTick: {
                show: false,
            },
            type: 'category',
            data: yName
          },
          series: series,
        }
      }
    },
  };
</script>

<style lang="less">
    .complaint-wrap{
        .order-wrap{
            width: 100%;
            .order-chart{
                height: 800px;
            }
        }
        .percent-wrap{
            >ul{
                margin: 0;
                padding: 0;
                list-style: none;
                &.complete-wrap{

                }
                >li{
                    width: calc(20% - 100px);
                    text-align: center;
                    float: left;
                    margin: 50px;
                    .name{
                        font-size: 18px;
                        color: #333;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        width: 100%;
                        display: block;
                        text-align: center;
                        cursor: default;
                    }
                }
            }
        }
    }
</style>
