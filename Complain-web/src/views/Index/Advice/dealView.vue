<template>
    <Drawer :value="dealVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="600"
            title="处理">
        <a-spin tip="正在加载中..." :spinning="dealLoading">
            <a-form v-if="dealVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12" >
                        <a-form-item
                                label='来源'
                                fieldDecoratorId="dateResource"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择来源!'}]}">
                            <a-select :disabled="modifyId" labelInValue placeholder='请选择来源' @change="dateResourceChange">
                                <a-select-option value="0">电话</a-select-option>
                                <a-select-option value="1">现场</a-select-option>
                                <a-select-option value="2">上级下发</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='群众姓名'
                                fieldDecoratorId="suggestionName"
                                :fieldDecoratorOptions="{rules: [{  message: '请输入姓名!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入姓名' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='群众手机号码'
                                fieldDecoratorId="suggestionPhoneNumber"
                                :fieldDecoratorOptions="{rules: [{ message: '请输入电话!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入电话' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='被投诉员工姓名'
                                fieldDecoratorId="employeeName"
                                :fieldDecoratorOptions="{rules: [{  message: '请输入电话!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入被投诉员工姓名' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='被投诉员工工号'
                                fieldDecoratorId="employeeNo"
                                :fieldDecoratorOptions="{rules: [{message: '请输入电话!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入被投诉员工工号'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='被投诉部门'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择投诉部门!'}]}">
                            <a-tree-select
                                    style="width: 100%"
                                    allowClear
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="organizationOptions"
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                    labelInValue
                                    :disabled="modifyId"
                                    :showSearch='true'
                                    placeholder="请选择组织机构"
                                    @change="onOrganiChange"
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='处理时间'
                                fieldDecoratorId="dealTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入处理时间!'}]}">
                            <a-date-picker
                                    style="width:100%"
                                    showTime format="YYYY-MM-DD HH:mm:ss"
                                    :disabledDate="disabledDate"
                                    :disabledTime="disabledDateTime" placeholder='请输入处理时间'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='处理结果'
                                fieldDecoratorId="dealResult"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入处理结果!'}]}">
                            <a-input type="textarea" placeholder='请输入处理结果' style="height: 150px"/>
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
                                      :data="{resourceType:3}"
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
            <a-button @click="handleSubmit" type="primary" :loading="dealLoading">保存</a-button>
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
import moment from 'moment';

import { getDealResult,formDealPost,getDetail} from '@/remote/advice';
import { autoDoFn, formatTimes } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
    name: 'DealView',
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
        ADrawer:Drawer,
        ASpin: Spin,
        ATreeSelect: TreeSelect,
        AUpload: Upload,
        AIcon: Icon,
        ADatePicker: DatePicker,
    },
    props: ['dealVisible', 'handleClose', 'modifyId'],
    data() {
        return {
            dealLoading: false,
            fileList:[],
        };
    },
    watch: {
        dealVisible() {
            if (this.modifyId) {
                if(this.dealVisible){
                    autoDoFn(async () => {
                        this.dealLoading = true;
                        const res = await getDetail({ id: this.modifyId});
                        if (res.success) {
                            let {
                                dateResource, dateResourceName,createdDateTime,employeeNo,
                                suggestionName,suggestionPhoneNumber,organizationId,organizationName,
                                windowId,windowName,employeeId,employeeName,attachmentList, amputated,content,
                            } = res.data;
                            this.amputated = amputated;
                            this.form.setFieldsValue({
                                dateResource:{key:String(dateResource),label:dateResourceName},
                                suggestionName,
                                suggestionPhoneNumber,
                                employeeName:employeeName?'':employeeName,
                                employeeNo,
                                createdDateTime:moment(createdDateTime),
                                organizationId:{value:String(organizationId),label:organizationName},
                                windowId:windowId?{key:String(windowId),label:windowName}:"",
                                employeeId:employeeId?employeeName:"", content,
                            });
                            if(attachmentList && attachmentList.length>0){
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
                            }
                            this.windowId = windowId?windowId:null;
                        }
                        this.dealLoading = false;
                    });
                }else{
                    this.fileList = [];
                }
            }
        },
    },
    methods: {
        handleSuccess (res, file, fileList) {
            this.fileList = fileList;
            if(res.success){
                this.$message.success('文件导入成功')
                // this.attachmentList = file;
            }
        },
        handleRemove(res,file,fileList){
            this.fileList = file;
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    autoDoFn(async () => {
                        this.dealLoading = true;
                        let params = {
                            dealResult: String(values.dealResult),
                            dealTime: formatTimes(values.dealTime),
                            attachmentList: this.fileList.map(item => ({
                                "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                                "fileName": item.response.data[0].fileName,//必填  文件名 string
                                "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                                url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                                    `${item.response.data[0].filePath}` :
                                    `/uploadFile${item.response.data[0].filePath}`,
                            }))
                        };
                        const res = await formDealPost(this.modifyId, params);

                        if (res) {
                            this.$message.success('操作成功');
                            this.$emit('successCallback');
                        }
                        this.dealLoading = false;
                    });
                }
            });
        },
        range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        },
        disabledDate(current) {
            // 不可选今天之后的日期
            return current > moment().endOf('day');
        },

        disabledDateTime() {
            // 不可选当前小时之后的时间
            var myDate = new Date();
            let _hours = myDate.getHours();
            return {
                disabledHours: () => this.range(0, 24).splice(_hours, 24),
                // disabledMinutes: () => this.range(30, 60),
                // disabledSeconds: () => [55, 56],
            };
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
                    if(file.response.code !== 0){
                        this.$message.error(file.name + '上传失败!');
                    }
                    return file.response.code === 0;
                }
                return true;
            });
            this.fileList = fileList;
        },
        beforeUpload(file) {
            return true;
        },
    },
}
</script>

<style>
    .uploads .ivu-upload-input{
        display: none!important;
    }
</style>


