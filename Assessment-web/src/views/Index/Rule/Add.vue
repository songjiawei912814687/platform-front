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
                            label='指标分类'
                            fieldDecoratorId="appraisalId"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择指标类型!'}]}">
                        <a-select placeholder='请选择指标分类' showSearch :filterOption="filterOption">
                            <a-select-option v-for="item in classifyList" :value='String(item.id)' :key="String(item.id)">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
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
                            label='计分分类'
                            fieldDecoratorId="scoreType"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择计分分类!'}]}">
                        <a-select placeholder='请选择计分分类'>
                            <a-select-option value='0'>直接加分</a-select-option>
                            <a-select-option value='1'>直接减分</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='打分设置'
                            fieldDecoratorId="scoreSource"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择打分设置!'}]}">
                        <a-select placeholder='请选择打分设置' @change="getSelectValue">
                            <a-select-option value='0'>系统默认值</a-select-option>
                            <a-select-option value='1'>手动调整</a-select-option>
                            <a-select-option value='3'>自动计算</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='默认打分'
                            fieldDecoratorId="defaultScore"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入规则名称!' }]}">
                        <a-input placeholder='请输入默认打分'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='状态'
                            fieldDecoratorId="state"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入状态!'}]}">
                        <a-select placeholder='请选择状态'>
                            <a-select-option value='0'>启用</a-select-option>
                            <a-select-option value='1'>停用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='分值'
                            fieldDecoratorId="score"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入分值!' }]}"
                    >
                        <a-input placeholder='请输入分值'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='累计限额'
                            fieldDecoratorId="cumulativeLimit"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入累计限额!' }]}"
                    >
                        <a-input placeholder='请输入累计限额'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='排序'
                            fieldDecoratorId="displayOrder"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入排序' }]}">
                        <a-input-number placeholder='请输入排序' style="width: 100%;" :min="1" :max="999"/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='数据接口'
                            v-if="scoreSource==='3'"
                            fieldDecoratorId="dataType"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择数据接口!'}]}">
                        <a-select placeholder='请选择数据接口'>
                            <a-select-option value='1'>迟到</a-select-option>
                            <a-select-option value='2'>早退</a-select-option>
                            <a-select-option value='3'>未打卡</a-select-option>
                            <a-select-option value='5'>办件量</a-select-option>
                            <a-select-option value='7'>网上申报率</a-select-option>
                            <a-select-option value='9'>资源精简率</a-select-option>
                            <a-select-option value='11'>群众满意度</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='计分标准项'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入计分标准项!'},{max:255,message:'最多105个字符！'}]}">
                        <a-text-area placeholder='请输入计分标准项' style="height: 150px"/>
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
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'classifyList'],
  data() {
    return {
      addLoading: false,
      scoreSource: '',
    };
  },
  computed: {
    title() {
      return this.modifyId ? '考核规则编辑' : '考核考勤规则录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId && this.addVisible) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              appraisalId, name, description, scoreSource, scoreType, dataType,
              cumulativeLimit, score, defaultScore, state,displayOrder,
            } = res.data;
            this.scoreSource = String(scoreSource);
              this.$nextTick(() => {
                  this.form.setFieldsValue({
                      appraisalId: String(appraisalId),
                      name,
                      description: description === undefined || description === 'undefined' ? "" : description,
                      scoreType: String(scoreType),
                      scoreSource: String(scoreSource),
                      dataType: String(dataType),
                      cumulativeLimit,
                      score,
                      defaultScore,
                      state: String(state),
                      displayOrder: displayOrder===undefined?'':String(displayOrder),
                  });
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
              appraisalId: window.parseInt(values.appraisalId),
              name: String(values.name),
              description: String(values.description) === undefined ||  String(values.description) === 'undefined' ? ' ' : String(values.description),
              scoreType: window.parseInt(values.scoreType),
              scoreSource: window.parseInt(values.scoreSource),
              dataType: values.dataType ? window.parseInt(values.dataType) : 0,
              cumulativeLimit: Number(values.cumulativeLimit),
              score: Number(values.score),
              defaultScore: Number(values.defaultScore),
              state: window.parseInt(values.state),
              displayOrder: window.parseInt(values.displayOrder),
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
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getSelectValue(value) {
      this.scoreSource = value;
    },
  },
};
</script>

<style scoped>

</style>
