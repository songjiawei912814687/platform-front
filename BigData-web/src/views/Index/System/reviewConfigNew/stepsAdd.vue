<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :destroyOnClose="true"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='审批人类型'
                                fieldDecoratorId="approverType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择审批类型!' }]}"
                        >
                            <a-select placeholder='请选择审批人类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                                      @change="approverTypeChange">
                                <!--<a-select-option value='0'>用户账号</a-select-option>-->
                                <a-select-option value='1'>部门</a-select-option>
                                <a-select-option value='3'>角色</a-select-option>
                                <a-select-option value='5'>账号</a-select-option>

                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-show="approverType==='5'">
                        <a-form-item
                                label='员工'
                                fieldDecoratorId="employeesname"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择人员!' }]}">
                            <a-input :disabled="true" placeholder='请选择人员'
                                     style="width: 200px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: -120px; top: 28px;" type="primary"
                                  @click="staffSelect">选择
                        </a-button>
                    </a-col>

                    <a-col :span="24" v-show="approverType==='1'|| approverType === '3'">
                        <a-form-item
                                label='是否本部门'
                                fieldDecoratorId="isOne"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否本部门!' }]}"
                        >
                            <a-select placeholder='请选择'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                                      @change="isOneChange">
                                <a-select-option value='1'>是</a-select-option>
                                <a-select-option value='3'>否</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24" v-show="approverType==='1'">
                        <a-form-item
                                label='部门账号|部门分管领导'
                                fieldDecoratorId="depAccountOrLeadership"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否本部门!' }]}"
                        >
                            <a-select placeholder='请选择'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                                      @change="isOneChange">
                                <a-select-option value='1'>部门账号</a-select-option>
                                <a-select-option value='3'>部门分管领导</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24" v-show="(approverType==='1' || approverType === '3') && isOne==='3'">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择所属机构'
                                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-show="approverType==='3'">
                        <a-form-item
                                label='角色'
                                fieldDecoratorId="roleId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择角色!' }]}"
                        >
                            <a-select placeholder='请选择角色'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                            >
                                <a-select-option v-for="item in roleList"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>


                    <a-col :span="24">
                        <a-form-item
                                label='步骤'
                                fieldDecoratorId="successivelyLevel"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择职务!' }]}"
                        >
                            <a-select placeholder='请选择步骤'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                            >
                                <a-select-option v-for="item in levelLists"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入描述!'},{max:255,message:'最多105个字符！'}]}">
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
        Upload,
        Icon,
        DatePicker,
    } from 'ant-design-vue';
    import {autoDoFn} from '@/utils/util';
    import {formPost, getDetail} from '@/remote/approvalConfig';
    import StaffModal from '@/components/StaffModal1/StaffModal';

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;
    export default {
        name: 'stepsAdd',
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
            StaffModal
        },
        data() {
            return {
                imageUrl: '',
                addLoading: false,
                approverType: '',
                selectedRowKeys: [],
                selection: {},
                organizationId: '',
                levelLists: [],
                selectStaffVisible: false,
                isOne: '',
            };
        },
        props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList', 'roleList', 'jobList', 'levelList', 'approvalId'],
        computed: {
            title() {
                return this.modifyId ? '编辑' : '录入';
            },
        },
        watch: {
            addVisible() {
                this.imageUrl = '';
                this.levelLists = this.levelList
                if (this.modifyId) {
                    this.levelList.pop()
                    this.levelLists = this.levelList
                    console.log(this.levelList)
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            if (res.data.userId) {
                                this.selection.id = res.data.userId;
                            }
                            const {
                                approverType, employeesname, isOne, roleId, organizationId, userId,
                                jobsId, successivelyLevel, description, depAccountOrLeadership, organ1Name
                            } = res.data;
                            this.approverType = String(approverType);
                            this.isOne = String(isOne)
                            this.form.setFieldsValue({
                                description: description !== undefined ? description : '',
                                isOne: isOne !== undefined ? String(isOne) : '',
                                depAccountOrLeadership: depAccountOrLeadership !== undefined ? String(depAccountOrLeadership) : '',
                                successivelyLevel: successivelyLevel !== undefined ? String(successivelyLevel) : '',
                                employeesname: employeesname !== undefined ? employeesname : organ1Name,
                                jobsId: jobsId !== undefined ? String(jobsId) : '',
                                roleId: roleId !== undefined ? String(roleId) : '',
                                userId: String(userId) === undefined ? '' : String(userId),
                                approverType: String(approverType),
                                organizationId: organizationId !== undefined ? String(organizationId) : '',
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
                    if (err) {
                        autoDoFn(async () => {
                            this.addLoading = true;
                            const res = await formPost(this.modifyId, {
                                approvalId: this.approvalId,
                                userId: this.selection.id,
                                ...values,
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
            approverTypeChange(value) {
                this.approverType = value;

            },
            isOneChange(value) {
                this.isOne = value;
            },
            staffSelect() {
                const {id} = this.selection;
                this.selectedRowKeys = id ? [String(id)] : [];
                this.handleUpdateData('selectStaffVisible', true);
            },
            handleUpdateData(name, value) {
                this[name] = value;
            },
            handleSelectStaffOk(selectedRowKeys, selections) {
                if(selections[0]!==undefined){
                    this.selection = selections[0];
                this.form.setFieldsValue({
                    employeesname: selections[0].employeesName === undefined ? selections[0].username : selections[0].employeesName,
                    originalOrganizationId: selections[0].organizationId !== undefined ? String(selections[0].organizationId) : '',
                    originalJobId: selections[0].jobsId !== undefined ? String(selections[0].jobsId) : '',
                });
                }
                this.handleUpdateData('selectStaffVisible', false);
            },

        },

    };
</script>

<style scoped>

</style>
