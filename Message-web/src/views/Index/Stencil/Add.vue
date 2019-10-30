<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='模板名称'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入模板名称!' },{ max: 255, message: '最多255个字符!' }]}"
                    >
                        <a-input placeholder='请输入模板名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='业务类型'
                            fieldDecoratorId="type"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择业务类型!'}]}">
                        <a-select placeholder='请选择业务类型' @change="setParameter">
                            <a-select-option v-for="item in typeList" :value='String(item.code)'
                                             :key="String(item.code)">{{item.message}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='业务参数'
                            fieldDecoratorId="parameter"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入业务参数!'}]}">
                        <a-input placeholder='请输入业务参数' disabled v-if="parameterList.length === 0"/>
                        <div v-for="(item,index) in parameterList" style="margin-top: 5px">
                            <a-input placeholder='KEY' style="width: 60px;margin-right: 5px" :value="item.code" disabled></a-input>
                            <a-input placeholder='VALUE' style="width: 80px;" :value="item.message" disabled></a-input>
                            <a-button style="position: absolute; left: 154px;" type="primary" class="copyBtn" :data-clipboard-text ="item.code">复制</a-button>
                            <a-button style="position: absolute; left: 222px;" type="danger" @click="deleteParameter(index)">删除</a-button>
                        </div>
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item
                            label='是否回复'
                            fieldDecoratorId="isReply"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择启用状态!'}]}">
                        <a-select placeholder='请选择是否回复'>
                            <a-select-option value='0'>否</a-select-option>
                            <a-select-option value='1'>是</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='回复有效时间'
                            fieldDecoratorId="replyLimit"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入回复有效时间!' }]}"
                    >
                        <a-input type="number" min="0" placeholder='请输入回复有效时间'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='模板内容'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入模板内容!'},{max:255,message:'最多105个字符！'}]}">
                        <a-text-area placeholder='请输入模板内容' style="height: 150px"/>
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
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker } from 'ant-design-vue';
import { getDetail, formPost, findConfigByType } from '@/remote/stencil';
import { autoDoFn } from '@/utils/util';
import Clipboard from 'clipboard';

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
    ADatePicker: DatePicker,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'typeList'],
  data() {
    return {
      addLoading: false,
      parameterList: [],
    };
  },
  computed: {
    title() {
      return this.modifyId ? '短信模板编辑' : '短信模板录入';
    },
  },
  watch: {
    addVisible() {
      const clipboard = new Clipboard('.copyBtn');
      if (this.modifyId && this.addVisible) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              name, type, state, description,isReply,replyLimit
            } = res.data;
            this.form.setFieldsValue({
              isReply:String(isReply) === undefined ? '0' : String(isReply),
              replyLimit:String(replyLimit) === undefined ? 0 : String(replyLimit),
              name: String(name),
              type: String(type),
              state: String(state),
              description: String(description),
            });
          }
          this.addLoading = false;
        });
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
            const res = await formPost(this.modifyId, {
              name: String(values.name),
              type: String(values.type),
              description: String(values.description),
              state: window.parseInt(values.state),
              ...values
            });
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
    // 获取业务类型下的参数列表
    setParameter(values) {
      autoDoFn(async () => {
        const res = await findConfigByType({
          type: values,
        });
        if (res.success) {
          this.parameterList = res.data;
        }
      });
    },
    // 复制业务参数
    copyParameter(index) {
      console.log(this.parameterList[index]);
      const data = this.parameterList[index].code;
      window.clipboardData.setData('text', data);
    },
    // 删除业务参数
    deleteParameter(index) {
      this.parameterList.splice(index, 1);
    },
  },
};
</script>

<style scoped>

</style>
