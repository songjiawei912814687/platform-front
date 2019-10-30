<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="form => this.form = form">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='所属机构'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }],initialValue: organizationId}"
                        >
                            <a-tree-select
                                    :disabled="true"
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择所属机构'
                                    treeDefaultExpandAll
                                    @change="value => this.organizationId = value"
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='申请人'
                                fieldDecoratorId="employeesName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择申请人!' }],initialValue: selection.name}">
                            <a-input :disabled="true" placeholder='请选择申请人'></a-input>
                        </a-form-item>
                        <!--<a-button style="position: absolute; right: 12px; top: 28px;" type="primary" :disabled="!organizationId" @click="staffSelect">选择</a-button>-->
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='请假类型'
                                fieldDecoratorId="applicationType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择请假类型!' }]}"
                        >
                            <a-select placeholder='请选择请假类型' @change="handleApplicationTypeChange">
                                <a-select-option value="1">临时外出二小时公事</a-select-option>
                                <a-select-option value="2">哺乳假</a-select-option>
                                <a-select-option value="4">产假</a-select-option>
                                <a-select-option value="5">年休假</a-select-option>
                                <a-select-option value="6">因公外出</a-select-option>
                                <a-select-option value="7">事假</a-select-option>
                                <a-select-option value="8">病假</a-select-option>
                                <!--<a-select-option value="9">其他</a-select-option>-->
                                <a-select-option value="10">临时外出二小时私事</a-select-option>
                                <a-select-option value="11">婚假</a-select-option>
                                <a-select-option value="12">探亲假</a-select-option>
                                <a-select-option value="13">陪产假</a-select-option>
                                <a-select-option value="14">丧假</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='替岗人员'
                                fieldDecoratorId="replacePerson"
                                :fieldDecoratorOptions="{rules: [{ required: isWindowState, message: '请输入替岗人员!' }]}">
                            <a-input placeholder='请输入替岗人员'></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='开始日期'
                                fieldDecoratorId="startDate"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择开始日期!' }]}">
                            <a-date-picker format="YYYY-MM-DD" @change="handleStartDateChange"
                                           :disabledDate="disabledStartDate" style="width: 100%;"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='结束日期'
                                fieldDecoratorId="endDate"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择结束日期!' }]}">
                            <a-date-picker format="YYYY-MM-DD"
                                           @change="handleEndDateChange"
                                           :disabled="applicationType === '1' || applicationType === '10' || applicationType === '11'"
                                           :disabledDate="disabledEndDate" style="width: 100%;"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <!--开始时间-->
                    <a-col :span="12"
                           v-show="applicationType === '1' || applicationType === '2' || applicationType === '6'|| applicationType === '10'">
                        <a-form-item
                                label='开始时间'
                                fieldDecoratorId="startTime"
                                :fieldDecoratorOptions="{rules: [{ required: applicationType === '1' || applicationType === '2' || applicationType === '10', message: '请选择开始时间!' }]}">
                            <a-time-picker @change="handleStartTimeChange"
                                           style="width: 100%;"
                                            :disabledHours="disabledHours"
                                            :disabledMinutes="disabledMinutes"
                                            :disabledSeconds="disabledSeconds">
                            </a-time-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12"
                           v-show="!(applicationType === '1' || applicationType === '2' || applicationType === '6'|| applicationType === '10')">
                        <a-form-item
                                label='开始时间'
                                fieldDecoratorId="startTypeTime"
                                :fieldDecoratorOptions="{rules: [{ required: !(applicationType === '1' || applicationType === '2' || applicationType === '6'|| applicationType === '10'), message: '请选择开始时间!' }]}"
                        >
                            <a-select placeholder='请选择开始时间' @change="handleTypeStartTimeChange">
                                <a-select-option value="1" :disabled="disabledTypeStartDate(0)">{{ruleList[0] ?
                                    ruleList[0].value : ''}}
                                </a-select-option>
                                <a-select-option :disabled="typeStartTimeDisabled === '2' || disabledTypeStartDate(1)"
                                                 value="2">{{ruleList[1] ? ruleList[1].value : ''}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <!--结束时间-->
                    <a-col :span="12"
                           v-show="applicationType === '1' || applicationType === '2'|| applicationType === '6' || applicationType === '10'">
                        <a-form-item
                                label='结束时间'
                                fieldDecoratorId="endTime"
                                :fieldDecoratorOptions="{rules: [{ required: applicationType === '1' || applicationType === '2' || applicationType === '6'|| applicationType === '10', message: '请选择结束时间!' }]}">
                            <a-time-picker :disabled="applicationType === '1' || applicationType === '10'"
                                           style="width: 100%;">

                            </a-time-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12"
                           v-show="!(applicationType === '1' || applicationType === '2' || applicationType === '6' || applicationType === '10')">
                        <a-form-item
                                label='结束时间'
                                fieldDecoratorId="endTypeTime"
                                :fieldDecoratorOptions="{rules: [{ required: !(applicationType === '1' || applicationType === '2' || applicationType === '6'|| applicationType === '10'), message: '请选择结束时间!' }]}"
                        >
                            <a-select placeholder='结束时间' @change="handleTypeEndTimeChange"
                                      :disabled="applicationType === '11'">
                                <a-select-option :disabled="typeEndTimeDisabled === '3' || disabledTypeEndDate(2)"
                                                 value="3">{{ruleList[2] ? ruleList[2].value : ''}}
                                </a-select-option>
                                <a-select-option value="4" :disabled="disabledTypeEndDate(3)">{{ruleList[3]?
                                    ruleList[3].value : ''}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='请假原因'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入请假原因!' }]}"
                        >
                            <a-text-area placeholder='请输入请假原因' style="height: 150px"></a-text-area>
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
                                      accept=".doc, .docx, .txt"
                                      :fileList="fileList"
                                      :data="{resourceType:2}"
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
                     :organizationId="organizationId"
                     :propsSelectedRowKeys="selectedRowKeys"
                     @cancel="handleUpdateData('selectStaffVisible', false)"
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
    Button,
    Form,
    Select,
    Drawer,
    Spin,
    TreeSelect,
    DatePicker,
    TimePicker,
    Upload
  } from 'ant-design-vue';
  import {formPost, getDetail} from '@/remote/leaveApply';
  import {autoDoFn, transformTree} from '@/utils/util';
  import moment from 'moment';
  import StaffModal from '@/components/StaffModal/StaffModal';

  const {Item} = Form;
  const {Option} = Select;
  const {TextArea} = Input;
  const {RangePicker} = DatePicker;

  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm:ss';
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
      ARangePicker: RangePicker,
      ATimePicker: TimePicker,
      AUpload: Upload,
      StaffModal,
    },
    props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'ruleList'],
    data() {
      return {
        addLoading: false,
        selectedRowKeys: [],
        selection: {},
        selectStaffVisible: false,
        organizationId: '',
        applicationType: '',
        typeStartTimeDisabled: '',
        typeEndTimeDisabled: '',
        form: null,
        obj: {},
        fileList: [],
        isWindowState: String(localStorage.getItem('windowState')) === '1'
      };
    },
    computed: {
      title() {
        return this.modifyId ? '请假申请编辑' : '请假申请新增';
      },
    },
    watch: {
      addVisible() {
        if (this.addVisible) {
          if (this.modifyId) {
            autoDoFn(async () => {
              this.addLoading = true;
              const res = await getDetail({id: this.modifyId});
              if (res) {
                const {
                    replacePerson,
                  applicationType, startTimeKey, endTimeKey,
                  employeesName, organizationId,
                  startDate, startTime, endDate, endTime, description,
                  attachmentList = [],
                } = res.data;
                this.organizationId = String(organizationId);
                this.selection = {
                  id: res.data.employeesId,
                  name: res.data.employeesName,
                };
                let obj = {};
                this.applicationType = String(applicationType);
                if (String(applicationType) === '1' || String(applicationType) === '2' || String(applicationType) === '10') {
                  obj = {
                      replacePerson,
                    description,
                    applicationType: String(applicationType),
                    startDate: moment(startDate),
                    startTime: moment(startDate + ' ' + startTime),
                    endDate: moment(endDate),
                    endTime: moment(endDate + ' ' + endTime),
                    startTypeTime: '',
                    endTypeTime: '',
                    employeesName: res.data.employeesName,
                      employeesId:String(this.employeesId),
                    organizationId: String(this.organizationId)
                  };
                } else {
                  if (String(startTimeKey) === '2') {
                    this.typeEndTimeDisabled = '3';
                  }
                  if (String(endTimeKey) === '3') {
                    this.typeStartTimeDisabled = '2';
                  }
                  obj = {
                    replacePerson,
                    description,
                    applicationType: String(applicationType),
                    startDate: moment(startDate),
                    startTime: null,
                    startTypeTime: startTimeKey ? String(startTimeKey) : '',
                    endDate: moment(endDate),
                    endTime: null,
                    endTypeTime: endTimeKey ? String(endTimeKey) : '',
                    employeesName: res.data.employeesName,
                      employeesId:String(this.employeesId),
                    organizationId: String(this.organizationId)
                  };
                }
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
                this.form.setFieldsValue(obj);
              }
              this.addLoading = false;
            });
          } else {
            this.organizationId = String(localStorage.organId);
            this.selection = {
              id: localStorage.employeeId,
              name: localStorage.employeesName,
            };

            this.fileList = [];
          }
        }

      },
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            let startDate = values.startDate.format(dateFormat);
            let startTime = '';
            let endDate = values.endDate.format(dateFormat);
            let endTime = '';
            let startTimeKey = '';
            let endTimeKey = '';
            let obj = {};
            if (values.applicationType === '1' || values.applicationType === '2' || values.applicationType === '6'|| values.applicationType === '10') {
              startTime = values.startTime.format(timeFormat);
              endTime = values.endTime.format(timeFormat);
              startDate = values.startDate.format(dateFormat)
              endDate = values.endDate.format(dateFormat)
              if (values.applicationType === '2') {
                if (moment(endDate + ' ' + endTime).valueOf() <= moment(startDate + ' ' + startTime).valueOf()) {
                  this.$message.error("开始时间必须小于结束时间!");
                  return false;
                }
              }
              obj = {
                replacePerson:values.replacePerson,
                description: values.description,
                applicationType: window.parseInt(values.applicationType),
                employeesId: this.selection.id,
                organizationId: String(this.organizationId),
                startDate,
                startTime,
                endDate,
                endTime,
                attachmentList: this.fileList.map(item => ({
                  "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                  "fileName": item.response.data[0].fileName,//必填  文件名 string
                  "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                  url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                    `${item.response.data[0].filePath}` :
                    `/uploadFile${item.response.data[0].filePath}`,
                }))
              };
            } else {
              startTime = this.ruleList[values.startTypeTime - 1].value;
              endTime = this.ruleList[values.endTypeTime - 1].value;
              startTimeKey = values.startTypeTime;
              endTimeKey = values.endTypeTime;
              obj = {
                description: values.description,
                replacePerson: values.replacePerson,
                employeesId:  this.selection.id,
                organizationId: String(this.organizationId),
                applicationType: window.parseInt(values.applicationType),
                startDate,
                startTime,
                endDate,
                endTime,
                startTimeKey,
                endTimeKey,
                attachmentList: this.fileList.map(item => ({
                  "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                  "fileName": item.response.data[0].fileName,//必填  文件名 string
                  "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                  url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                    `${item.response.data[0].filePath}` :
                    `/uploadFile${item.response.data[0].filePath}`,
                }))
              };
            }
            autoDoFn(async () => {
              this.addLoading = true;
              const res = await formPost(this.modifyId, obj);
              if (res) {
                this.$message.success('操作成功');
                this.$emit('successCallback');
              }
              this.addLoading = false;
            });
          }
        });
      },
      // 请假类型修改
      handleApplicationTypeChange(value) {
        this.applicationType = value;
        this.form.setFieldsValue({
          startTypeTime: '',
          startTime: null,
          endTypeTime: '',
          endTime: null,
        });
      },
      transDateFormat(date, format = 'YYYY-MM-DD') {
        return moment(date.format(format))
      },
      // 开始结束日期限制
      disabledStartDate(currentDate) {
        if (!currentDate) {
          return false;
        }
        let endDate = this.form.getFieldValue('endDate');
        if (this.applicationType === '11') {
          return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf();
        }
        if (!endDate) {
          return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf();
        }
        if (this.applicationType !== '1' && this.applicationType !== '10') {
          return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf() ||
            this.transDateFormat(currentDate).valueOf() > this.transDateFormat(endDate).valueOf();
        }
        return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf();
      },
      disabledEndDate(currentDate) {

        if (!currentDate) {
          return false;
        }
        let startDate = this.form.getFieldValue('startDate');
        if (!startDate) {
          return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf();
        }
        return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(startDate).valueOf();
      },

        //开始时间小时限制
        disabledHours(){
            let hours = [];
            let hourss = moment().format('YYYY-MM-DD')===this.form.getFieldValue('startDate').format(dateFormat)?moment().hour():0;
            for(let i =0; i < hourss; i++){
                hours.push(i);
            }
            return hours;
        },

        disabledMinutes(selectedHour){
            let minutes= [];
            if(selectedHour===moment().hour()&&moment().format('YYYY-MM-DD')===this.form.getFieldValue('startDate').format(dateFormat)){
                for(let i=0;i<moment().minutes();i++){
                    minutes.push(i);
                }
            }
            return minutes;
        },

        disabledSeconds(selectedHour, selectedMinute){
            let seconds = [];
            if(selectedHour ===moment().hour()&&selectedMinute===moment().minutes()&&moment().format('YYYY-MM-DD')===this.form.getFieldValue('startDate').format(dateFormat)){
                for(let i=0;i<moment().seconds();i++){
                    seconds.push(i);
                }
            }
            return seconds;
        },


      // 开始日期修改
      handleStartDateChange(date) {
        if (this.applicationType === '1'|| this.applicationType === '10') {
          if (this.form.getFieldValue('startTime')) {
            let endTime = moment(date.format("YYYY-MM-DD") + ' ' + this.form.getFieldValue('startTime').format("HH:mm:ss")).add(2, 'h');
            this.form.setFieldsValue({
              endDate: endTime,
              endTime: endTime,
            });
          } else {
            let endTime = moment(date.format("YYYY-MM-DD") + ' ' + moment().format("HH:mm:ss")).add(2, 'h');
            this.form.setFieldsValue({
              endDate: endTime,
              endTime: endTime,
              startTime: moment(),
            });
          }
        } else {
          if(this.applicationType === '11'){
            if( this.form.getFieldValue('startTypeTime')){
              const startData = date.format("YYYY-MM-DD") + ' 00:00:00';
              const value = this.form.getFieldValue('startTypeTime');

              if(value === '1'){
                this.form.setFieldsValue({
                  endDate: moment(startData).add(2, 'days'),
                  endTypeTime: '4',
                });
              }else if(value === '2'){
                this.form.setFieldsValue({
                  endDate: moment(startData).add(3, 'days'),
                  endTypeTime: '3',
                });
              }

            }
          } else{
            this.form.setFieldsValue({
              startTime: moment(),
              endTime: moment(),
            });
          }
            console.log(this.form.getFieldValue('endDate'))
        }
      },
      // 结束日期修改
      handleEndDateChange(date) {
        if (!(this.applicationType === '1' || this.applicationType === '10')) {
          this.form.setFieldsValue({
            startTypeTime: '',
            endTypeTime: '',
          });
          this.typeEndTimeDisabled = '';
          this.typeStartTimeDisabled = '';
        }
      },
      // 开始时间修改
      handleStartTimeChange(date) {
          console.log(date)
        if ((this.applicationType === '1'|| this.applicationType === '10') && this.form.getFieldValue('startDate')) {
          let endTime = moment(this.form.getFieldValue('startDate').format("YYYY-MM-DD") + ' ' + date.format("HH:mm:ss")).add(2, 'hours');
          this.form.setFieldsValue({
            endDate: endTime,
            endTime: endTime,
          });
        }
      },
      // 使用固定时间时的开始结束时间限制
      handleTypeStartTimeChange(value) {
          console.log(this.form.getFieldValue('endDate'))
        if (value === '2' && (this.form.getFieldValue('startDate').format("YYYY-MM-DD") ===
          this.form.getFieldValue('endDate')?this.form.getFieldValue('endDate').format("YYYY-MM-DD"):'')) {
          this.typeEndTimeDisabled = '3';
        } else {
          this.typeEndTimeDisabled = '';
        }

        if(this.applicationType === '11'){
          const startData = moment(this.form.getFieldValue('startDate').format("YYYY-MM-DD") + ' 00:00:00');

          if(value === '1'){
            this.form.setFieldsValue({
              endDate: moment(startData).add(2, 'days'),
              endTypeTime: '4',
            });
          }else{
            this.form.setFieldsValue({
              endDate: moment(startData).add(3, 'days'),
              endTypeTime: '3',
            });
          }

        }
      },
      handleTypeEndTimeChange(value) {
        if (value === '3' && (this.form.getFieldValue('startDate').format("YYYY-MM-DD") ===
          this.form.getFieldValue('endDate').format("YYYY-MM-DD"))) {
          this.typeStartTimeDisabled = '2';
        } else {
          this.typeStartTimeDisabled = '';
        }
      },
      handleUpdateData(name, value) {
        this[name] = value;
      },
      handleSelectStaffOk(selectedRowKeys, selections) {
        this.selection = selections[0];
        this.form.setFieldsValue({
          employeesName: selections[0].name,
        });
        this.handleUpdateData('selectStaffVisible', false);
      },
      staffSelect() {
        const {id} = this.selection;
        this.selectedRowKeys = id ? [String(id)] : [];
        this.handleUpdateData('selectStaffVisible', true);
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

      disabledTypeStartDate(index) {
        if (!this.form) {
          return true;
        }
        if (this.form && !this.form.getFieldValue('startDate')) {
          return true;
        }
        if (this.ruleList.length) {
          const startDate = this.form.getFieldValue('startDate').format('YYYY-MM-DD');
          return moment(startDate + ' ' + this.ruleList[index].value).valueOf() <= moment().valueOf();
        }
      },
      disabledTypeEndDate(index) {
        if (!this.form) {
          return true;
        }
        if (this.form && !this.form.getFieldValue('endDate')) {
          return true;
        }
        if (this.ruleList.length) {
          const currentDate = this.form.getFieldValue('endDate').format('YYYY-MM-DD');
          return moment(currentDate + ' ' + this.ruleList[index].value).valueOf() <= moment().valueOf();
        }
      },
    },
  };
</script>

<style scoped>

</style>
