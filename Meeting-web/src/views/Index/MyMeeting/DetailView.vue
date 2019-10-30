<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="窗口查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='窗口名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='窗口号'>
                            {{viewData.windowNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='组织机构'>
                            {{viewData.organizationId === '0' ? '无' : (viewData.organizationName || '--')}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='窗口IP'>
                            {{viewData.windowIp || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='创建时间'>
                            {{viewData.createdDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='创建人'>
                            {{viewData.createdUserName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='描述'>
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
import { getDetail } from '@/remote/window';
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
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>
