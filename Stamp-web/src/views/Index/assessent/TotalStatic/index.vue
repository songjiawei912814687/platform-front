<template>
  <div class="content-wrap">
    <h2 class="content__title" >月度扣分汇总</h2>
    <search-box  @onSearch="handleSearch" @onReset="handleReset" style="border-bottom: 1px solid #eef1f3;margin-top:20px;margin-bottom:20px;">
      <search-box-item label="年：">
        <DatePicker type="year" v-model="searchParams.year"
                            placeholder="请选择年" style="width: 100%;"></DatePicker>
      </search-box-item>
    </search-box>
    <hr style="height:1px;border:none;border-top:1px solid #eef1f3;"/>
    <div>
        <div style="height:500px;margin-top:20px;" id='total'>
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
import {getDepartStatic,getTotalStatic} from '@/remote/departStatic';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import { autoDoFn, transformTree } from '@/utils/util';
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import moment from 'moment';
const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const {RangePicker} = DatePicker;


export default {
  name: 'Index',
  components: {
    AInput: Input,
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
      monthName: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
    ],
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
                ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisTick: {
                show: false,
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
    totalList:[],
    searchParams: {
        year: new Date(moment().subtract(1, 'months').valueOf()),
    },
    loading: false,
    authorityActionList: window.authorityActionList,
    useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.getTotalStatic();
  },
  watch: {
      totalList() {
          const data = this.totalList;
          let series = [];
        data.forEach(function (item, index) {
            series.push(
                item.total
            );
        });
          this.barPeople.series[0].data = series;
          var echarts = require('echarts/lib/echarts');
          var mychart = echarts.init(document.getElementById('total'), 'macarons');
          mychart.setOption(this.barPeople)
      },
  },
  methods: {
    getTotalStatic() {
        autoDoFn(async () => {
            const res = await getTotalStatic({year:this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',});
            if (res) {
                this.totalList = res.data;
            }
        });
    },
    handleSearch() {
      this.getTotalStatic();
    },
    handleReset() {
      this.searchParams.year= new Date(moment().subtract(1, 'months').valueOf()),
      this.$nextTick(() => {
        this.getTotalStatic();
      });
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
