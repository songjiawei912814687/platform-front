<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                            label='规则名称'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入规则名称!' },{ max: 255, message: '最多255个字符!' }]}"
                    >
                        <a-input placeholder='请输入规则名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='规则类型'
                            fieldDecoratorId="ruleType"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择规则类型'}]}">
                        <a-select placeholder='请选择规则类型' :getPopupContainer="triggerNode => triggerNode.parentNode">
                            <a-select-option value='1'>工作纪律</a-select-option>
                            <a-select-option value='2'>审执纪律</a-select-option>
                            <a-select-option value='3'>组织纪律</a-select-option>
                            <a-select-option value='4'>违规行为</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='扣分方式'
                            fieldDecoratorId="deductionType"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择扣分方式!'}]}">
                        <a-select placeholder='请选择扣分方式' :getPopupContainer="triggerNode => triggerNode.parentNode"  @change="getSelectValue">
                            <a-select-option value='1'>固定值</a-select-option>
                            <a-select-option value='2'>区间值</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="fix===true">
                    <a-form-item
                            label='固定分值'
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入固定分值!' }]}">
                        <a-input placeholder='请输入固定分值' type="number" v-model='score'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="between===true">
                    <a-form-item
                            label='扣分下限'
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入扣分下限!' }, {
                            validator: this.compareToMax,
                            }]}"
                    >
                        <a-input placeholder='请输入扣分下限' v-model='minLimit' type="number"/>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="between===true">
                    <a-form-item
                            label='扣分上限'
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入扣分上限!' }, {
                            validator: this.compareToMin,
                            }]}"
                    >
                        <a-input placeholder='请输入扣分上限' v-model='maxLimit' type="number"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='规则描述'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入规则描述!'},{max:255,message:'最多105个字符！'}]}">
                        <a-text-area placeholder='请输入规则描述' style="height: 150px"/>
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
import { Row, Col, Input,InputNumber, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/rule';
import { getPage1 } from '@/remote/classify';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
export default {
  name: 'Add',
  components: {
    AInput: Input,
    AInputNumber: InputNumber,
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
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData'],
  data() {
    return {
      addLoading: false,
      fix: false,
      between: false,
      maxLimit:'',
      minLimit:'',
      score:'',
    };
  },
  computed: {
    title() {
      return this.modifyId ? '考核规则编辑' : '考核规则录入';
    },
  },
  watch: {
    addVisible() {
      this.fix = false;
      this.between = false;
      if (this.modifyId && this.addVisible) {
        this.fix = true;
        this.between = true;
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
               name, description, ruleType, deductionType, minLimit,
                maxLimit, score,
            } = res.data;
            
            this.form.setFieldsValue({
              name,
              description: description === undefined || description === 'undefined' ? "" : description,
              ruleType: String(ruleType),
              deductionType: String(deductionType),
            });

            console.log('this.maxLimit'+res.data.maxLimit)
            this.maxLimit = res.data.maxLimit;
            this.minLimit = res.data.minLimit;
            this.score = res.data.score;
          }
          if(res.data.deductionType===1){
                this.fix = true;
                this.between = false;
            }else{
                this.fix = false;
                this.between = true;
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
                ...values,
              minLimit: Number(this.minLimit),
              maxLimit: Number(this.maxLimit),
              score: Number(this.score),
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
    getSelectValue(value) {
      this.deductionType = value
      this.fix = value==='1'?true:false;
      this.between = value==='1'?false:true;
      this.score = '';
      this.minLimit = '';
      this.maxLimit = '';
    },

    compareToMax (rule, value, callback) {
      if (value &&this.maxLimit!==''&& (value>this.maxLimit) ){
        callback('扣分下限不能大于扣分上限');
      } else {
        callback();
      }
    },

    compareToMin (rule, value, callback) {
     
      if (value &&this.minLimit!==''&&  (value<this.minLimit) ){
        callback('扣分上限不能小于扣分下限');
      } else {
        callback();
      }
    }
  },
};
</script>

<style scoped>

</style>
