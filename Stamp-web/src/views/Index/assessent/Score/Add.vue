<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='被记录人员'
                                fieldDecoratorId="employeeName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择被记录人员!' }],initialValue: selection.name}"> 
                            <a-input :disabled="true" placeholder='请选择被记录人员'
                                     style="width: 210px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button v-show="!this.modifyId" style="position: absolute; right: 12px; top: 28px;" type="primary"
                                  @click="staffSelect">选择
                        </a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='记录时间'
                                fieldDecoratorId="recordDateTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择记录时间!'}]}">
                            <a-date-picker format="YYYY-MM-DD" style="width: 100%" :disabledDate="disabledEndDate"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='规则类型'
                                fieldDecoratorId="ruleType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择规则类型!'}]}">
                            <a-select placeholder='请选择规则类型' @change="getClassify" :disabled="this.modifyId!=''">
                                <a-select-option v-for="item in classifyList" :value='String(item.id)'
                                                 :key="String(item.id)">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='考核规则'
                                fieldDecoratorId="ruleId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择考核规则!'}]}">
                            <a-select placeholder='请选择考核规则' :disabled="ruleDisabled" @change="getRuleChange">
                                <a-select-option v-for="item in ruleList" :value='String(item.id)'
                                                 :key="String(item.id)">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='扣分下限'
                                fieldDecoratorId="minLimit">
                            <a-input placeholder='请输入分值' :disabled="true"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item 
                                label='扣分上限'
                                fieldDecoratorId="maxLimit">
                            <a-input placeholder='请输入分值' :disabled="true"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='扣分分值'
                                fieldDecoratorId="value"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入得分!'}, {
                                  validator: this.compareToBetween,
                                }]}">
                            <a-input placeholder='请输入扣分分值' type="number" :disabled="deductionType==='1'" :min='minLimit' :max='maxLimit' />
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
                                      :data="{resourceType:configType}"
                                      :beforeUpload="beforeUpload"
                                      @change="handleChange"
                            >
                                <a-button>选择文件</a-button>
                            </a-upload>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入描述!'},{max:255,message:'最多255个字符！'}]}">
                            <a-text-area placeholder='请输入描述' style="height: 150px"/>
                        </a-form-item>
                    </a-col>

                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
        <staff-modal :membersVisible="selectStaffVisible"
                     :organTree="orgTreeData"
                     :propsSelectedRowKeys="selectedRowKeys"
                     @cancel="() => this.selectStaffVisible = false"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
    </Drawer>
</template>

<script>
import {
  Row,
  Col,
  Input,
  InputNumber,
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
import { formPost, getDetail } from '@/remote/score';
import { autoDoFn, transformTree2 } from '@/utils/util';
import {getOrgTree} from '@/remote/base'
import moment from 'moment';
import { getRules } from '@/remote/rule';
import { selectAll } from '@/remote/classify';
import StaffModal from '@/components/StaffModal/StaffModal';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const fileType = {
  DOC: 10,
  DOCX: 10,
  TXT: 20,
  PPT: 30,
  HTM: 40,
  XLS: 50,
  XLSX: 50,
  SWF: 60,
  JPEG: 70,
  JPG: 80,
  PNG: 90,
  GIF: 100,
};
export default {
  name: 'Add',
  components: {
    AInput: Input,
    AInputNumber:InputNumber,
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
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'classifyList'],
  data() {
    return {
      addLoading: false,
      ruleDisabled: true,
      deductionType: '1',
      minLimit: '',
      maxLimit: '',
      configType: '',
      orgTreeData: [],
      fileList: [],
      ruleList:[],
      selection: {},
      selectStaffVisible: false,
      selectedRowKeys: [],
    };
  },
  computed: {
    title() {
      return this.modifyId ? '考核记录编辑' : '考核记录录入';
    },
  },
  watch: {
    addVisible() {
      this.initOrganData()
      if (this.modifyId && this.addVisible) {
        this.ruleDisabled = true
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              employeeId, recordDateTime,  ruleId, score, description, attachmentList,
              employeeName, organizationId,ruleType,minLimit,maxLimit,value
            } = res.data;
            this.getClassify(res.data.ruleType)
            this.selection = {
              id: employeeId,
              name: employeeName,
              organizationId,
            };
            
            if(attachmentList!==undefined&&attachmentList!=''){
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
                  },
                ],
              },
            }));
            }
            this.form.setFieldsValue({
              employeeName,
              recordDateTime: moment(recordDateTime),
              ruleType: String(ruleType),
              ruleId: ruleId === undefined ? '' : String(ruleId),
              value,
              minLimit:String(res.data.deductionType)==='1'?score:minLimit,
              maxLimit:String(res.data.deductionType)==='1'?score:maxLimit,
              score,
              description,
            });
            this.minLimit= String(res.data.deductionType==='1'? res.data.score:res.data.minLimit);
            this.maxLimit= String(res.data.deductionType==='1'? res.data.score:res.data.maxLimit);
            this.deductionType = String(res.data.deductionType);
          }
          this.addLoading = false;
        });
      } else {
        this.selection = {
          id: localStorage.getItem('employeeId'),
          name: localStorage.getItem('employeesName')=='undefined'?'':localStorage.getItem('employeesName'),
          organizationId: localStorage.getItem('organId'),
        };
        this.fileList = [];
      }
    },
  },
  methods: {
    moment,
      initOrganData() {
          autoDoFn(async () => {
              const orgRes = await getOrgTree();
              if (orgRes) {
                  this.orgTreeData = [
                      {
                          label: '无',
                          value: '0',
                          key: '0',
                          children: transformTree2(orgRes.data),
                      },
                  ];

              }

          });
      },
    setEmployee() {
      autoDoFn(async () => {
        const employeesId = window.localStorage.getItem('employeesId');
        this.form.setFieldsValue({
          employeesId,
        });
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              employeeId: this.selection.id,
              organizationId: this.selection.organizationId,
              recordDateTime: values.recordDateTime.format('YYYY-MM-DD'),
              description: String(values.description === undefined ? '' : values.description),
              ruleId: Number(values.ruleId),
              value: Number(values.value),
              attachmentList: this.fileList.map(item => ({
                attachmentSize: item.response.data[0].fileSize, // 必填  文件长度  int
                fileName: item.response.data[0].fileName, // 必填  文件名 string
                suffix: item.response.data[0].suffixName, // 必填 后缀名 string
                url: item.response.data[0].filePath.indexOf('uploadFile') > -1 ?
                  `${item.response.data[0].filePath}` :
                  `/uploadFile${item.response.data[0].filePath}`,
              })),
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
    // 获取考核规则
    getClassify(id) {
      this.form.setFieldsValue({
        value: '',
        score: '',
        minLimit: '',
        maxLimit: '',
        ruleId: '',
      });
      this.deductionType= '', 
      this.minLimit= '', 
      this.maxLimit= '', 
      autoDoFn(async () => {
        const res = await getRules({
          ruleType: id,
          state:0,
        });
        if (res) {
          this.ruleList = res.data;
          if(!this.modifyId){
            this.ruleDisabled = false;
          }
        }
      });
    },
    // 获取考核规则
    getRuleChange(value) {
      const data = this.ruleList.find(item => String(item.id) === value);
      this.deductionType= String(data.deductionType);
      this.minLimit= String(this.deductionType==='1'? data.score:data.minLimit);
      this.maxLimit= String(this.deductionType==='1'? data.score:data.maxLimit);
      this.form.setFieldsValue({
        minLimit: this.deductionType==='1'? data.score:data.minLimit,
        maxLimit: this.deductionType==='1'? data.score:data.maxLimit,
        value: this.deductionType==='1'? data.score:data.minLimit,
      });
    },
    staffSelect() {
      this.selectedRowKeys = [String(this.selection.id)];
      this.selectStaffVisible = true;
    },
    // 选择人员
    handleSelectStaffOk(selectedRowKeys, selections) {
      if(selections[0]!==undefined){
        this.selection = selections[0];
        this.form.setFieldsValue({
          employeeName: selections[0].name,
        });
      }
      
      this.selectStaffVisible = false;
    },
    // 文件上传
    handleChange(info) {
      const fileList = info.fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      }).filter((file) => {
        if (file.response) {
          if (file.response.code !== 0) {
            this.$message.error(`${file.name}上传失败!`);
          }
          return file.response.code === 0;
        }
        return true;
      });
      this.fileList = fileList;
    },
    beforeUpload(file) {
      const arr = file.name.split('.');
      return true;
    },


    disabledEndDate (endValue) {
      if (!endValue) {
        return false;
      }
      return  moment().valueOf() <= endValue.valueOf();
    },

    compareToBetween (rule, value, callback) {
       var val1 = Number(value);
       var maxLimit1 = Number(this.maxLimit);
       var minLimit1 = Number(this.minLimit);
      if (value && (val1>maxLimit1||val1<minLimit1) ){
        callback('输入的分值必须在扣分上下限内');
      } else {
        callback();
      }
    }

  },
};
</script>
<style lang="less">

</style>
