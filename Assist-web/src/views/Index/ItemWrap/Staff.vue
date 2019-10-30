<template>
    <div class="staff-wrap" style="margin-bottom: 30px;">
        <h1 class="common-title">工作人员考勤管理</h1>
            <a-tree-select
                    style="width: 300px;margin-left:15px;margin-bottom: 15px;"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="orgTreeData"
                    showSearch
                    treeNodeFilterProp="title"
                    placeholder='请选择组织机构'
                    treeDefaultExpandAll
                    v-model="departmentCode"
            />
            <a-range-picker @change="changehandle2" v-model="searchTime" style="width: 300px;margin-left:30px;" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
        <a-row :gutter="64" style="margin-left: -15px;margin-right: -15px;">
            <a-col :span="6" class='item1 item'>
                <div class="item-wrap">
                    <a-progress type="circle"
                                :width="150"
                                :percent="100"
                                :strokeWidth="15"
                                :format="() => ''" />
                    <div class="num">
                        <p>迟到</p>
                        <p>{{lateCount}}人</p>
                    </div>
                </div>
            </a-col>
            <a-col :span="6" class='item1 item'>
                <div class="item-wrap">
                    <a-progress type="circle"
                                :width="150"
                                :percent="100"
                                :strokeWidth="15"
                                :format="() => ''" />
                    <div class="num">
                        <p>请假</p>
                        <p>{{leaveCount}}人</p>
                    </div>
                </div>
            </a-col>
            <a-col :span="6" class='item1 item'>
                <div class="item-wrap">
                    <a-progress type="circle"
                                :width="150"
                                :percent="100"
                                :strokeWidth="15"
                                :format="() => ''" />
                    <div class="num">
                        <p>早退</p>
                        <p>{{earlyCount}}人</p>
                    </div>
                </div>
            </a-col>
            <a-col :span="6" class='item1 item'>
                <div class="item-wrap">
                    <a-progress type="circle"
                                :width="150"
                                :percent="100"
                                :strokeWidth="15"
                                :format="() => ''" />
                    <div class="num">
                        <p>未打卡</p>
                        <p>{{notPunchCount}}人</p>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {findAttendance} from '@/remote/index';
    import {
        DatePicker,
    } from 'ant-design-vue';
    import moment from 'moment';
    import { autoDoFn, transformTree } from '@/utils/util';
    import { getOrgTree } from '@/remote/base';

    const {RangePicker} = DatePicker;

    export default {
    name: 'ManagerMent',
    components: {
        ARangePicker: RangePicker,
    },
    data() {
      return {
        departmentCode: '',
        searchTime: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        orgTreeData: [],
        "lateCount": 0,
        "leaveCount": 0,
        "earlyCount": 0,
        "notPunchCount": 0
      }
    },
    watch:{
        departmentCode(){
            this.findAttendance();
        },
    },
    methods: {
        changehandle2(){
            this.findAttendance();
        },
      async findAttendance() {
        const res = await findAttendance({
            organizationId:this.departmentCode,
            startTime: this.searchTime!=undefined&&this.searchTime.length==2?this.searchTime[0].format("YYYY-MM-DD") : '',
			endTime:this.searchTime!=undefined&&this.searchTime.length==2?this.searchTime[1].format("YYYY-MM-DD") : '',

        });
        if(res){
          this.lateCount = res.data.lateCount;
          this.leaveCount = res.data.leaveCount;
          this.earlyCount = res.data.earlyCount;
          this.notPunchCount = res.data.notPunchCount;
        }
      },

      initBaseData() {
        autoDoFn(async () => {
            const orgRes = await getOrgTree();
            if (orgRes) {
                this.orgTreeData = transformTree(orgRes.data);
            }
        });
      },
    },
    created() {
      this.findAttendance();
      this.initBaseData();
    }
  };
</script>

<style lang="less">
    .staff-wrap{
        .item{
            text-align: center;
            &:nth-child(1){
                .item-wrap{
                    background-color: #37a2da;
                }
            }

            &:nth-child(2){
                .item-wrap{
                    background-color: #de96f2;
                }
            }
            &:nth-child(3){
                .item-wrap{
                    background-color: #8378ea;
                }
            }
            &:nth-child(4){
                .item-wrap{
                    background-color: #32c5e9;
                }
            }
        }
        .item-wrap{
            position: relative;
            padding: 25px 0;
            border-radius: 10px;
            .num{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                p{
                    margin-bottom: 0;
                    line-height: 1.7;
                    font-size: 20px;
                    color: #fff;
                    font-weight: bold;
                }
            }
            .ant-progress-circle-path{
                stroke: #fff!important;
            }
        }
    }

</style>
