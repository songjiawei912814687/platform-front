<template>
    <a-drawer :visible="newRuleDetailVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="考勤规则查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='规则名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='规则值'>
                            {{viewData.value || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='是否启用'>
                            {{viewData.state === '0' ? '停用' : '启用'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='最后修改时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">描述</p>
                        <p class="des-content">
                            {{viewData.description || '--'}}
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
import { Row, Col, Button, Form, Drawer, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/attendanceRuleNew';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;

export default {
  name: 'NewRuleDetailView',
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
  props: ['newRuleViewVisible','newRuleDetailVisible', 'handleClose','modifyId' ],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
      newRuleDetailVisible() {
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
