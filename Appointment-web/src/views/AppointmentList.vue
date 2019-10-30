<template>
    <div class="list-wrap">
      <div class="middle" :style="backgroundDiv">
        <img src="../assets/topImg.png"  style="width: 100%"/>
      </div>
        <div>
            <van-field
                    v-model="formData.code"
                    label="身份证号"
                    placeholder="请输入您的身份证号"
                    required
                    :error-message="codeMessageVisible?'' : '请输入合法身份证号码' "
            />
            <van-field
                    v-model="formData.phone"
                    type="number"
                    label="手机号码"
                    placeholder="请输入您的手机号码"
                    :error-message="mobileMessageVisible?'' : '请输入合法手机号码' "
                    required
            />
            <van-button class="submit-btn" :loading="loading" @click="getAppointmentList">查询预约结果</van-button>
        </div>
        <van-popup v-model="visible" position="right">
            <div class="loading-wrap" v-if="loading">
                <van-loading />
            </div>
            <van-collapse v-if="dataList.length" v-model="activeNames">
                <van-collapse-item :title="'预约人：' + item.name"
                                   :key="item.id"
                                   v-for="item in dataList"
                                   :name="item.id">
                    <p>预约时间: {{item.appointDateTime}}</p>
                    <p>预约业务: {{item.groupName}}</p>
                    <p>取消时间: {{item.lastUpdateDateTime}}</p>
                    <p>预约状态: {{item.appointmentName}}</p>
                    <van-button class="cancel-btn"
                                :loading="submitLoading"
                                type="danger"
                                @click="cancelAppointment(item)">取消预约</van-button>
                </van-collapse-item>
            </van-collapse>
            <div v-else style="color: #666; padding-top: 150px; text-align: center">
                暂无数据
            </div>
        </van-popup>
        <div style="position: fixed;bottom: 0px;width: 100%;text-align: center;">
          <van-button class="button-btn" :loading="loading" @click="callback" >预约排队</van-button>
          <van-button class="button-btn" :loading="loading" style="color: #1996c6;" >我的预约</van-button>
        </div>
    </div>
</template>

<script>
  import {
    getAppointmentList, cancelAppointment
  } from '@/remote/appointment';
  import { autoDoFn } from '@/utils/util';
  import data from '@/assets/data.json';

  export default {
    name: 'AppointmentList',
    data() {
      return {
        backgroundDiv: {
          backgroundImage: 'url(' + require('../assets/topImg.png') + ')'
        },
        visible: false,
        dataList: [],
        mobileMessageVisible: true,
        codeMessageVisible: true,
        formData: {},
        loading: false,
        submitLoading: false,
        activeNames: [],
      }
    },
    watch: {
      'formData.phone'(val) {
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
          this.$router.push('appointment')
      },
      handleDetailShow(item) {
        this.$router.push({path: '/detail', params: {id: item.id}})
      },
      getAppointmentList() {
        if(!this.mobileMessageVisible || !this.codeMessageVisible){
          return false;
        }
        autoDoFn(async () => {
          this.loading = true;
          const res = await getAppointmentList(this.formData);
          this.visible = true;
          if(res){
              this.dataList = res.data;
          }
          this.loading = false;
        })
      },
      cancelAppointment(item) {
        autoDoFn(async () => {
          this.submitLoading = true;
          const res = await cancelAppointment({
            id: item.id,
          });
          if(res){
            this.$notify({
              message: '取消预约成功！',
              background: '#00ff00',
            });
            this.getAppointmentList();
          }
          this.submitLoading = false;
        })
      },
    }
  };
</script>

<style lang="less">
  .middle {
    width: 100%;
    background: no-repeat center top;
    background-size: contain;
  }
    .list-wrap{
        .van-popup--right {
            width: 70%;
            height: 100%;
            .loading-wrap{
                width: 100%;
                height: 100%;
                text-align: center;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 9;
                background-color: rgba(255,255,255, .8);
                .van-loading{
                    margin-top: 150px;
                    margin-left: auto;
                    margin-right: auto;
                }
            }
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
        .cancel-btn{
            font-size: 16px;
            display: block;
            width: 80%;
            margin: 0 auto;
        }
        .button-btn {
            color: #9b9b9b;
            outline: none;
            font-size: 16px;
            width: 50%;
            background-color: #f7f7f7;
            border-radius: 0;
        }
    }
</style>
