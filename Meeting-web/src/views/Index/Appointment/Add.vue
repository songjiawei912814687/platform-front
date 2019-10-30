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
                                label='会议主题'
                                fieldDecoratorId="theme"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入会议主题!' }]}">
                            <a-input placeholder='请输入会议主题'></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='会议室'
                                fieldDecoratorId="meetingRoomName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入会议室!' }],initialValue: room.name }">
                            <a-input placeholder='请选择会议室' :disabled="true"></a-input>
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
                                <a-select-option v-for="item in meetingTime" :key="item.value" :value="item.value">{{item.name}}
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
                                <a-select-option v-for="item in meetingTime"
                                                 :key="item.value"
                                                 v-if="parseInt(item.value) > parseInt(startDateTime)"
                                                 :value="item.value">{{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                                label='会议实际开始时间'
                                fieldDecoratorId="realStartTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择会议实际开始时间!' }]}">
                            <a-time-picker @change="handleStartTimeChange" format="HH:mm" style="width: 100%;"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='主办单位'
                                fieldDecoratorId="hostUnit"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入主办单位!' }],initialValue: organizationName === undefined || organizationName === 'undefined' ? '' : organizationName}">
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

                    <a-col :span="12">
                        <a-form-item
                                label='与会人数'
                                fieldDecoratorId="meetingNumber"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入与会人数!' }]}">
                            <a-input placeholder='请输入与会人数' v-model="meetingNumber"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='与会人员'
                                fieldDecoratorId="attendantsName"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择与会人员!' }]}">
                            <a-input :disabled="true" placeholder='请选择与会人员'
                                     style="width: 460px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 85px; top: 28px;" type="danger"
                                  @click="clearStaffSelect">清空
                        </a-button>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary"
                                  @click="staffSelect">选择
                        </a-button>
                    </a-col>
                    <!--<a-col :span="24">-->
                        <!--<a-form-item-->
                                <!--label='退休人员'-->
                                <!--fieldDecoratorId="retireesName"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: false, message: '请选择与会人员!' }]}">-->
                            <!--<a-input :disabled="true" placeholder='请选择退休人员'-->
                                     <!--style="width: 460px;margin-right: 15px"></a-input>-->
                        <!--</a-form-item>-->
                        <!--<a-button style="position: absolute; right: 85px; top: 28px;" type="danger"-->
                                  <!--@click="clearAddressSelect">清空-->
                        <!--</a-button>-->
                        <!--<a-button style="position: absolute; right: 12px; top: 28px;" type="primary"-->
                                  <!--@click="addressSelect">选择-->
                        <!--</a-button>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item
                                label='多媒体投影'
                                fieldDecoratorId="isNeedNeetwork"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否需要多媒体投影!' }]}"
                        >
                            <a-select placeholder='请选择是否需要多媒体投影'>
                                <a-select-option value='0'>否</a-select-option>
                                <a-select-option value='1'>是</a-select-option>
                            </a-select>
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
                       :organTree="orgTreeData"
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
    import {formPost, getDetail, getOrgTree} from '@/remote/appointment';
    import {autoDoFn, transformTree2} from '@/utils/util';
    import StaffModal from '@/components/StaffModal/StaffModal';
    import {meetingTime} from '@/common/dictData';
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
        props: ['addVisible', 'handleClose', 'modifyId', 'staffList', 'realStartTime','startDateTime', 'room', 'meetingDate'],
        data() {
            return {
                addLoading: false,
                selectedRowKeys: [],
                addressSelectedRowKeys: [],
                selectedAddressRowKeys: [],
                roomSelectedRowKeys: [],
                selections: [],
                endDateTime: '',
                addressSelections: [],
                roomSelection: {},
                selectAddressVisible: false,
                selectStaffVisible: false,
                selectRoomVisible: false,
                meetingNumber:'',
                meetingTime,
                orgTreeData: [],
                employeesName: localStorage.getItem('employeesName')  === undefined || localStorage.getItem('employeesName')  === 'undefined' ? localStorage.getItem('userName') : localStorage.getItem('organName'),
                organizationName: localStorage.getItem('organName') === undefined || localStorage.getItem('organName') === 'undefined' ? localStorage.getItem('userName') : localStorage.getItem('organName'),
                configType: 1,
                uploadLoading: false,
                fileList: [],
            };
        },
        computed: {
            title() {
                return this.modifyId ? '会议预约编辑' : '会议预约录入';
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
                                    hostUnit, attachmentList,realStartTime,meetingNumber,
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
                                    realStartTime:moment(realStartTime,'HH:mm'),
                                    meetingNumber,
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
        },
        methods: {
            handleSubmit(e) {
                console.log(this.endDateTime)
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
                                realStartTime:values.realStartTime.format("HH:mm"),
                                meetingRoomId: this.room.id,
                                meetingNumber:values.meetingNumber,
                                organizationId: localStorage.getItem('organId'),
                                employeesId: localStorage.getItem('employeeId'),
                                endDateTime: Number(this.endDateTime),
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
            // 开始时间修改
            handleStartTimeChange(date) {
                let realStartTime = date.format("HH:mm");
                console.log(realStartTime);
                this.form.setFieldsValue({
                    realStartTime: String(realStartTime),
                });
            },
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
            // 日期限制
            disabledDate(currentDate) {
                if (!currentDate) {
                    return false;
                }
                return moment(currentDate.format('YYYY-MM-DD')).valueOf() < moment(moment().format('YYYY-MM-DD')).valueOf();
            },
            //选择人员
            handleSelectStaffOk(selectedRowKeys, selections) {
                const oldSelectionKeys = this.selections.map(item => String(item.id));
                const newSelections = selections.filter(item => oldSelectionKeys.indexOf(String(item.id)) === -1);
                const allSelections = [...this.selections, ...newSelections];
                this.selections = allSelections;
                this.form.setFieldsValue({
                    attendantsName: allSelections.map(item => item.name).join(','),
                });
                this.selectStaffVisible = false;
            },

            handleSelectAddressOk(addressSelectedRowKeys, selections) {
              const oldSelectionKeys = this.addressSelections.map(item => String(item.id));
              const newSelections = selections.filter(item => oldSelectionKeys.indexOf(String(item.id)) === -1);
              const allSelections = [...this.addressSelections, ...newSelections];
                this.addressSelections = allSelections;
                this.form.setFieldsValue({
                    retireesName: allSelections.map(item => item.name).join(','),
                });
                this.selectAddressVisible = false;
            },

            staffSelect() {
                this.selectedRowKeys = [];
              //this.selections.map(item => String(item.id));
                this.selectStaffVisible = true;
            },
            addressSelect() {
                this.addressSelectedRowKeys = []
              //this.addressSelections.map(item => String(item.id));
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
            // 清空人员
            clearStaffSelect() {
                this.selectedRowKeys = [];
                this.selections = [];
                this.form.setFieldsValue({
                  attendantsName: '',
                });
            },
            clearAddressSelect() {
                this.addressSelectedRowKeys = [];
                this.addressSelections = [];
              this.form.setFieldsValue({
                retireesName: '',
              });
            }
        },
    };
</script>

<style lang="less">

</style>
