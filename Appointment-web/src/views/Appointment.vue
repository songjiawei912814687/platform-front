<template>
  <div class="appointment-wrap">
    <div class="middle" :style="backgroundDiv">
      <img src="../assets/topImg.png"  style="width: 100%"/>
    </div>
    <van-cell title="预约部门"
              required
              @click="deptListVisible = true"
              :value="formData.groupName" is-link/>

    <!--<van-cell title="业务名称"-->
    <!--required-->
    <!--@click="groupListVisible = true"-->
    <!--:value="formData.groupName" is-link/>-->
    <van-cell
      v-model="formData.appointDateValue"
      @click="handleDateListShow"
      title="预约日期"
      max-width="90px"
      placeholder="请选择预约日期"
      required
      :disabled="!formData.deptCode"
      :error-message="!formData.appointDateValue?'请选择正确的预约日期' : '' "/>

    <!--<h3 style="padding-left: 14px">可预约时间：</h3>
    <van-cell-group v-if="timeList.length">
        <van-cell :title="item.beginTime + ' - ' + item.endTime"
                  :key="item.id"
                  :value="`${item.availableEnqueueQuantity} / ${item.maxEnqueueQuantity}`"
                  :disabled="true"
                  v-for="item in timeList"/>
    </van-cell-group>
    <div v-else style="color: #666; text-align: center;padding-bottom: 15px;border-bottom: 1px solid #eee">
        暂无可预约的时间
    </div>-->

    <h3 style="padding-left: 14px">可预约时间：</h3>
    <van-cell-group v-if="timeList.length">
      <van-cell :title="item.beginTime + ' - ' + item.endTime"
                :key="item.id"
                :disabled="true"
                style="color: red"
                v-for="item in timeList"/>
    </van-cell-group>
    <div v-else style="color: #666; text-align: center;padding-bottom: 15px;border-bottom: 1px solid #eee">
      暂无可预约的时间
    </div>
    <van-cell
      class="cell"
      v-model="dataVale"
      @click="handleTimeListShow"
      title="预约时间"
      placeholder="请选择预约时间"
      required
      :disabled="!formData.appointDateValue"
      :error-message="!formData.appointTimeValue?'' : ''"
    />
    <van-field
      v-model="formData.code"
      label="身份证号"
      placeholder="请输入您的身份证号"
      required
      :error-message="codeMessageVisible?'' : '请输入合法身份证号码' "
    />

    <van-field
      v-model="formData.mobile"
      type="number"
      label="手机号码"
      placeholder="请输入您的手机号码"
      :error-message="mobileMessageVisible?'' : '请输入合法手机号码' "
      required
    />
    <van-field
      v-model="formData.name"
      label="姓名"
      placeholder="请输入您的姓名"
      required
      :error-message="!formData.name?'' : '' "
    />
    <van-checkbox v-model="checked" checked-color="#07c160"  style="padding: 20px 36px 0px;">提醒：预约取号请带好身份证，预约请在可预约时间段内完成取号。</van-checkbox>
    <van-button class="submit-btn" :loading="loading" @click="appointment" :disabled="!checked">确定预约</van-button>

    <!--部门-->
    <van-popup v-model="deptListVisible" position="right">
      <van-cell-group v-if="deptList.length">
        <van-cell :title="item.name"
                  :key="item.code"
                  v-for="item in deptList"
                  @click="handleGroupListShow(item)"
                  is-link/>
      </van-cell-group>
      <div v-else style="color: #666; padding-top: 150px; text-align: center">
        暂无数据
      </div>
    </van-popup>
    <!--业务-->
    <van-popup v-model="groupListVisible" position="right">
      <van-cell-group>
        <van-cell title="返回上一级" @click="handleBackDeptsList"/>
      </van-cell-group>
      <van-cell-group v-if="groupList.length">
        <van-cell :title="item.name"
                  :key="item.code"
                  @click="selectGroup(item)"
                  v-for="item in groupList"/>
      </van-cell-group>
      <div v-else style="color: #666; padding-top: 150px; text-align: center">
        暂无数据
      </div>
    </van-popup>
    <!--日期-->
    <van-popup v-model="dateListVisible" position="bottom">
      <van-cell-group v-if="dateList.length">
        <van-cell :title="item.date"
                  :key="item.date"
                  @click="selectDate(item)"
                  v-for="item in dateList"/>
      </van-cell-group>
      <div v-else style="color: #666; padding-top: 150px; text-align: center">
        暂无数据
      </div>
    </van-popup>
    <!--时间-->
    <van-popup v-model="timeListVisible" position="bottom">

      <van-picker
        show-toolbar
        :columns="columns"
        :default-index="0"
        :value="formData.appointTimeValue"
        type="time"
        @confirm="selectTime"
        @cancel="timeListVisible = false"
      />
    </van-popup>
    <div style="position: fixed;bottom: 0px;width: 100%;text-align: center;">
      <van-button class="button-btn" :loading="loading"  style="color: #1996c6;">预约排队</van-button>
      <van-button class="button-btn" :loading="loading" @click="callback">我的预约</van-button>
    </div>
  </div>

</template>

<script>
  // import imgUrl from "../assets/topImg.png"
  import {
    getDepts, getBookableGroups, getBookableDateByDept,
    appointment, getAppointmentSummary,
  } from '@/remote/appointment';
  import { autoDoFn } from '@/utils/util';
  // import data from '@/assets/data.json';

  export default {
    name: 'Appointment',
    data() {
      return {
        checked: false,
        backgroundDiv: {
          backgroundImage: 'url(' + require('../assets/topImg.png') + ')'
        },
        minDate: new Date(),
        dateVisible: false,
        deptListVisible: false,
        groupListVisible: false,
        dateListVisible: false,
        timeListVisible: false,
        formData: {},
        deptList: [],
        groupList: [],
        dateList: [],
        timeList: [],
        codeMessageVisible: true,
        mobileMessageVisible: true,
        loading: false,
        columns: ['上午', '下午'],
        dataVale:"上午",
      };
    },
    created() {
      // this.getBookableGroups();
      this.getDepts();
    },
    watch: {
      'formData.mobile'(val) {
        const reg = /^1\d{10}$/;
        this.mobileMessageVisible = reg.test(val);
      },
      'formData.code'(val) {
        const reg =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        this.codeMessageVisible = reg.test(val);
      },
    },
    methods: {
      callback () {
        this.$router.push('list')
      },
      getDepts() {
        autoDoFn(async () => {
          const res = await getDepts();
          if (res) {
            this.deptList = res.data || [];
          }
        });
      },
      getBookableGroups(dept) {
        autoDoFn(async () => {
          const res = await getBookableGroups({deptCode : dept.code});
          if (res) {
            this.groupList = res.data || [];
          }
        });
      },
      getBookableDateByDept() {
        autoDoFn(async () => {
          const res = await getBookableDateByDept({deptCode: this.formData.deptCode});
          if (res) {
            this.dateList = res.data || [];
          }
        });
      },
      getAppointmentSummary() {
        autoDoFn(async () => {
          const res = await getAppointmentSummary({
            deptCode: this.formData.deptCode,
            groupCode: this.formData.groupCode,
            appointDateTime: this.formData.appointDateValue,
          });
          if (res) {
            this.timeList = res.data || [];
          }
        });
      },
      appointment() {
        if (!this.mobileMessageVisible || !this.codeMessageVisible) {
          return false;
        }
        if (!this.formData.mobile) {
          this.mobileMessageVisible = true;
          return false;
        }
        if (!this.formData.code) {
          this.codeMessageVisible = true;
          return false;
        }
        console.log("this.dataVale:"+!this.dataVale)


        if (!this.formData.groupCode
          || !this.formData.appointDateValue
          || !this.dataVale
          || !this.formData.name) {
          return false;
        }

        this.formData.appointTimeValue = this.dataVale==='上午'?'10:00':'14:30';
        autoDoFn(async () => {
          this.loading = true;
          const res = await appointment({
            ...this.formData,
            appointDateTime: this.formData.appointDateValue + ' ' + this.formData.appointTimeValue + ':00',
          });
          if (res) {
            this.$notify({
              message: '预约成功！',
              background: '#00ff00',
            });
            this.formData = {};
            this.deptList = [];
            this.groupList = [];
            this.dateList = [];
            this.timeList = [];
            this.codeMessageVisible =  true;
            this.mobileMessageVisible = true;
          }
          this.loading = false;
        });
      },
      handleGroupListShow(item) {
        this.groupListVisible = true;
        this.getBookableGroups(item);
      },
      handleBackDeptsList() {
        this.groupListVisible = false;
      },
      handleDateListShow() {
        this.dateListVisible = true;
        this.getBookableDateByDept();
      },
      handleTimeListShow() {
        this.timeListVisible = true;
      },
      selectGroup(group) {
        this.formData.deptCode = group.deptCode;
        this.formData.groupName = group.name;
        this.formData.groupCode = group.code;
        this.groupListVisible = false;
        this.deptListVisible = false;
        this.formData.appointDateValue = '';
        this.timeList = [];
      },
      selectDate(date) {
        this.formData.appointDateValue = date.date;
        this.getAppointmentSummary();
        this.dateListVisible = false;
      },
      selectTime( value, index) {
        console.log(value);
        this.formData.appointTimeValue = value==='上午'?'10:00':'14:30';
        this.dataVale= this.formData.appointTimeValue==='10:00'?'上午':'下午',
          console.log("-------"+this.formData.appointTimeValue)
        this.timeListVisible = false;
      },
    },
  };
</script>

<style lang="less">
  .middle {
    width: 100%;
    background: no-repeat center top;
    background-size: contain;
  }
  .cell
  {
    .van-cell__value
    {
      color: #969799;
      overflow: hidden;
      text-align: left;
      position: relative;
      vertical-align: middle;
    }
    .van-cell__title
    {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      max-width: 90px;
    }

  }
  .appointment-wrap {
    position: relative;
    .date-wrap {
      position: absolute;
    }
    .van-popup--right {
      width: 80%;
      height: 100%;
    }
    .van-popup--bottom {
      width: 100%;
      height: 40%;
    }
    .submit-btn {
      border: none;
      height: 40px;
      line-height: 40px;
      display: block;
      width: 80%;
      margin: 50px auto;
      color: #fff;
      border-radius: 5px;
      outline: none;
      background-color: #5bc0de;
      font-size: 16px;
      &:active {
        background-color: #12a2de;
      }
    }
    .button-btn {
      color: #9b9b9b;
      outline: none;
      font-size: 16px;
      width: 50%;
      background-color: #f7f7f7;
      border-radius: 0;
    }
    .van-checkbox__label{
      color: #ff0000;
      margin-left: 10px;
      position: absolute;
      padding-right: 36px;
    }
  }
</style>
