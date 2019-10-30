<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="请假申请查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='所属机构'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='人员'>
                            {{viewData.employeesName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='类型'>
                            {{applicationTypeArr[viewData.applicationType]}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='开始时间'>
                            {{viewData.startDate + ' ' + viewData.startTime}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='结束时间'>
                            {{viewData.endDate + ' ' + viewData.endTime}}
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="24">
                        <a-form-item label='请假时长'>
                            {{viewData.duration}}天
                        </a-form-item>
                    </a-col>-->
                    <a-col :span="24">
                        <a-form-item label='最后修改时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 20px">
                        <p class="des-label">请假原因</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">附件</p>
                        <div class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <p v-for="file in viewData.attachmentList" :key="file.url">
                                <a :href="file.url" target="_blank">{{file.fileName}}</a>
                            </p>
                        </div>
                        <div class="des-content" v-else>--</div>
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
import { Row, Col, Button, Form, Drawer, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/leaveApply';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;

export default {
  name: 'DetailView',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelectOption: Option,
    ADrawer: Drawer,
    ASpin: Spin,
  },
  props: ['viewVisible', 'handleClose', 'modifyId', 'applicationTypeArr'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId && this.viewVisible) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            this.viewData = {
              ...res.data,
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>

<style lang="less">

</style>
