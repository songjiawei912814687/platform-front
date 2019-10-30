<template>
  <div class="content-wrap">
    <h2 class="content__title">部门月度扣分趋势</h2>

    <search-box @onSearch="handleSearch" @onReset="handleReset" style="border-bottom: 1px solid #eef1f3;margin-top:20px;margin-bottom:20px;">
      <search-box-item label="年："  >
        <DatePicker type="year" v-model="searchParams.year"
                            placeholder="请选择年" style="width: 100%;"></DatePicker>
      </search-box-item>
    </search-box>
    <hr style="height:1px;border:none;border-top:1px solid #eef1f3;"/>
    <div >
      <div style="height:500px;margin-top:20px;" id='depart'>
        <!-- <v-chart :options="linePolar"/> -->
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
    linePolar: {
        legend: {
            data: [],
            orient: 'vertical',
            type: 'scroll',
            right: 40,
            top: 50,
            bottom: 20,
        },
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
        tooltip: {},
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
            right:
                250,
            bottom:
                40,
        },
        series: [],
    },
    departList:[],
    searchParams: {
        year: new Date(moment().subtract(1, 'months').valueOf()),
    },
    loading: false,
    authorityActionList: window.authorityActionList,
    useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.getDepartStatic();
  },
  watch: {
      departList() {
          const data = _.groupBy(this.departList, 'name');
          let series = [];
          for (let key in data) {
              series.push({
                  label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                  name: key,
                  type: 'line',
                  data: data[key].map(item => item.total),
              });
              this.linePolar.legend.data.push(key)
          }
          this.linePolar.series = series;
          var echarts = require('echarts/lib/echarts');
          var mychart = echarts.init(document.getElementById('depart'), 'macarons');
          mychart.setOption(this.linePolar)
      },
  },
  methods: {
    getDepartStatic() {
        autoDoFn(async () => {
            const res = await getDepartStatic({year:this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',});
            if (res) {
                this.departList = res.data;
            }
        });
    },
    handleSearch() {
      this.getDepartStatic();
    },
    handleReset() {
      this.searchParams.year= new Date(moment().subtract(1, 'months').valueOf()),
      this.$nextTick(() => {
        this.getDepartStatic();
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
</style>
