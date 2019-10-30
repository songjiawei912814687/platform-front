<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="考核申诉查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                    <a-col :span="12">
                        <a-form-item label='所属部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='被考核人'>
                            {{viewData.employeesName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='申诉日期'>
                            {{viewData.createdDateTime || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='申诉原因'>
                            {{viewData.description|| '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">附件</p>
                        <p class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <a v-for="file in viewData.attachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </p>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='审批意见'>
                            {{viewData.suggesstion|| '--'}}
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
import { Row, Col, Button, Form, Drawer, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/complain';
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
  props: ['viewVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            this.viewData = {
              ...res.data,
              state: String(res.data.state),
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
