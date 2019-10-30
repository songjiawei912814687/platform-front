<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="考核规则查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='规则名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='规则类型'>
                            {{viewData.ruleTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='扣分方式'>
                            {{viewData.deductionTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='固定分值' v-if="viewData.deductionType===1">
                            {{viewData.score || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='扣分下限' v-if="viewData.deductionType===2">
                            {{viewData.minLimit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='扣分上限' v-if="viewData.deductionType===2">
                            {{viewData.maxLimit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">规则描述</p>
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
import { getDetail } from '@/remote/rule';
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
          if (res.success) {
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
