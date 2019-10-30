<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="投诉建议查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='来源'>
                            {{viewData.dateResourceName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='群众姓名'>
                            {{viewData.suggestionName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='群众电话'>
                            {{viewData.suggestionPhoneNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='投诉时间'>
                            {{viewData.createdDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='被投诉部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='被投诉窗口'>
                            {{viewData.windowName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='被投诉工号'>
                            {{viewData.employeeNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='被投诉人员'>
                            {{viewData.employeeName || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                    <a-form-item label='满意情况'>
                        <p v-if="viewData.satisfactionName === '0'">{{'满意' || '--'}}</p>
                        <p v-if="viewData.satisfactionName === '1'">{{'不满意' || '--'}}</p>
                    </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='实现情况'>
                            <!--{{viewData.completeRateName || '&#45;&#45;'}}-->
                            <p v-if="viewData.completeRateName === '1'">{{'跑一次' || '--'}}</p>
                            <p v-if="viewData.completeRateName === '2'">{{'跑多次' || '--'}}</p>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='发布时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='发布状态'>
                            {{viewData.publishName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='处理状态'>
                            {{viewData.dealStateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='有效状态'>
                            {{viewData.isUseName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 20px;">
                        <p class="des-label">投诉内容</p>
                        <p class="des-content">{{viewData.suggesstionDescription || '--'}}</p>
                    </a-col>

                    <template v-if="viewData.dealState">
                        <a-col :span="12">
                            <a-form-item label='处理时间'>
                                {{viewData.dealTime || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="24" style="margin-bottom: 20px;">
                            <p class="des-label">处理结果</p>
                            <p class="des-content">{{viewData.dealResult || '--'}}</p>
                        </a-col>
                    </template>
                    <a-col :span="24">
                        <p class="des-label">附件</p>
                        <p class="des-content">
                            <a v-for="file in viewData.attachmentList" :key="file.id" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </p>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
  import {Row, Col, Button, Form, Drawer, Spin, Tooltip} from "ant-design-vue";
  import {getDetail, getDealResult} from '@/remote/advice';
  import {autoDoFn} from "@/utils/util";

  const {Item} = Form;

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
      ATooltip: Tooltip
    },
    props: ["viewVisible", "handleClose", "modifyId"],
    data() {
      return {
        viewData: {},
        viewLoading: false,
        satisfactionName: '',
        completeRateName: '',
      };
    },
    watch: {
      viewVisible() {
        if (this.viewVisible && this.modifyId) {
          autoDoFn(async () => {
            let viewData = {};
            this.viewLoading = true;
            const res = await getDetail({id: this.modifyId});
            if (res.success) {
              viewData = {
                ...viewData,
                ...res.data,
                suggesstionDescription: res.data.content
              };
              if(res.data.suggesstionList){
                if(Object.prototype.toString.call(res.data.suggesstionList) === "[object Array]"){
                  viewData.suggesstionDescription = res.data.suggesstionList.join('<br/>');
                }else{
                  viewData.suggesstionDescription = res.data.suggesstionList;
                }
              }
            }
            this.viewData = viewData;
            this.viewLoading = false;
          });
        }
      },

    },

    methods: {}
  };
</script>
