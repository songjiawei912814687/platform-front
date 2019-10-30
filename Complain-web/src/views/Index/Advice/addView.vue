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
                                label='来源'
                                fieldDecoratorId="dateResource"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择来源!'}]}">
                            <a-select :disabled="!!modifyId" labelInValue placeholder='请选择来源' @change="dateResourceChange">
                                <a-select-option value="0">电话</a-select-option>
                                <a-select-option value="1">现场</a-select-option>
                                <a-select-option value="2">上级下发</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <!--<a-form-item v-if="dateResource=='2'"-->
                            <!--label="上级部门"-->
                            <!--fieldDecoratorId="upperOrganizationId"-->
                            <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择上级部门!'}]}">-->
                            <!--<a-tree-select-->
                                <!--style="width: 100%"-->
                                <!--allowClear-->
                                <!--:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"-->
                                <!--:treeData="upOrganizationOptions"-->
                                <!--treeDefaultExpandAll-->
                                <!--labelInValue-->
                                <!--:showSearch='true'-->
                                <!--placeholder="请选择组织机构"-->
                                <!--@search="onUpperSearch"-->
                                <!--&gt;</a-tree-select>-->
                        <!--</a-form-item>-->
                        <a-form-item v-if="dateResource==='2'"
                            label="上级部门"
                            fieldDecoratorId="upperOrganizationName">
                            <a-input placeholder="请输入组织机构"></a-input>
                            <!--<a-tree-select
                                style="width: 100%"
                                allowClear
                                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                :treeData="upOrganizationOptions"
                                treeDefaultExpandAll
                                treeNodeFilterProp="title"
                                labelInValue
                                :showSearch='true'
                                placeholder="请选择组织机构"
                                ></a-tree-select>-->
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='姓名'
                                fieldDecoratorId="suggestionName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名!'}]}">
                            <a-input placeholder='请输入姓名'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='电话'
                                fieldDecoratorId="suggestionPhoneNumber"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入电话!'},{pattern: /^1[3456789]\d{9}$/,message:'请输入正确的手机号码'}]}">
                            <a-input placeholder='请输入电话'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='投诉部门'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择被投诉部门!'}]}">
                                <a-tree-select
                                    style="width: 100%"
                                    allowClear
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="organizationOptions"
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                    labelInValue
                                    :showSearch='true'
                                    placeholder="请选择组织机构"
                                     @change="onOrganiChange"
                                    ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12" >-->
                        <!--<a-form-item-->
                                <!--label='投诉窗口'-->
                                <!--fieldDecoratorId="windowId">-->
                            <!--<a-select placeholder='请选择投诉窗口' labelInValue @change="windowChange">-->
                                <!--<a-select-option  v-for="(item, index) in windowList" :key="String(item.id)" :value="String(item.id)">{{item.windowNo}}</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12" >
                        <a-form-item
                                label='投诉工号'
                                fieldDecoratorId="employeeId">
                            <!-- <a-select placeholder='请选择投诉人员' labelInValue>
                                <a-select-option  v-for="item in staffList" :key="String(item.id)" :value="String(item.id)">{{item.name}}</a-select-option>
                            </a-select> -->
                            <a-input :disabled="true" placeholder='请选择投诉工号'
                                     style="width: 200px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary" @click="staffSelect">选择</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='是否有效'
                                fieldDecoratorId="isUse"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择来源!'}]}">
                            <a-select
                                    labelInValue placeholder='请选择是否有效'
                                    @change="isUseChange">
                                <a-select-option value="0">无效</a-select-option>
                                <a-select-option value="1">有效</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='投诉内容'
                                fieldDecoratorId="content"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入投诉内容!'}]}">
                            <a-text-area placeholder='请输入投诉内容' style="height: 100px"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item class="uploads"
                                label='附件'
                                fieldDecoratorId="attachmentList">
                            <a-upload action="/upload"
                                name="file"
                                :data="{resourceType:3}"
                                :multiple="false"
                                :fileList="fileList"
                                @remove="handleRemoveUpload"
                                @change="handleUploadChange"
                                >
                                <a-button>上传</a-button>
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
                     :windowId="windowId"
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
  Upload,
  Icon,
  DatePicker,
  Cascader,
} from 'ant-design-vue';

import StaffModal from '@/components/StaffModal/StaffModal';
import { autoDoFn, transformTree, fielterFormTree } from '@/utils/util';
import { getOrganizationTree2, getWindows, getEmployeesByWindowsId } from '@/remote/common';
import { getDetail, formPost } from '@/remote/advice';




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
    name: 'AddView',
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
        ACascader:Cascader,
        StaffModal
    },
    props: ['addVisible', 'handleClose', 'modifyId'],
    data() {
        return {
            addLoading: false,
            departmentList:[],
            fileList:[],
            upOrganizationOptions:[],   //上级部门下拉
            organizationOptions:[],     //投诉部门下拉
            dateResource:'',    //来源，用来判断上级部门是否必选
            windowList:[],  //投诉窗口列表
            staffList:[],   //投诉人员列表
            upperOrganizationName:'',   //上级部门名称
            organizationName:'',    //组织名称
            selectStaffVisible:false,
            selections: [],
            selectedRowKeys: [],
            windowId:null,
            hasWindowId:false,
            windowStaff:{}, // 选中的人员
            amputated: 0,
            isUse:'',
        };
    },
    created(){
        this.getOrganizationTree();
    },
    computed: {
        title() {
            return this.modifyId ? '投诉建议编辑' : '投诉建议录入';
        },
    },
    watch: {
        addVisible() {
            if (this.modifyId) {
                if(this.addVisible){
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({ id: this.modifyId });
                        if (res.success) {
                            let {
                                dateResource, dateResourceName,upperOrganizationId,upperOrganizationName,isPhoneCall,
                                isCallName, suggestionName,suggestionPhoneNumber,organizationId,organizationName,isUse,isUseName,
                                windowId,windowName,employeeId,employeeName,attachmentList, amputated,content,
                            } = res.data;
                            this.amputated = amputated;
                            this.onOrganiChange({value:organizationId});

                            this.form.setFieldsValue({
                                dateResource:{key:String(dateResource),label:dateResourceName},
                                isUse:{key:String(isUse),label:isUseName},
                                isPhoneCall:{key:String(isPhoneCall),label:isCallName},
                                upperOrganizationName,
                                suggestionName,
                                suggestionPhoneNumber,
                                organizationId:{value:String(organizationId),label:organizationName},
                                // windowId:windowId?{key:String(windowId),label:windowName}:"",
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
                            this.windowStaff = employeeId?{key:employeeId,label:employeeName,value:String(employeeId)}:null;
                            // this.windowId = windowId?windowId:null;
                            this.hasWindowId = windowId?true:false;
                        }
                        this.addLoading = false;
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
        isUseChange(value){
            this.isUse = value.key;
        },
        // 获取组织树
        getOrganizationTree(){
            autoDoFn(async ()=>{
                const res = await getOrganizationTree2({})
                if(res.success){
                    this.upOrganizationOptions = transformTree(res.data);
                    this.organizationOptions = transformTree(res.data);
                }
            })
        },

        // 上级部门组织树修改的时候
        onUpperChange(value){
            this.upperOrganizationId = value.value;
        },
        // 上级部门 搜索组织树
        onUpperSearch(e){
            let _upOrganizationOptions = JSON.parse(JSON.parse(this.upOrganizationOptions));
            if(e && e.length>0){
                _upOrganizationOptions.filter(item=>{
                    if(item.label.indexOf(e)>-1){
                        return item;
                    }
                })
            }
            this.upOrganizationOptions = _upOrganizationOptions;
        },

        //投诉部门修改的时候，获取投诉窗口列表
        onOrganiChange(value){
            this.organizationId = value?value.value:'';
           // 投诉部门修改时，修改对应的投诉窗口、投诉人员
           //  this.windowList = [];
           //  this.windowId = '';
           //  this.windowName = '';
            this.hasWindowId = false;
            this.employeeId = null;
            this.employeeName = '';
            this.form.setFieldsValue({
                // windowId:windowId?{key:String(this.windowId),label:this.windowName}:null,
                employeeId:this.employeeName,
            })




        },
        // // 投诉窗口修改的时候，获取投诉人员列表(通过组件弹出筛选)
        windowChange(value){
            this.windowId = value?value.key:'';
            this.hasWindowId = !!value;
            this.employeeId = '';
            this.employeeName = '';
            this.form.setFieldsValue({
                employeeId:'',
            })
        },
        //选择人员
        handleSelectStaffOk(selectedRowKeys, selections) {
            this.selections = selections;
            this.form.setFieldsValue({
                // employeeId: selections.map(item => item.name).join(','),
                employeeId:selections[0].name
            });
            this.windowStaff = {key:selections[0].employeeNo,label:selections[0].name,value:String(selections[0].id)}
            this.selectStaffVisible = false;
        },

        staffSelect() {
            this.selectedRowKeys = this.selections.map(item => String(item.id));
            this.selectStaffVisible = true;
        },
        handleUpdateData(name, value) {
            this[name] = value;
        },

        beforeUpload(file) {
            const arr = file.name.split('.');
            this.configType = fileType[arr[arr.length - 1].toUpperCase()] || 10;
            return true;
        },
        handleUploadChange (info) {
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
                        this.$message.error(file.name + file.response.data[0].message);
                    }
                    return file.response.code === 0;
                }
                return true;
            });
            this.fileList = fileList;
        },
        handleRemoveUpload(res,file,fileList){
            this.fileList = file;
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    autoDoFn(async () => {
                        this.addLoading = true;
                        let params = {
                            isPhoneCall:parseInt(values.isPhoneCall),
                            dateResource:parseInt(values.dateResource.key),
                            upperOrganizationId:values.upperOrganizationId?parseInt(values.upperOrganizationId.value):null,
                            upperOrganizationName:values.upperOrganizationName,
                            suggestionName:String(values.suggestionName),
                            suggestionPhoneNumber:String(values.suggestionPhoneNumber),
                            organizationId:parseInt(values.organizationId.value),
                            organizationName:String(values.organizationId.label),
                            amputated:this.amputated,
                            isUse:parseInt(values.isUse.key),
                            windowId:values.windowId?parseInt(values.windowId.key):null,
                            windowName:values.windowId?String(values.windowId.label):null,
                            employeeId:this.windowStaff?parseInt(this.windowStaff.value):null,
                            employeeNo:this.windowStaff?parseInt(this.windowStaff.key):null,
                            employeeName:this.windowStaff?String(this.windowStaff.label):null,
                            content:values.content,
                            // attachmentList:this.fileList
                            attachmentList: this.fileList.map(item => ({
                                "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                                "fileName": item.response.data[0].fileName,//必填  文件名 string
                                "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                                url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                                    `${item.response.data[0].filePath}` :
                                    `/uploadFile${item.response.data[0].filePath}`,
                            }))
                        }
                        /*if(this.modifyId){
                          delete params.dateResource;
                        }*/
                        debugger
                        console.log(JSON.stringify(params))
                        const res = await formPost(this.modifyId, params);
                        if (res.success) {
                            this.$message.success('操作成功');
                            this.$emit('successCallback');
                        }
                        this.addLoading = false;
                    });
                }
            });
        },
    },
}
</script>

<style>
    .uploads .ivu-upload-input{
        display: none!important;
    }
</style>
