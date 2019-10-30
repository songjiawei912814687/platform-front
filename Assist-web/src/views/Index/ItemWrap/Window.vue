<template>
    <div class="window-wrap">
        <h1 class="common-title">窗口服务管理</h1>
        <h3 class="common-subtitle">业务量</h3>
        <div class="thing-wrap clearfix">
            <!--图表-->
            <div class="thing-chart">
                <v-chart v-if="init" ref="charts" :options="optition"/>
            </div>
        </div>
        <hr style="height:1px;border:none;border-top:1px solid #eef1f3;">
        <h3 class="common-subtitle">办件量</h3>
        <div class="do-wrap clearfix">
            <!--图表-->
            <div class="do-chart" >
                <v-chart v-if="init" ref="charts" :options="linePolar"/>
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
    business, windowDo, doCount
  } from '@/remote/index';

  export default {
    name: 'Window',
    data() {
      return {
        departmentCode: '1',
        init: false,
        optition:{},
        linePolar: {
            legend: {
                  data: [],
                  left:
                      'center',
                  textStyle:
                      {
                          fontSize: 20,
                      }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: [],
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    fontSize: 12,
                },
            },
            yAxis: {
                name: '件',
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
              left: '1%',
              right: '2%',
              bottom: '5%',
              containLabel: true
            },
            series: [],
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init = true;
      })
    },
    created() {
      this.windowDo();
      this.doCount();
    },
    methods: {
      async windowDo() {
        const res = await windowDo();
        if(res) {
          this.optition= this.barEvent(res.data);
        }
      },
      async doCount() {
        const res = await doCount();
        if(res) {
          res.data.forEach(element => {
            if(this.linePolar.xAxis.data.indexOf(element.yearAndMonth)==-1){
              this.linePolar.xAxis.data.push(element.yearAndMonth);
            }
          });
          const data = _.groupBy(res.data, 'organizationName');
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
                  data: data[key].map(item => item.totalAmount),
              });
              this.linePolar.legend.data.push(key)
          }
          this.linePolar.series = series;
        }
      },
      barEvent(data) {
        return {
          color: ['#0cd3f0'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          xAxis :{
              type : 'category',
              data : data.map(item => item.date),
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
              data:data.map(item => item.doCount),
            }
          ]
        }
      },
    },
  };
</script>

<style lang="less">
    .window-wrap{
        .thing-wrap{
            height: 500px;
            .thing-chart{
                height: 100%;
            }
        }
        .do-wrap{
            height: 500px;
            .do-chart{
                height: 100%;
            }
        }
    }
</style>
