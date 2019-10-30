<template>
  <div class="content-wrap">
    <h2 class="content__title">部门详情</h2>
    <search-box  @onSearch="handleSearch" @onReset="handleReset" style="border-bottom: 1px solid #eef1f3;margin-top:20px;margin-bottom:20px;">
      <search-box-item  label="查询时间：" :span="2">
        <a-range-picker  v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
      </search-box-item>
      <search-box-item label="组织名称：">
            <a-select placeholder='请选择考核部门'  style="width:100%" showSearch
                                      :filterOption="filterOption" v-model='searchParams.organizationId'>
                <a-select-option v-for="item in orgList" :value='String(item.id)' :key="String(item.id)">
                  {{item.name}}
                </a-select-option>
            </a-select>
        </search-box-item>
    </search-box>
    <hr style="height:1px;border:none;border-top:1px solid #eef1f3;"/>
    <div>
        <div style="height:500px;margin-top:20px;" id='depart'>
        </div>
    </div>
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
import {getPersonStatic} from '@/remote/departStatic';
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
  },
  data() {
    return {
    
    barPeople: {
        color: ['#0cd3f0'],
        title: {
            text: '',
            left: 'center',
            top:10,
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
        // legend: {},
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
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
        xAxis: {
            type: 'category',
            data:
                [],
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
        grid: {
            left: 55,
            right:20,
            bottom:40,
        },
        series: [ {
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            type:'bar',
            barWidth: '60%',
            data:[]
        }],
    },
    personList:[],
    orgList: [],
    selectedRowKeys: [],
    selection: {},
    searchParams: {
        searchTime: [],
        organizationId: localStorage.getItem('organId')=='undefined'?'':localStorage.getItem('organId'),
    },
    loading: false,
    authorityActionList: window.authorityActionList,
    useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.getDepartStatic();
    this.initOrganData();
  },
  watch: {
      personList() {
          const data = this.personList;
          let series = [];
          let series3 = [];
        data.forEach(function (item, index) {
            series.push(
                item.total
            );
            series3.push(item.name);
        });
          this.barPeople.series[0].data = series;
          this.barPeople.xAxis.data = series3;
          var echarts = require('echarts/lib/echarts');
          var mychart = echarts.init(document.getElementById('depart'), 'macarons');
          mychart.setOption(this.barPeople)
      },
  },
  methods: {
    getDepartStatic() {
        autoDoFn(async () => {
            const res = await getPersonStatic({
                ...this.searchParams,
                startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
            });
            console.log(res)
            if (res) {
                this.personList = res.data;
            }
        });
    },
    handleSearch() {
      this.getDepartStatic();
    },
    handleReset() {
        this.searchParams = {
            organizationId: localStorage.getItem('organId')=='undefined'?'':localStorage.getItem('organId'),
            name:'',
            searchTime: [],
        };
      this.$nextTick(() => {
        this.getDepartStatic();
      });
    },
    initOrganData() {
        autoDoFn(async () => {
            const result = await getLastStageOrganization();
            if (result) {
                this.orgList = result.data;
            }
            result.data.forEach(
              
            )

        });
    },
    filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
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
