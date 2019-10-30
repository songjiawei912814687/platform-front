<template>
    <a-drawer :visible="viewVisible1"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              class-name="detailViewWrap"
              title="材料清单查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='材料名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='材料详细要求'>
                            {{viewData.requestDetail || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='材料形式'>
                            {{viewData.materialFormName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='必要性及描述'>
                            {{viewData.necessarilyDescription || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='材料出具单位'>
                            {{viewData.meteriaOrganization || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">备注</p>
                        <p class="des-content">
                            {{viewData.remark || '--'}}
                        </p>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='示例表'>
                            <a v-for="file in viewData.exampleAttachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='空白表'>
                            <a v-for="file in viewData.blankAttachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
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
import { autoDoFn } from '@/utils/util';
import { getDetail } from '@/remote/materials';

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
  props: ['viewVisible1', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
    viewVisible1() {
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
<style lang="less">
    .detailViewWrap{
            z-index: 1200;
    }

</style>
