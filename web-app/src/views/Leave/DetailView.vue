<template>
  <div>
    <a-spin tip="正在加载中..." :spinning="viewLoading">
      <div class="_detail-title">
        <a @click="returnBack">
          <a-icon type="left" />返回
        </a>
        <h1>请假详情</h1>
      </div>
      <a-form layout="vertical" class="detail-view" style="margin-top:70px ">
        <a-row :gutter="24" style="padding-top: 50px;margin:0;font-size: 16px">
          <a-col :span="12" style="width:30%">
            <span class="des-label">人员：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.employeesName || '--'}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">所属组织：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.organizationName || '--'}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">替岗人员：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.replacePerson || '--'}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">类型：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.applicationTypeName || '--'}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">开始时间：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.startDate + ' ' + viewData.startTime}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">结束时间：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.endDate + ' ' + viewData.endTime}}</span>
          </a-col>
          <a-col :span="12" style="width:30%">
            <span class="des-label">请假原因：</span>
          </a-col>
          <a-col :span="12" style="margin-bottom: 40px;">
            <span class="des-content">{{viewData.description || '--'}}</span>
          </a-col>
          <!--<a-col :span="12" style="width:30%">-->
            <!--<span class="des-label">附件：</span>-->
          <!--</a-col>-->
          <!--<a-col :span="12" style="margin-bottom: 40px;">-->
            <!--<div-->
              <!--class="des-content"-->
              <!--v-if="viewData.attachmentList && viewData.attachmentList.length"-->
            <!--&gt;-->
              <!--<p v-for="file in viewData.attachmentList" :key="file.url">-->
                <!--<a :href="file.url" target="_blank">{{file.fileName}}</a>-->
              <!--</p>-->
            <!--</div>-->
            <!--<div class="des-content" v-else>&#45;&#45;</div>-->
          <!--</a-col>-->
          <!--<a-col :span="24">
                        <a-form-item label='请假时长'>
                            {{viewData.duration}}天
                        </a-form-item>
          </a-col>-->
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { Row, Col, Button, Form, Drawer, Spin, Icon } from "ant-design-vue";
import { getDetail } from "@/remote/leave";
import { autoDoFn } from "@/utils/util";

const { Item } = Form;
const applicationTypeArr = [
  "",
  "临时外出二小时公事",
  "哺乳假",
  "",
  "产假",
  "年休假",
  "因公外出",
  "事假",
  "病假",
  "",
  "临时外出二小时私事",
  "婚假",
  "探亲假",
  "陪产假",
  "丧假"
];
export default {
  name: "DetailView",
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelectOption: Option,
    ADrawer: Drawer,
    ASpin: Spin,
    AIcon: Icon
  },
  data() {
    return {
      viewData: {},
      viewLoading: false,
      applicationTypeArr
    };
  },
  created() {
    this.viewVisible();
  },
  methods: {
    viewVisible() {
      console.log(this.$route.query.rowData);
      this.viewLoading = true;
      this.viewData = {
        ...this.$route.query.rowData
      };
      this.viewLoading = false;
      // if (this.$route.query.modifyId ) {
      //     autoDoFn(async () => {
      //         this.viewLoading = true;
      //         const res = await getDetail({ id: this.$route.query.modifyId });
      //         if (res) {
      //             this.viewData = {
      //                 ...res.data,
      //             };
      //         }
      //         this.viewLoading = false;
      //     });
      // }
    },
    returnBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less">
._detail-title {
  line-height: 70px;
  height: 70px;
  font-size: 16px;
  padding: 0 10px;
  text-align: center;
  position: fixed;
  background-color: #fff;
  width: 100%;
  z-index: 999;
  a {
    display: block;
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 16px;
  }
  h1 {
    font-size: 28px;
    color: #777;
    overflow: hidden;
    padding: 0 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
