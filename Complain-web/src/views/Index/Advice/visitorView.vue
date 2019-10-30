<template>
    <Drawer :value="visitorVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="600"
            title="回访">
        <a-spin tip="正在加载中..." :spinning="visitorLoading">
            <a-form v-if="visitorVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}" >
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
                                :fieldDecoratorOptions="{rules: [{ message: '请输入姓名!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入姓名' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='群众手机号码'
                                fieldDecoratorId="suggestionPhoneNumber"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入电话!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入电话' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='被投诉员工姓名'
                                fieldDecoratorId="employeeName"
                                :fieldDecoratorOptions="{rules: [{ message: '请输入电话!'}]}">
                            <a-input :disabled="modifyId" placeholder='请输入被投诉员工姓名' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='被投诉员工工号'
                                fieldDecoratorId="employeeNo"
                                :fieldDecoratorOptions="{rules: [{  message: '请输入电话!'}]}">
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
                                label='投诉时间'
                                fieldDecoratorId="createdDateTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入投诉时间!'}]}">
                            <a-date-picker
                                    style="width:100%"
                                    showTime format="YYYY-MM-DD HH:mm:ss"
                                    :disabled="!!modifyId" placeholder='请输入投诉时间'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='投诉原因'
                                fieldDecoratorId="content"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写群众投诉原因!'}]}">
                            <a-text-area placeholder='请填写群众投诉原因' style="height: 150px"/>
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
            <a-button @click="handleSubmit" type="primary" :loading="visitorLoading">保存</a-button>
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

import { getDealResult, formDealPost } from '@/remote/advice';
import { autoDoFn, formatTimes } from '@/utils/util';
import { getDetail,formPost} from '@/remote/advice';
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
    name: 'VisitorView',
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
    props: ['visitorVisible', 'handleClose', 'modifyId','addVisible'],
    data() {
        return {
            visitorLoading: false,
            fileList:[],
            dateResource:'',
            suggestionName:'',
            suggestionPhoneNumber:'',
            organizationId:'',
            windowId:null,
            hasWindowId:false,
            windowStaff:{}, // 选中的人员
            amputated: 0,
            dateResource:'',
            dateResourceName:'',
            organizationName:'',
            windowName:'',
            employeeId:null,
            employeeName:'',
            employeeNo:'',
            content:'',
            createdDateTime:null,
        };
    },
    watch: {
        visitorVisible() {
            if (this.modifyId) {
                if(this.visitorVisible){
                    autoDoFn(async () => {
                        this.visitorLoading = true;
                        const res = await getDetail({ id: this.modifyId });
                        if (res.success) {
                            let {
                                dateResource, dateResourceName,createdDateTime,employeeNo,isPhoneCall,isUse,
                                suggestionName,suggestionPhoneNumber,organizationId,organizationName,
                                windowId,windowName,employeeId,employeeName,attachmentList, amputated,content,
                            } = res.data;
                            this.amputated = amputated;
                            this.form.setFieldsValue({
                                dateResource:{key:String(dateResource),label:dateResourceName},
                                suggestionName,
                                suggestionPhoneNumber,
                                employeeName:employeeName?employeeName:' ',
                                employeeNo,
                                isUse,
                                isPhoneCall,
                                createdDateTime:moment(createdDateTime),
                                organizationId:{value:String(organizationId),label:organizationName},
                                windowId:windowId?{key:String(windowId),label:windowName}:" ",
                                employeeId:employeeId?employeeId:" ",
                                content,
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
                            console.log("res.data:"+res.data);
                        }
                        this.visitorLoading = false;
                    });
                }else{
                    this.fileList = [];
                }
            }
        },
    },
    methods: {
        //来源筛选修改的时候
        dateResourceChange(value){
            this.dateResource = value.key;
            console.log(this.dateResource)
        },
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
                        this.visitorLoading = true;
                        let params = {
                            dateResource:parseInt(values.dateResource.key),
                            suggestionName:String(values.suggestionName),
                            suggestionPhoneNumber:String(values.suggestionPhoneNumber),
                            organizationId:parseInt(values.organizationId.value),
                            organizationName:String(values.organizationId.label),
                            amputated:this.amputated,
                            windowId:values.windowId?parseInt(values.windowId.key):null,
                            windowName:values.windowId?String(values.windowId.label):null,
                            employeeId:this.windowStaff?parseInt(this.windowStaff.value):null,
                            employeeNo:this.windowStaff?String(values.employeeNo):null,
                            employeeName:this.windowStaff?String(values.employeeName):null,
                            content:values.content,
                            isPhoneCall:1,
                            isUse:parseInt(values.isUse),
                            attachmentList: this.fileList.map(item => ({
                                "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                                "fileName": item.response.data[0].fileName,//必填  文件名 string
                                "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                                url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                                    `${item.response.data[0].filePath}` :
                                    `/uploadFile${item.response.data[0].filePath}`,
                            }))
                        }
                        const res = await formPost(this.modifyId, params);
                        if (res.success) {
                            this.$message.success('操作成功');
                            this.$emit('successCallback');
                        }
                        this.visitorLoading = false;
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


