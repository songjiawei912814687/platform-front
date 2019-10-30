<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if='addVisible' @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='工号'
                                fieldDecoratorId="employeeNo"
                        >
                            <a-input placeholder='请输入工号' disabled/>
                        </a-form-item>
                        <a-form-item
                                label='姓名'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名!' },{ max: 55, message: '长度不大于55!' }]}"
                        >
                            <a-input placeholder='请输入姓名'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='头像'>
                            <a-upload
                                    v-if="!workingState || workingState === '0' || workingState === '1' || workingState === '3' "
                                    name="file"
                                    listType="picture-card"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    :data="{resourceType:1}"
                                    action="/upload"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                                    :style="{width: '125px', height: '125px'}"
                            >
                                <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
                                <div v-else>
                                    <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                                    <div class="ant-upload-text">上传头像</div>
                                </div>
                            </a-upload>
                            <div v-else style="width: 125px; height: 125px">
                                <img :src="imageUrl" style="width: 125px; height: 125px" alt="avatar"/>
                            </div>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='组织机构'-->
                                <!--fieldDecoratorId="organizationId"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }]}"-->
                        <!--&gt;-->
                            <!--<a-tree-select-->
                                    <!--:disabled="!!modifyId && workingState !== '0'"-->
                                    <!--style="width: 100%"-->
                                    <!--:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"-->
                                    <!--:treeData="orgTreeData"-->
                                    <!--placeholder='请选择所属机构'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                                    <!--@change="organizationChange"-->
                                    <!--showSearch-->
                                    <!--treeNodeFilterProp="title"-->
                                    <!--treeDefaultExpandAll-->
                            <!--&gt;</a-tree-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='职务'-->
                                <!--fieldDecoratorId="jobsId"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择职务!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select placeholder='请选择职务'-->
                                      <!--:disabled="!!modifyId && workingState !== '0'"-->
                                      <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                            <!--&gt;-->
                                <!--<a-select-option v-for="item in roleList"-->
                                                 <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                                                 <!--:value='String(item.id)' :key="item.id">-->
                                    <!--{{item.name}}-->
                                <!--</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item
                                label='身份证'
                                fieldDecoratorId="idCard"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入身份证!' }, { len: 18, message: '请输入正确身份证!' }]}"
                        >
                            <a-input placeholder='请输入身份证'
                                     @change="idCardChange"
                                     />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='出生日期'
                                fieldDecoratorId="dateBirth"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择出生日期!' }]}"
                        >
                            <a-date-picker placeholder='请选择出生日期' :disabledDate="disabledDate"
                                           style="width: 100%"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='人员类型'
                                fieldDecoratorId="windowState"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择人员类型!' }], initialValue: '0'}"
                        >
                            <a-select placeholder='请选择人员类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                                      @change="windowStateChange">
                                <a-select-option value='0'>后台</a-select-option>
                                <a-select-option value='1'>窗口</a-select-option>
                                <a-select-option value='2'>行政</a-select-option>
                                <a-select-option value='3'>其他</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='后台'-->
                                <!--fieldDecoratorId="office"-->
                                <!--:fieldDecoratorOptions="{-->
                                <!--trigger: 'input',-->
                                <!--validateTrigger: 'blur'-->
                                <!--}"-->
                        <!--&gt;-->
                            <!--<a-input placeholder='请输入后台'/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item
                                label='窗口号'
                                fieldDecoratorId="windowNo"
                        >
                            <a-input placeholder='请输入窗口号'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='性别'
                                fieldDecoratorId="sex"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择性别!' }]}"
                        >
                            <a-select placeholder='请选择性别'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                                <a-select-option value='0'>男</a-select-option>
                                <a-select-option value='1'>女</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='人员编制'-->
                                <!--fieldDecoratorId="userCompile"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择人员编制!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select placeholder='请选择人员编制'-->
                                      <!--:getPopupContainer="triggerNode => triggerNode.parentNode">-->
                                <!--<a-select-option value='0'>国家机关人员编制</a-select-option>-->
                                <!--<a-select-option value='1'>国家事业单位人员编制</a-select-option>-->
                                <!--<a-select-option value='2'>国家企业单位人员编制</a-select-option>-->
                                <!--<a-select-option value='3'>编外人员</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12" >-->
                        <!--<a-form-item-->
                                <!--label='是否考勤'-->
                                <!--fieldDecoratorId="attendanceState"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否考勤!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select placeholder='请选择是否考勤'-->
                                      <!--:disabled="(!!modifyId && String(adminLevel) !== '9')"-->
                                      <!--:getPopupContainer="triggerNode => triggerNode.parentNode">-->
                                <!--<a-select-option value='0'>是</a-select-option>-->
                                <!--<a-select-option value='1'>否</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='婚姻状态'-->
                                <!--fieldDecoratorId="maritalStatus"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择婚姻状态!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select-->
                                    <!--placeholder='请选择婚姻状态'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                            <!--&gt;-->
                                <!--<a-select-option value='0'>未婚</a-select-option>-->
                                <!--<a-select-option value='1'>已婚</a-select-option>-->
                                <!--<a-select-option value='2'>离异</a-select-option>-->
                                <!--<a-select-option value='3'>丧偶</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12" v-if="modifyId">
                        <a-form-item
                                label='入职日期'
                                fieldDecoratorId="inductionDateTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择入职日期!' }]}"
                        >
                            <a-date-picker placeholder='请选择入职日期'
                                           :disabledDate="disabledDate"
                                           :disabled="!!modifyId && workingState !== '0'"
                                           style="width: 100%"/>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='民族'-->
                                <!--fieldDecoratorId="national"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请输入民族!' },{ max: 55, message: '长度不大于20!' }]}"-->
                        <!--&gt;-->
                            <!--<a-input placeholder='请输入民族'/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='学历'-->
                                <!--fieldDecoratorId="recordOfFormalSchooling"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择学历!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select-->
                                    <!--placeholder='请选择学历'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                            <!--&gt;-->
                                <!--<a-select-option value='0'>博士</a-select-option>-->
                                <!--<a-select-option value='1'>硕士</a-select-option>-->
                                <!--<a-select-option value='2'>本科</a-select-option>-->
                                <!--<a-select-option value='3'>大专</a-select-option>-->
                                <!--<a-select-option value='4'>中专</a-select-option>-->
                                <!--<a-select-option value='5'>高中</a-select-option>-->
                                <!--<a-select-option value='6'>初中</a-select-option>-->
                                <!--<a-select-option value='7'>小学</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='政治面貌'-->
                                <!--fieldDecoratorId="partyMemberState"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择政治面貌!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select-->
                                    <!--placeholder='请选择政治面貌'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                                    <!--@change="partyMemberStateStateChange">-->
                                <!--<a-select-option value='1'>中共党员</a-select-option>-->
                                <!--<a-select-option value='2'>中共预备党员</a-select-option>-->
                                <!--<a-select-option value='3'>共青团员</a-select-option>-->
                                <!--<a-select-option value='4'>民主党派</a-select-option>-->
                                <!--<a-select-option value='5'>群众</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->


                    <!--<a-col :span="12"-->
                           <!--v-show="partyMemberStateState === '1' || partyMemberStateState === '2' "-->
                    <!--&gt;-->
                        <!--<a-form-item-->
                                <!--label='所属党支部'-->
                                <!--fieldDecoratorId="partyBranch"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: partyMemberStateState === '1' || partyMemberStateState === '2', message: '请选择政治面貌!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select-->
                                    <!--placeholder='请选择所属党支部'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                            <!--&gt;-->
                                <!--<a-select-option value='0'>请选择</a-select-option>-->
                                <!--<a-select-option value='1'>机关支部</a-select-option>-->
                                <!--<a-select-option value='2'>投资项目综合受理区支部</a-select-option>-->
                                <!--<a-select-option value='3'>社会事务综合受理区支部</a-select-option>-->
                                <!--<a-select-option value='4'>不动产登记综合受理区支部</a-select-option>-->
                                <!--<a-select-option value='5'>公安业务受理区支部</a-select-option>-->
                                <!--<a-select-option value='6'>商事登记综合受理区支部</a-select-option>-->
                                <!--<a-select-option value='7'>新登分中心支部</a-select-option>-->
                                <!--<a-select-option value='8'>场口分中心支部</a-select-option>-->
                                <!--<a-select-option value='9'>中心机关支部</a-select-option>-->
                                <!--<a-select-option value='10'>其他</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->

                    <!--<a-col :span="12"-->
                           <!--v-show="partyMemberStateState === '1' || partyMemberStateState === '2' ">-->
                        <!--<a-form-item-->
                                <!--label='入党日期'-->
                                <!--fieldDecoratorId="joinPartyDate"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: partyMemberStateState === '1' || partyMemberStateState === '2' , message: '请选择入党日期!' }]}"-->
                        <!--&gt;-->
                            <!--<a-date-picker placeholder='请选择入党日期'-->
                                           <!--style="width: 100%"/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='后备干部'-->
                                <!--fieldDecoratorId="reserveCadresState"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择后备干部!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select-->
                                    <!--placeholder='请选择是否后备干部'-->
                                    <!--:getPopupContainer="triggerNode => triggerNode.parentNode"-->
                            <!--&gt;-->
                                <!--<a-select-option value='1'>是</a-select-option>-->
                                <!--<a-select-option value='0'>否</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item
                                label='手机号码'
                                fieldDecoratorId="phoneNumber"
                                :fieldDecoratorOptions="{
                                rules: [
                                { required: true, message: '请输入手机号码!' },
                                { pattern: /^1\d{10}$/, message: '请输入正确手机号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入手机号码'/>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='办公电话'-->
                                <!--fieldDecoratorId="officePhone"-->
                                <!--:fieldDecoratorOptions="{rules: [{ max: 40, message: '长度不大于13!' }]}"-->
                        <!--&gt;-->
                            <!--<a-input placeholder='请输入办公电话'/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='市民卡号'-->
                                <!--fieldDecoratorId="citizenCards"-->
                                <!--:fieldDecoratorOptions="{rules: [{ max: 25, message: '长度不大于25!' }]}"-->
                        <!--&gt;-->
                            <!--<a-input placeholder='请输入市民卡号'-->
                                    <!--/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='市民卡银行卡号'-->
                                <!--fieldDecoratorId="bankCardNumber"-->
                                <!--:fieldDecoratorOptions="{rules: [{ max: 25, message: '长度不大于25!' }]}"-->
                        <!--&gt;-->
                            <!--<a-input placeholder='请输入市民卡银行卡号'-->
                                     <!--/>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->

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
    import {formPost, getDetail} from '@/remote/staff';
    import {getWindowAll} from '@/remote/base';
    import {autoDoFn} from '@/utils/util';
    import moment from 'moment';
    import defaultAvatar from '@/assets/defaultAvatar.png'

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;

    const fileType = {
        DOC: 10,
        TXT: 20,
        PPT: 30,
        HTM: 40,
        XLS: 50,
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
        props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList', 'roleList'],
        data() {
            return {
                addLoading: false,
                uploadLoading: false,
                imageUrl: '',
                configType: '',
                windowState: '0',
                organizationId: '',
                windowList: [],
                workingState: '',
                plateNoList: '',
                citizenCardPhysicalAddress: '',
                citizenCards: '',
                bankCardNumber: '',
                partyMemberStateState: '',
                adminLevel: localStorage.getItem('adminLevel'),
            };
        },
        computed: {
            title() {
                return this.modifyId ? '人员编辑' : '人员入职';
            },
        },
        watch: {
            addVisible() {
                console.log("1233"+(!!this.modifyId && String(this.adminLevel) === '9'))
                this.imageUrl = '';
                if (this.modifyId) {
                    console.log("2"+(this.modifyId || String(this.adminLevel) !== '9'))
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            const {
                                name, officePhone, organizationId,
                                phoneNumber, idCard, email, office, jobsId, dateBirth,
                                sex, employeeNo, userCompile, workingState, inductionDateTime,
                                maritalStatus, national, partyMemberState, recordOfFormalSchooling,
                                bankCardNumber, citizenCards, plateNo, reserveCadresState, windowId,
                                icon, windowState, attendanceState, joinPartyDate, partyBranch, citizenCardPhysicalAddress,windowNo
                            } = res.data;
                            this.workingState = String(workingState);
                            this.plateNoList = plateNo === undefined || plateNo === '' ? undefined : plateNo.split(',');
                            this.citizenCardPhysicalAddress = citizenCardPhysicalAddress !== undefined ? String(citizenCardPhysicalAddress) : "";
                            this.citizenCards = citizenCards !== undefined ? String(citizenCards) : "";
                            this.bankCardNumber = bankCardNumber !== undefined ? String(bankCardNumber) : "";
                            this.windowState = String(windowState);
                            this.organizationId = organizationId;
                            this.imageUrl = String(icon).length > 30 ? icon : defaultAvatar;

                            this.partyMemberStateState = String(partyMemberState);
                            this.form.setFieldsValue({
                                name,
                                officePhone,
                                joinPartyDate: moment(joinPartyDate),
                                organizationId: organizationId !== undefined ? String(organizationId) : '',
                                reserveCadresState: reserveCadresState !== undefined ? String(reserveCadresState) : '',
                                windowId: windowId !== undefined ? String(windowId) : '',
                                workingState: workingState !== undefined ? String(workingState) : '',
                                windowState: windowState !== undefined ? String(windowState) : '0',
                                attendanceState: attendanceState !== undefined ? String(attendanceState) : '',
                                partyBranch: partyBranch !== undefined ? String(partyBranch) : '0',
                                citizenCardPhysicalAddress: citizenCardPhysicalAddress !== undefined ? String(citizenCardPhysicalAddress) : '',
                                office,
                                phoneNumber,
                                idCard,
                                email,
                                jobsId: jobsId !== undefined ? String(jobsId) : '',
                                employeeNo,
                                bankCardNumber,
                                citizenCards,
                                windowNo,
                                plateNoList: plateNo === undefined || plateNo === '' ? undefined : plateNo.split(','),
                                recordOfFormalSchooling: recordOfFormalSchooling !== undefined ? String(recordOfFormalSchooling) : '',
                                partyMemberState: partyMemberState !== undefined ? String(partyMemberState) : '',
                                maritalStatus: maritalStatus !== undefined ? String(maritalStatus) : '',
                                national,
                                sex: sex !== undefined ? String(sex) : '',
                                userCompile: userCompile !== undefined ? String(userCompile) : '',
                                dateBirth: moment(dateBirth),
                                inductionDateTime: moment(inductionDateTime),
                            });
                        }
                        this.addLoading = false;
                    });
                } else {
                    this.workingState = '';
                }
            },
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if (!this.imageUrl) {
                            this.$message.error('请上传头像!');
                            return false;
                        }
                        autoDoFn(async () => {
                            this.addLoading = true;
                            const res = await formPost(this.modifyId, {
                                ...values,
                                dateBirth: values.dateBirth.format('YYYY-MM-DD'),
                                icon: this.imageUrl,
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
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    if (info.file.response.code === 0) {
                        this.imageUrl = `/uploadFile${info.file.response.data[0].filePath}`;
                    }
                    this.uploadLoading = false;
                }
            },
            beforeUpload(file) {
                const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isImg) {
                    this.$message.error('请上传.jpg或者.png格式的图片');
                }
                const arr = file.name.split('.');
                this.configType = fileType[arr[arr.length - 1].toUpperCase()] || 10;
                const isLt20K = file.size / 1024 < 20;
                if (isLt20K) {
                    this.$message.error('图片最小大小为20k!');
                }
                return isImg && !isLt20K;
            },
            disabledDate(current) {
                return current && current > moment().endOf('day');
            },
            idCardChange(e) {
                const value = e.target.value;
                if (value.length === 18) {
                    const date = `${value.slice(6, 10)}-${value.slice(10, 12)}-${value.slice(12, 14)}`;
                    this.form.setFieldsValue({
                        dateBirth: moment(date),
                    });
                }
            },
            organizationChange(value) {
                this.organizationId = value;
                if (this.windowState !== '1') {
                    this.form.setFieldsValue({
                        windowId: '',
                    });
                }
            },
            partyMemberStateStateChange(value) {
                this.partyMemberStateState = value;
                this.form.setFieldsValue({
                    partyBranch: '0',
                    joinPartyDate: '',
                });
            },
            windowStateChange(value) {
                this.windowState = value;
                this.form.setFieldsValue({
                    windowId: '',
                    office: '',
                });
            },
            handleselectChange(value) {
                console.log(`selected ${value}`);
            },
        },
    };
</script>

<style lang="less">
    .staff-add-form {
        .avatar-uploader > .ant-upload {
            width: 125px;
            height: 125px;
        }

        .ant-upload-select-picture-card i {
            font-size: 32px;
            color: #999;
        }

        .ant-upload-select-picture-card .ant-upload-text {
            margin-top: 8px;
            color: #666;
        }

        .ant-upload img {
            width: 105px;
            height: 105px;
        }
    }
</style>
