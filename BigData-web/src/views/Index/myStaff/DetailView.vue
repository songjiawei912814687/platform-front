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
                            <b>[{{viewData.typeName === undefined || viewData.typeName === '' ? '其他' : viewData.typeName}}] </b>
                            {{viewData.title || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item  label='新闻详情' >
                            <quill-editor
                                    :disabled=true
                                    style="heigh: auto"
                                    v-model="content"
                                    ref="myQuillEditor"
                                    :options="editorOption"
                            ></quill-editor>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-top: 60px">
                        <a-form-item label='发布人'>
                            {{viewData.empName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='发布时间'>
                            {{viewData.createdDateTime || '--'}}
                        </a-form-item>
                    </a-col>

                </a-row>
            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
  import { Row, Col, Button, Form, Modal, Spin } from 'ant-design-vue';
  import { getDetail } from '@/remote/staff';
  import { autoDoFn } from '@/utils/util';
  import { quillEditor } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

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
      quillEditor
    },
    props: ['viewVisible', 'handleClose', 'modifyId'],
    data() {
      return {
        viewData: {},
        viewLoading: false,
        content: null,
        editorOption: {
          modules: {
            toolbar: false
          },
          readOnly: true
        }
      };
    },
    watch: {
      viewVisible() {
        if (this.modifyId) {
          autoDoFn(async () => {
            this.viewLoading = true;
            const res = await getDetail({ id: this.modifyId });
            if (res) {
              console.log(res.data);
              this.content = res.data.context;
              console.log(this.content);
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
