<template>

    <a-spin tip="正在加载中..." :spinning="viewLoading">
        <a-button @click="toList" style="margin: 10px;"><<返回下载主页 </a-button>

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
                            <li><a :href="item.url">{{item.fileName}}</a></li>
                        </ui>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-spin>

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
    data() {
      return {
        id: this.$route.query.id,
        viewData: {},
        viewLoading: false,
      };
    },
    created() {
      this.initDetaiView();
    },
    methods: {
      initDetaiView() {
        if (this.id) {
          autoDoFn(async () => {
            this.viewLoading = true;
            const res = await getDetail({ id: this.id });
            if (res) {
              this.viewData = {
                ...res.data,

              };
            }
            this.viewLoading = false;
          });
        }
      },
      toList() {
        debugger
        this.$router.push({
          path: 'download',
          name: 'download',
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },
    }
  };
</script>
