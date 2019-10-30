<template>
    <a-spin tip="正在加载中..." :spinning="viewLoading">
        <a-button @click="toList" style="margin: 10px;"><<返回新闻主页</a-button>

        <a-form layout="vertical" class="detail-view">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label='标题'>
                        {{viewData.title || '--'}}
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label='新闻详情'>
                        <quill-editor
                                :disabled=true
                                style="heigh: auto"
                                v-model="content"
                                ref="myQuillEditor"
                                :options="editorOption"
                        ></quill-editor>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label='发布人'>
                        {{viewData.createdUserName || '--'}}
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
    data() {
      return {
        viewData: {},
        viewLoading: false,
        content: null,
        id: this.$route.query.id,
        editorOption: {
          modules: {
            toolbar: false,
          },
          readOnly: true
        }
      };
    },

    created() {
      this.initDetaiView()
    },

    methods: {
      initDetaiView() {
        console.log('拿到的id'+this.id)
        if (this.id) {
          autoDoFn(async () => {
            this.viewLoading = true;
            const res = await getDetail({ id: this.id });
            if (res) {
              this.content = res.data.context;
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
          path: 'staff/staff',
          name: 'staff',
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },
    }
  };
</script>
