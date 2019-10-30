<template>
    <Drawer :value="addVisible"
              @on-close="handleClose"
              :mask-closable="false"
              :width="1000"
              :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">

                    <a-col :span="24">
                        <a-form-item
                                label='问题类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择问题类型!'}]}">
                            <a-select placeholder='请选择问题类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                                <a-select-option v-for="item in QuestionType"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="organTree"
                                    showSearch
                                    treeNodeFilterProp="title"
                                    placeholder='请选择所属机构'
                                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='问题'
                                fieldDecoratorId="title"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入问题!'}]}">
                            <a-text-area style="height: 150px"></a-text-area>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item
                                label='提问人姓名'
                                fieldDecoratorId="askName"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入提问人姓名!'}]}">
                            <a-input placeholder="请输入提问人姓名"/>
<!--                            <a-text-area style="height: 40px"></a-text-area>-->
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='提问人手机号码'
                                fieldDecoratorId="askTel"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入提问人手机号码!'}]}">
                            <a-input placeholder="请输入提问人手机号码"/>
<!--                            <a-text-area style="height: 40px"></a-text-area>-->
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item
                                label='附件'
                                fieldDecoratorId="attachmentList"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请上传附件!'}]}">
                            <a-upload name="file"
                                      :multiple="true"
                                      :showUploadList="true"
                                      action="/upload"
                                      :fileList="fileList"
                                      :data="{resourceType:14}"
                                      :beforeUpload="beforeUpload"
                                      @change="handleChange"
                            >
                                <a-button>选择文件</a-button>
                            </a-upload>
                        </a-form-item>
                    </a-col>


                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
    </Drawer>
</template>

<script>
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import { formPost, getDetail } from '@/remote/refer';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ATextArea: TextArea,
    ADrawer: Drawer,
    ASpin: Spin,
    ATreeSelect: TreeSelect,
    AUpload: Upload,
    AIcon: Icon,
    ADatePicker: DatePicker,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'QuestionType', 'organTree'],
  data() {
    return {
        addLoading: false,
        fileList:[],
        playerOptions: {
            playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [
                {
                    type: '',
                    src: 'http://139.196.192.24:8089/uploadFile/video/20190516_205839.mp4' //视频url地址
                }
            ],
            // poster: 'http://139.196.192.24:8089/img/background.jpg', //你的封面地址
            notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
            }
        },
    };
  },
  computed: {
    title() {
      return this.modifyId ? '咨询问题编辑' : '咨询问题录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              title, description, isOpen, isTop,organizationId, type,askName,askTel,attachmentList = [],
            } = res.data;
              this.fileList = attachmentList.map(item => ({
                  uid: item.url,
                  name: item.fileName,
                  response: {
                      code: 0,
                      data: [
                          {
                              fileName: item.fileName,
                              filePath: item.url,
                              fileSize: item.attachmentSize,
                              suffixName: item.suffix,
                          }
                      ],
                  }
              }));
            this.form.setFieldsValue({
              title, description, isOpen, isTop,askName,askTel,
                organizationId: organizationId !== undefined ? String(organizationId) : '',
                type: type !== undefined ? String(type) : '',
            });
          }
          this.addLoading = false;
        });
      }else {
          this.fileList = [];
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const {
              title, description, isOpen, isTop,type, organizationId,askName,askTel,attachmentList
            } = values;


            const res = await formPost(this.modifyId, {
              title, description, isOpen: parseInt(isOpen), isTop: parseInt(isTop),type,organizationId,askName,askTel,
                attachmentList: this.fileList.map(item => ({
                    "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                    "fileName": item.response.data[0].fileName,//必填  文件名 string
                    "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                    url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                        `${item.response.data[0].filePath}` :
                        `/uploadFile${item.response.data[0].filePath}`,
                }))
            });
            if (res) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
      //文件上传
      handleChange(info) {
          let fileList = info.fileList;
          fileList = fileList.map((file) => {
              if (file.response) {
                  file.url = file.response.url;
              }
              return file;
          });
          fileList = fileList.filter((file) => {
              if (file.response) {
                  if (file.response.code !== 0) {
                      this.$message.error(file.name + '上传失败!');
                  }
                  return file.response.code === 0;
              }
              return true;
          });
          this.fileList = fileList;
      },
      beforeUpload(file) {
          // const arr = file.name.split('.');
          // this.configType = fileType[arr[arr.length - 1].toUpperCase()] || 10;
          return true;
      },
  },
};
</script>

<style lang="less">

</style>
