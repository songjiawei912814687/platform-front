<template>
    <a-drawer :visible="jobChangeVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="人员岗位变动查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='工号'>
                            {{viewData.employeeNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='姓名'>
                            {{viewData.employeesname || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='原部门'>
                            {{viewData.originalOrganizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='原职务'>
                            {{viewData.originalJobName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='现部门'>
                            {{viewData.nowOrganizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='现职位'>
                            {{viewData.nowJobName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='审核状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='调动原因'>
                            <a-tooltip placement="topLeft">
                                <template slot="title">
                                    {{viewData.description || '--'}}
                                </template>
                                {{viewData.description || '--'}}
                            </a-tooltip>
                        </a-form-item>
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
import { Row, Col, Button, Form, Drawer, Spin, Tooltip } from 'ant-design-vue';
import { getJobChangeDetail } from '@/remote/dtailView';
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
    ATooltip: Tooltip,
  },
  props: ['jobChangeVisible', 'handleClose', 'modifyId','resourceId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
      jobChangeVisible() {
      if (this.resourceId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getJobChangeDetail({ id: this.resourceId });
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
