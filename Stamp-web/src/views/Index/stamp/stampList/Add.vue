<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='工号'
                                fieldDecoratorId="empNo"
                                :fieldDecoratorOptions="{initialValue: selection.empNo}"
                        >
                            <a-input  placeholder='工号' disabled/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='窗口工作人员'
                                fieldDecoratorId="empName"
                                :fieldDecoratorOptions="{initialValue: selection.empName}"
                        >
                            <a-input placeholder='窗口工作人员' disabled/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='叫号时间'
                                fieldDecoratorId="callTime"
                        >
                            <a-date-picker v-if="this.modifyId"
                                           style="width: 100%"
                                    format="YYYY-MM-DD HH:mm"
                                    :disabledDate="disabledDate"
                                    :disabledTime="disabledDateTime"
                                    :showTime="{ defaultValue: moment('00:00', 'HH:mm'),format:'HH:mm' }" disabled/>

                            <a-date-picker v-else
                                           style="width: 100%"
                                           format="YYYY-MM-DD HH:mm"
                                           :disabledDate="disabledDate"
                                           :disabledTime="disabledDateTime"
                                           :showTime="{ defaultValue: moment('00:00', 'HH:mm'),format:'HH:mm' }" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='经办人'
                                fieldDecoratorId="doName"
                        >
                            <a-input placeholder='请输入经办人' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='经办人身份证号码'
                                fieldDecoratorId="doIdentity"
                                :fieldDecoratorOptions="{
                                rules: [
                                { pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确身份证号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入经办人身份证号码' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='经办人手机号码'
                                fieldDecoratorId="doNumber"
                                :fieldDecoratorOptions="{
                                rules: [
                                { pattern: /^1\d{10}$/, message: '请输入正确手机号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入经办人手机号码' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='企业名称'
                                fieldDecoratorId="companyName"
                        >
                            <a-input placeholder='请输入企业名称' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='法人代表'
                                fieldDecoratorId="lealPerson"
                        >
                            <a-input placeholder='请输入法人代表' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='法人身份证号码'
                                fieldDecoratorId="lealIdentity"
                                :fieldDecoratorOptions="{
                                rules: [
                                { pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确身份证号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入法人身份证号码' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='统一社会信用代码'
                                fieldDecoratorId="socialCode"
                        >
                            <a-input placeholder='请输入统一社会信用代码' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='企业经营地址'
                                fieldDecoratorId="companyAddress"
                        >
                            <a-input placeholder='请输入企业经营地址' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item
                                label='服务套餐'
                                fieldDecoratorId="servicePlan"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择服务套餐!' }]}"
                    >
                        <a-select placeholder='请选择服务套餐'>
                            <a-select-option value='A'>二合一（营业执照+公章）</a-select-option>
                            <a-select-option value='B1'>三合一(营业执照+公章+发票)</a-select-option>
                            <a-select-option value='B2'>三合一(营业执照+公章+开户)</a-select-option>
                            <a-select-option value='C'>四合一（营业执照+公章+发票+开户）</a-select-option>
                        </a-select>
                    </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='刻章单位'
                                fieldDecoratorId="stampCompany"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择刻章单位!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择刻章单位'
                                    showSearch
                                    treeNodeFilterProp="title"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>


                    <a-col :span="12">
                        <a-form-item
                                label='备注'
                                fieldDecoratorId="bak"
                        >
                            <a-input placeholder='请输入备注'/>
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
                                      :data="{resourceType:12}"
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
        <staff-modal :membersVisible="selectStaffVisible"
                     :propsSelectedRowKeys="selectedRowKeys"
                     :organTree="orgTreeData"
                     @cancel="handleUpdateData('selectStaffVisible', false)"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, InputNumber,DatePicker,Upload } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/stamp';
import { autoDoFn ,transformTree} from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import Index from './index';
import moment from 'moment';
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
    Index,
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
    AInputNumber: InputNumber,
    ADatePicker:DatePicker,
    AUpload: Upload,
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList'],
  data() {
    return {
      addLoading: false,
      selectStaffVisible: false,
      staffType: '',
      selection: {},
      selectedRowKeys: [],
      resData: {},
	  linkedId:'',
      fileList: [],
    };
  },
  computed: {
    title() {
      return this.modifyId ? '刻章编辑' : '刻章录入';
    },
  },
  watch: {
    addVisible() {
        console.log(this.empNo)
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
                empName, callTime,empNo,
                doName, doIdentity, doNumber, companyName, lealPerson, lealIdentity,
                socialCode, companyAddress, servicePlan,stampCompany,bak, linkedId,
                attachmentList=[],
            } = res.data;
              this.fileList =  attachmentList.map(item => ({
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
            this.resData = res.data;
			this.linkedId = linkedId;
			this.selection={
			    empNo:localStorage.getItem('employeeNo'),
                empName:localStorage.getItem('employeesName'),
			};
            this.form.setFieldsValue({
              empName:localStorage.getItem('employeesName'),
                empNo:localStorage.getItem('employeeNo'),
                callTime: moment(callTime),
                doName,
                doIdentity,
                doNumber,
                companyName,
                lealPerson,
                lealIdentity,
                socialCode,
                companyAddress,
                servicePlan,
                stampCompany: stampCompany !== undefined ? String(stampCompany) : '',
                bak,

            });
          }
          this.addLoading = false;
        });
      }else {
          this.linkedId = undefined;
          this.resData = {};
          this.selection={
              empNo:localStorage.getItem('employeeNo'),
              empName:localStorage.getItem('employeesName'),
          };
          this.fileList = [];
      }


    },
  },
  methods: {
      moment,
      range(start, end) {
          const result = [];
          for (let i = start; i < end; i++) {
              result.push(i);
          }
          return result;
      },

      disabledDate(current) {
          return current && current > moment().endOf('day');
      },

      disabledDateTime() {
          moment().hours()
          return {
              disabledHours: () => this.range(0, 24).splice(moment().get('hours')+1, 32-moment().get('hours')),
              disabledMinutes: () => this.range(moment().get('minutes'), 60),
          };
      },
      // 文件上传
      handleChange(info) {
          const fileList = info.fileList.map((file) => {
              const item = Object.assign({}, file);
              if (file.response) {
                  item.url = file.response.url;
              }
              return item;
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
      beforeUpload() {
          return true;
      },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (String(this.modifyId) === String(values.parentId)) {
            this.$message.error('上级组织机构不可以是当前组织机构');
            return false;
          }
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              ...values,
                id:this.modifyId,
                empNo:localStorage.getItem('employeeNo'),
                empName:localStorage.getItem('employeesName'),
                callTime: values.callTime.format('YYYY-MM-DD HH:mm'),
                attachmentList: this.fileList.map(item => ({
                    attachmentSize: item.response.data[0].fileSize, // 必填  文件长度  int
                    fileName: item.response.data[0].fileName, // 必填  文件名 string
                    suffix: item.response.data[0].suffixName, // 必填 后缀名 string
                    url: item.response.data[0].filePath.indexOf('uploadFile') > -1 ?
                        `${item.response.data[0].filePath}` :
                        `/uploadFile${item.response.data[0].filePath}`,
                })),
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
    handleUpdateData(name, value) {
      this[name] = value;
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      this.resData[this.staffType] = selections[0].id;
      this.form.setFieldsValue({
        [this.staffType]: selections[0].name,
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    leadershipSelect() {
      const { leadership } = this.resData;
      this.selectedRowKeys = leadership ? [String(leadership)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'leadership';
    },
    departmentalManagerSelect() {
      const { departmentalManager } = this.resData;
      this.selectedRowKeys = departmentalManager ? [String(departmentalManager)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'departmentalManager';
    },
  },
};
</script>

<style scoped>

</style>
