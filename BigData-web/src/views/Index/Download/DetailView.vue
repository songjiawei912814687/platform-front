<template>
    <a-modal :visible="viewVisible"
             @cancel="handleCancel"
             :width="1200"
             :footer="null"
              title="详情">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='标题'>
                            {{viewData.title || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='描述'>
                            {{viewData.discription || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24 ">
                        <a-form-item label='附件'>
                            <ui v-for="item in viewData.attachmentOuputList">
                                <li><a :href="item.url" >{{item.fileName}}</a></li>
                            </ui>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
import { Row, Col, Button, Form, Modal, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/download';
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
    AModal: Modal,
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

            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
    methods: {
        handleCancel() {
            this.$emit('cancel');
        },
    }
};
</script>
