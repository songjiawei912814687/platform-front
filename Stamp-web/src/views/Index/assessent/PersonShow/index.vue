<template>
  <div class="content-wrap">
    <h2 class="content__title">个人展示</h2>

    <search-box @onSearch="handleSearch" @onReset="handleReset" style="margin-top:20px;margin-bottom:20px;">
      <search-box-item  label="查询时间：" :span="2">
        <a-range-picker  v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
      </search-box-item>
      <search-box-item  label="姓名：" :span="2">
        <a-input placeholder='请选择被记录人员' style="width: 210px;margin-right: 15px" :value='selection.name' :disabled="true"></a-input>
        <a-button   type="primary" @click="staffSelect">选择</a-button>
      </search-box-item>
    </search-box>
    <hr style="height:1px;border:none;border-top:1px solid #eef1f3;"/>
    <div >
      <div style="height:500px;margin-top:20px;" id='person'>
      </div>
    </div>
    <staff-modal :membersVisible="selectStaffVisible"
      :propsSelectedRowKeys="selectedRowKeys"
      @cancel="() => this.selectStaffVisible = false"
      @ok="handleSelectStaffOk"
      type="radio">
    </staff-modal>
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
  TreeSelect,
  Drawer,
} from 'ant-design-vue';
import {getRuleStatic,getPersonStatic} from '@/remote/departStatic';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import {getLastStageOrganization} from '@/remote/base'
import { autoDoFn, transformTree, transformTree2 } from '@/utils/util';
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import moment from 'moment';
import StaffModal from '@/components/StaffModal/StaffModal';
const { Item } = Form;
const { InputSearch  } = Input;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const {RangePicker} = DatePicker;


export default {
  name: 'Index',
  components: {
    AInput: Input,
    AInputSearch: InputSearch,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATable: Table,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ADatePicker: DatePicker,
    AUpload: Upload,
    AIcon: Icon,
    ADivider: Divider,
    ADrawer: Drawer,
    APopconfirm: Popconfirm,
    ATreeSelect: TreeSelect,
    AMonthPicker: MonthPicker,
    ARangePicker: RangePicker,
    SearchBox,
    SearchBoxItem,
    VChart:ECharts,
    StaffModal,
  },
  data() {
    return {
    option : {
        title : {
            text: '',
            left: 'center',
            textStyle:{
                //文字颜色
                color:'#666666',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'normal',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
        　　　　 fontSize:24,
            },
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            type: 'scroll',
            x : 'center',
            y : 'top',
            data:[]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        grid: {
            left: 55,
            top:
                200,
        },
        series : [
            {
                name:'次数统计（个）',
                type: 'pie',
                radius: 160,
                center: ['25%', '45%'],
                label: {
                normal: {
                    formatter: function (params) {
                      if(params.name.length>5){
                        params.name = params.name.substring(0,5)+'...';
                      }
                      return '{a|'+params.seriesName+'}{abg|}\n{hr|}\n  {b|'+params.name+'：}'+params.value+' '+  '{per|'+params.percent+'%}  ';
                    },
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            }, {
                name:'分数统计（分）',
                type: 'pie',
                radius: 160,
                center: ['75%', '45%'],
                label: {
                normal: {
                    formatter: function (params) {
                      if(params.name.length>4){
                        params.name = params.name.substring(0,4)+'...';
                      }
                      return '{a|'+params.seriesName+'}{abg|}\n{hr|}\n  {b|'+params.name+'：}'+params.value+' '+  '{per|'+params.percent+'%}  ';
                    },
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            },
        ]
    },
    ruleList:[],
    selection: {},
    orgList: [],
    selectStaffVisible: false,
    selectedRowKeys: [],
    searchParams: {
        searchTime: [],
    },
    loading: false,
    authorityActionList: window.authorityActionList,
    useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.selection= {
      id: localStorage.getItem('employeeId'),
      name: localStorage.getItem('employeesName')=='undefined'?'':localStorage.getItem('employeesName'),
      organizationId: localStorage.getItem('organId'),
      organName:localStorage.getItem('organName'),
    };
    this.getRuleStatic();
  },
  watch: {
      ruleList() {
          let series = [];
          let series2 = [];
          let series3 = [];
          this.ruleList.forEach(function (item, index) {
            series.push({
                  name: item.ruleName,
                  value: item.count,
            });
            series2.push({
                  name: item.ruleName,
                  value: item.total,
            });
            series3.push(item.ruleName);
        });
          this.option.legend.data = series3;
          this.option.series[0].data = series;
          this.option.series[1].data = series2;
          var echarts = require('echarts/lib/echarts');
          var mychart = echarts.init(document.getElementById('person'), 'macarons');
          mychart.setOption(this.option)
      },
  },
  methods: {
    getRuleStatic() {
        autoDoFn(async () => {
            const res = await getRuleStatic({
                ...this.searchParams,
                startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
                employeesId:this.selection!=undefined?this.selection.id:-1,
            });
            if (res) {
                this.ruleList = res.data;
            }
        });
    },
    handleSearch() {
      this.getRuleStatic();
    },
    handleReset() {
        this.searchParams = {
            searchTime: [],
        };
        this.selection={
            name:localStorage.getItem('employeesName')=='undefined'?'':localStorage.getItem('employeesName'),
            id:localStorage.getItem('employeeId')=='undefined'?'':localStorage.getItem('employeeId'),
        }
      this.$nextTick(() => {
        this.getRuleStatic();
      });
    },
    staffSelect() {
      this.selectedRowKeys = [String(this.selection.id)];
      this.selectStaffVisible = true;
    },
  // 选择人员
    handleSelectStaffOk(selectedRowKeys, selections) {
      if(selections[0]!==undefined){
        this.selection = selections[0];
      }
      
      this.selectStaffVisible = false;
    },
  },
 
};
</script>

<style lang="less">
.gkp-search-box {
  overflow: visible !important;
}

.monthPicker .ivu-date-picker-header {
  display: none !important;
}
.echarts {
  width: 100%;
}
.gkp-search-box {
    border-bottom: 0px solid rgb(238, 241, 243) !important;
}
</style>
