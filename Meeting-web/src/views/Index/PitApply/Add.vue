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
                                label='开评标主题'
                                fieldDecoratorId="theme"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入开评标主题!' }]}">
                            <a-input placeholder='请输入开评标主题'></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='开评标室'
                                fieldDecoratorId="meetingRoomName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入开评标室!' }],initialValue: room.name }">
                            <a-input placeholder='请选择开评标室' :disabled="true"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='预约日期'
                                fieldDecoratorId="appointmentDate"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择预约日期!'}],initialValue: momentMeetingDate}">
                            <a-date-picker :disabled="true" :disabledDate="disabledDate" placeholder='请选择预约日期'
                                           style="width: 100%"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='开始时间'
                                fieldDecoratorId="startDateTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择开始时间!' }],initialValue: startDateTime}">
                            <a-select :disabled="!modifyId">
                                <a-select-option v-for="item in meetingTime1" :key="item.value" :value="item.value">{{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='结束时间'
                                fieldDecoratorId="endDateTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择结束时间!' }]}">
                            <a-select v-model="endDateTime">
                                <a-select-option v-for="item in meetingTime1"
                                                 :key="item.value"
                                                 v-if="parseInt(item.value) > parseInt(startDateTime)"
                                                 :value="item.value">{{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='主办单位'
                                fieldDecoratorId="hostUnit"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入主办单位!' }],initialValue: organizationName}">
                            <a-input placeholder='请输入主办单位'></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='预约部门'
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入预约部门!' }]}">
                            <a-input placeholder='请选择预约部门' v-model="organizationName" :disabled="true"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='预约人'
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入预约人!' }]}">
                            <a-input placeholder='请选择预约人' v-model="employeesName" :disabled="true"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='与会人员'
                                fieldDecoratorId="attendantsName"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择与会人员!' }]}">
                            <a-input :disabled="true" placeholder='请选择与会人员'
                                     style="width: 520px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary"
                                  @click="staffSelect">选择
                        </a-button>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入描述!'},{max:255,message:'最多255个字符！'}]}">
                            <a-text-area placeholder='请输入描述' style="height: 150px"/>
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
                                      :data="{resourceType:1}"
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
                     type="checkbox"
        ></staff-modal>
        <address-modal :membersVisible="selectAddressVisible"
                       :propsSelectedRowKeys="selectedRowKeys"
                       @cancel="handleUpdateData('selectAddressVisible', false)"
                       @ok="handleSelectAddressOk"
                       type="checkbox"
        >

        </address-modal>
        <room-modal :membersVisible="selectRoomVisible"
                    :propsSelectedRowKeys="roomSelectedRowKeys"
                    @cancel="handleUpdateData('selectRoomVisible', false)"
                    @ok="handleRoomSelectStaffOk"
                    type="radio"
        ></room-modal>
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
        TimePicker,
    } from 'ant-design-vue';
    import {formPost, getDetail} from '@/remote/pitapply';
    import {getOrgTree} from '@/remote/appointment';
    import {autoDoFn, transformTree2} from '@/utils/util';
    import StaffModal from '@/components/StaffModal/StaffModal';
    import {meetingTime1} from '@/common/dictData';
    import moment from 'moment';
    import RoomModal from './RoomModal';
    import AddressModal from '@/components/StaffModal/AddressModal'

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;

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
            ATimePicker: TimePicker,
            StaffModal,
            RoomModal,
            AddressModal
        },
        props: ['addVisible', 'handleClose', 'modifyId', 'staffList', 'startDateTime', 'room', 'meetingDate'],
        data() {
            return {
                addLoading: false,
                selectedRowKeys: [],
                addressSelectedRowKeys: [],
                selectedAddressRowKeys: [],
                roomSelectedRowKeys: [],
                selections: [],
                addressSelections: [],
                roomSelection: {},
                selectAddressVisible: false,
                selectStaffVisible: false,
                selectRoomVisible: false,
                meetingTime1,
				endDateTime: '',
                orgTreeData: [],
                employeesName: localStorage.getItem('employeesName'),
                organizationName: localStorage.getItem('organName'),
                configType: 1,
                uploadLoading: false,
                fileList: [],
            };
        },
        computed: {
            title() {
                return this.modifyId ? '开评标室预约编辑' : '开评标室预约录入';
            },
            momentMeetingDate() {
                return moment(this.meetingDate)
            },
        },
        watch: {
            addVisible() {
                this.initOrganData()
                if (this.addVisible) {
                    if (this.modifyId) {
                        autoDoFn(async () => {
                            this.addLoading = true;
                            const res = await getDetail({id: this.modifyId});
                            if (res) {
                                const {
                                    attendants, attendantsName, description,
                                    startDateTime, endDateTime, theme, organizationId,
                                    employeesId, appointmentDate, meetingRoomId,
                                    hostUnit, attachmentList,
                                    roomName, isNeedNeetwork,retirees,retireesName
                                } = res.data;
                                if(attendants){
                                    this.selections = attendants.split(",").map((item, index) => ({
                                        id: item,
                                        name: attendantsName.split(';')[index].split(',')[1]
                                    }));
                                }
                                if(retirees){
                                    this.addressSelections = retirees.split(",").map((item, index) => ({
                                        id: item,
                                        name: retireesName.split(";")[index].split(',')[1]
                                    }))
                                }
                                this.roomSelection = {
                                    id: meetingRoomId,
                                    name: roomName,
                                };
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
                                this.form.setFieldsValue({
                                    isNeedNeetwork: String(isNeedNeetwork) === undefined ? '0' : String(isNeedNeetwork),
                                    theme,
                                    attendantsName: attendantsName ? attendantsName.split(';').map(item => {
                                        return item.split(",")[1]
                                    }).join(',') : '',
                                    retireesName: retireesName ?  retireesName.split(';').map(item => {
                                        return item.split(",")[1]
                                        }).join(',') : '',
                                    startDateTime: String(startDateTime),
                                    endDateTime: String(endDateTime),
                                    description,
                                    hostUnit,
                                    appointmentDate: moment(appointmentDate),
                                });
                            }
                            this.addLoading = false;
                        });
                    } else {
                        this.selections = [];
                        this.roomSelection = {};
                        this.fileList = [];
                    }
                }
            },
        },
        mounted() {
          console.log(this.orgTreeData);
            // this.initOrganData();
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if (window.parseInt(values.startDateTime) >= window.parseInt(values.endDateTime)) {
                            this.$message.error("结束时间必须大于开始时间!");
                            return false;
                        }
                        autoDoFn(async () => {
                            this.addLoading = true;
                            console.log(this.fileList);
                            const res = await formPost(this.modifyId, {
                                ...values,
                                attendants: this.selections.map(item => item.id).join(","),
                                retirees: this.addressSelections.map(item => item.id).join(","),
                                appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
                                meetingRoomId: this.room.id,
								endDateTime: Number(this.endDateTime) ,
                                organizationId: localStorage.getItem('organId'),
                                employeesId: localStorage.getItem('employeeId'),
                                attachmentList: this.fileList.map(item => ({
                                    "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                                    "fileName": item.response.data[0].fileName,//必填  文件名 string
                                    "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                                    url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                                        `${item.response.data[0].filePath}` :
                                        `/uploadFile${item.response.data[0].filePath}`,
                                }))
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
            // 日期限制
            disabledDate(currentDate) {
                if (!currentDate) {
                    return false;
                }
                return moment(currentDate.format('YYYY-MM-DD')).valueOf() < moment(moment().format('YYYY-MM-DD')).valueOf();
            },
            //选择人员
            handleSelectStaffOk(selectedRowKeys, selections) {
                this.selections = selections;
                this.form.setFieldsValue({
                    attendantsName: selections.map(item => item.name).join(','),
                });
                this.selectStaffVisible = false;
            },

            handleSelectAddressOk(addressSelectedRowKeys, selections) {
                this.addressSelections = selections;
                this.form.setFieldsValue({
                    retireesName: selections.map(item => item.name).join(','),
                });
                this.selectAddressVisible = false;
            },

            staffSelect() {
                this.selectedRowKeys = this.selections.map(item => String(item.id));
                this.selectStaffVisible = true;
            },
            addressSelect() {
                this.addressSelectedRowKeys = this.addressSelections.map(item => String(item.id));
                this.selectAddressVisible = true;
            },
            handleUpdateData(name, value) {
                this[name] = value;
            },
            // 选择会议室
            roomSelect() {
                this.selectRoomVisible = true;
            },
            handleRoomSelectStaffOk(selectedRowKeys, selections) {
                this.roomSelection = selections[0];
                this.form.setFieldsValue({
                    meetingRoomName: selections[0].name,
                });
                this.selectRoomVisible = false;
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
                const arr = file.name.split('.');
                this.configType = fileType[arr[arr.length - 1].toUpperCase()] || 10;
                return true;
            },
        },
    };
</script>

<style lang="less">

</style>
