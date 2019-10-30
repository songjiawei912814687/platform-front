<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="考核规则查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='模板名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='业务类型'>
                            {{viewData.typeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="24">
                        <a-form-item label='业务参数'>
                            {{viewData.name || '&#45;&#45;'}}
                        </a-form-item>
                    </a-col>-->

                    <a-col :span="24">
                        <p class="des-label">模板内容</p>
                        <p class="des-content">
                            {{viewData.description || '--'}}
                        </p>
                    </a-col>

                    <a-col :span="24">
                        <p class="des-label">是否回复</p>
                        <p class="des-content">
                            {{viewData.isReplyName || '--'}}
                        </p>
                    </a-col>

                    <a-col :span="24">
                        <p class="des-label">回复有效时间</p>
                        <p class="des-content">
                            {{viewData.replyLimit === undefined ? '' : viewData.replyLimit+'个工作日' || '--'}}
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
import { autoDoFn } from '@/utils/util';
import { getDetail } from '@/remote/stencil';

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
