<template>
    <div class="content-wrap">
        <h2 class="content__title">人员管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="工号：">
                <a-input v-model="searchParams.employeeNo"/>
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
            <search-box-item label="组织机构：">
                <a-tree-select
                        style="width: 250px"
                        v-model="searchParams.organizationId"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        showSearch
                        treeNodeFilterProp="title"
                        treeDefaultExpandAll
                ></a-tree-select>
            </search-box-item>
            <search-box-item label="状态：">
                <a-select v-model="searchParams.state" style="width: 100%;" >
                <a-select-option value='1'>在职</a-select-option>
                <a-select-option value='3'>离职</a-select-option>
                <a-select-option value='0'>待入职</a-select-option>
                <a-select-option value=''>全部</a-select-option>
            </a-select>
            </search-box-item>
            <search-box-item label="职务：">
                <a-input v-model="searchParams.jobsName"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_ADD') > -1">录入
            </a-button>

            <a-button @click="handleLeaveShow" v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_QUIT') > -1">
                离职
            </a-button>
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_EXPORT') > -1">导出
            </a-button>

            <a-upload name="files"
                      :multiple="true"
                      action="/api-personnel/employees/importemployees"
                      :showUploadList="false"
                      @change="handleChange">
                <a-button :loading="uploadLoading"
                          v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_IMPORT') > -1">导入
                </a-button>
            </a-upload>
            <!--<a-button @click="handleDoolOpen('doolVisible', true)"-->
                      <!--v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SETUPACCESSCONTROL') > -1">设置门禁-->
            <!--</a-button>-->

            <a-button @click="handleDoolOpen('doolVisible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SETUPACCESSCONTROL') > -1">设置门禁
            </a-button>

            <a-button @click="handleFaceOpen('faceVisible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_FINGERPRINTFACE') > -1">指纹人脸
            </a-button>
            <a-button @click="handleCarOpen('carVisible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_VEHICLEMANAGEMENT') > -1">车辆管理
            </a-button>

            <a-button @click="handleFace2Open('face2Visible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_FINGERPRINTFACE') > -1">落地式人脸
            </a-button>

            <a-button @click="handleDoolOpen1('doolVisible1', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SETUPACCESSCONTROL1') > -1">设置门禁(一)
            </a-button>
            <a-button @click="handleDoolOpen2('doolVisible2', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SETUPACCESSCONTROL2') > -1">设置门禁(二)
            </a-button>


        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SUPPLEMENTARYCITIZENCARD') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handlePhysicalAddressShow(record)">补充市民卡</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_SUPPLEMENTARYLICENSEPLATENUMBER') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handlePlateNoShow(record)">补充车牌号</a>
                    </template>

                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_QUITING') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleLeavePerShow(record)">离职</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_EMPLOYEES_DELETE') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>

                    <!--<a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleDrawerToggle('leaveVisible', true)">离职</a>-->
                </span>
            </a-table>






            <div style="position: relative; left: 0px;top: -70px;width: 400px">
                <span style="margin: 20px 20px;">页/行</span>
                <a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;"
                          placeholder=''
                          :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option value = '10'>10/行</a-select-option>
                    <a-select-option value = '30'>30/行</a-select-option>
                    <a-select-option value = '50'>50/行</a-select-option>
                    <a-select-option value = '100'>100/行</a-select-option>
                </a-select>
                <span style="margin-left: 10px">共{{pagination.total}}条</span>
            </div>










        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :roleList="roleList"
             :windowList="windowList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <leave :leaveVisible="leaveVisible" @successCallback="handleLeaveSuccess"
               :modifyId="modifyId"
               :handleClose="() => handleDrawerToggle('leaveVisible', false)"
               @cancel="handleUpdateData('leaveVisible', false)"
        ></leave>

        <dool :doolVisible="doolVisible"
              :token="token"
              @cancel="handleUpdateData('doolVisible', false)"
              type="radio"
        >
        </dool>

        <dool1 :doolVisible="doolVisible1"
              :token="token"
              @cancel="handleUpdateData('doolVisible1', false)"
              type="radio"
        >
        </dool1>

        <dool2 :doolVisible="doolVisible2"
              :token="token"
              @cancel="handleUpdateData('doolVisible2', false)"
              type="radio"
        >
        </dool2>


        <car :doolVisible="carVisible"
              :token="token"
              @cancel="handleUpdateData('carVisible', false)"
              type="radio"
        >
        </car>
        <face :doolVisible="faceVisible"
              :token="token"
              @cancel="handleUpdateData('faceVisible', false)"
              type="radio"
        >
        </face>

        <face2 :doolVisible="face2Visible"
              :token="token"
              @cancel="handleUpdateData('face2Visible', false)"
              type="radio"
        >
        </face2>

        <physical-address :PhysicalAddressVisible="PhysicalAddressVisible"
                          :modifyId="modifyId"
                          @cancel="handleUpdateData('PhysicalAddressVisible', false)"
                          type="radio"
        ></physical-address>
        <plate-no :PlateNoVisible="PlateNoVisible"
                  :modifyId="modifyId"
                  @cancel="handleUpdateData('PlateNoVisible', false)"
                  type="radio"></plate-no>
    </div>
</template>

<script>
    import {message} from 'ant-design-vue';
    import {
        Row,
        Col,
        Input,
        Button,
        Table,
        Form,
        Select,
        DatePicker,
        Upload,
        Icon,
        Divider,
        Popconfirm,
        TreeSelect
    } from 'ant-design-vue';
    import {getPage, getDel, exportExcel} from '@/remote/staff';
    import {getOrgTree, getRoleAll, getToken} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import Leave from './Leave';
    import {autoDoFn, transformTree} from '@/utils/util';
    import {getIsTrue} from "../../../remote/dimission";
    import Dool1 from './Dool1'
    import Dool2 from './Dool2'
    import Dool from './Dool'
    import Face from './face'
    import Face2 from './face2'
    import Car from './Car'
    import PhysicalAddress from './PhysicalAddress'
    import PlateNo from './PlateNo'

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '工号',
            dataIndex: 'employeeNo',
            // fixed: 'left',
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            // fixed: 'left',
            width: 120,
        },
        {
            title: '组织机构',
            dataIndex: 'organizationName',
            width: 150,
        },
        {
            title: '职务',
            dataIndex: 'jobsName',
            width: 100,
        },
        {
            title: '入职时间',
            dataIndex: 'inductionDateTime',
            width: 120,
        },
        {
            title: '状态',
            dataIndex: 'stateName',
            width: 80,
        },
        {
            title: '操作',
            key: 'action',
            // fixed: 'right',
            width: 500,
            scopedSlots: {customRender: 'action'},
        },
    ];

    export default {
        name: 'Index',
        components: {
            AInput: Input,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATable: Table,
            AForm: Form,
            AFormItem: Item,
            ASelect: Select,
            ASelectOption: Option,
            ADatePicker: DatePicker,
            AUpload: Upload,
            AIcon: Icon,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            ATreeSelect: TreeSelect,
            SearchBox,
            SearchBoxItem,
            Add,
            Leave,
            DetailView,
            Dool,
            Dool1,
            Dool2,
            Face,
            Face2,
            Car,
            PhysicalAddress,
            PlateNo,


        },
        data() {
            return {
                timer: null,
                token: '',
                columns,
                addVisible: false,
                leaveVisible: false,
                viewVisible: false,
                doolVisible: false,
                doolVisible1: false,
                doolVisible2: false,
                PhysicalAddressVisible: false,
                faceVisible: false,
                face2Visible: false,
                carVisible: false,
                PlateNoVisible: false,
                uploadLoading: false,
                modifyId: '',
                hidden: false,
                data: [],
                searchParams: {
                    name: '',
                    employeeNo: '',
                    organizationName: '',
                    jobsName: '',
                    state:'1',
                },
                loading: false,
                roleList: [],
                windowList: [],
                orgTreeData: [],
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 1680,
                },
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                pagination: {
                    pageSize: '10',
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                },
                authorityActionList: window.authorityActionList,
            };
        },
        created() {
            this.getToken()
            this.initBaseData();
            this.initList();
        },
        methods: {
            onShowSizeChange() {
                this.pagination.rows = this.pagination.pageSize
                this.initList()
            },
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage({
                        ...this.searchParams,
                        ...this.pagination,
                    });
                    if (res) {
                        this.data = res.data.list;
                        this.pagination.total = res.data.total;
                        this.pagination.page = res.data.pageNum;
                        this.pagination.row = res.data.pageSize;
                    }
                    this.loading = false;
                });
            },
            initBaseData() {
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    if (orgRes) {
                        this.orgTreeData = transformTree(orgRes.data);
                    }
                    const roleRes = await getRoleAll();
                    if (roleRes) {
                        this.roleList = roleRes.data;
                    }
                });
            },
            handleModifyShow(rowData) {
                this.handleDrawerToggle('addVisible', true);
                this.modifyId = rowData.id;
            },
            handlePhysicalAddressShow(rowData) {
                this.handleDrawerToggle('PhysicalAddressVisible', true)
                this.modifyId = rowData.id
            },
            handlePlateNoShow(rowData) {
                this.handleDrawerToggle('PlateNoVisible', true)
                this.modifyId = rowData.id
            },
            handleViewShow(rowData) {
                this.handleDrawerToggle('viewVisible', true);
                this.modifyId = rowData.id;
            },
            handleLeaveShow() {

                autoDoFn(async () => {
                    const res = await getIsTrue();
                    if (res) {
                        this.handleDrawerToggle('leaveVisible', true);
                    }
                })

            },
            handleLeavePerShow(rowData) {


                this.handleDrawerToggle('leaveVisible', true);
                this.modifyId = rowData.id;

            },
            handleDrawerToggle(type, isVisible) {
                this[type] = isVisible;
                if (!isVisible) {
                    this.modifyId = '';
                }
            },
            handleAddSuccess() {
                this.handleDrawerToggle('addVisible', false);
                this.initList();
            },
            handleLeaveSuccess() {
                this.handleDrawerToggle('leaveVisible', false);
                this.initList();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    name: '',
                    employeeNo: '',
                    organizationName: '',
                    jobsName: '',
                    state:'1',
                };
                this.pagination = {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                };
                this.$nextTick(() => {
                    this.initList();
                });
            },
            handleDelete(data) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getDel(data);
                    if (res) {
                        this.$message.success('删除成功');
                        this.initList();
                    } else {
                        this.loading = false;
                    }
                });
            },
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            exportExcel() {
                autoDoFn(async () => {
                    let res = await exportExcel(this.searchParams);
                    if (res) {
                        window.open(`${res.data}`, '_blank')
                    }
                })
            },
            handleChange(e) {
                this.uploadLoading = true
                if (e.file.response.success) {
                    message.info("导入成功")
                    this.uploadLoading = false
                } else {
                    message.error(e.file.response.message)
                    this.uploadLoading = false
                }
                console.log(e)
            },
            handleUpdateData(name, value) {
                this[name] = value;
            },

            getToken() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getToken();
                    if (res) {
                        console.log(res)
                        this.token = res.data

                    }
                    this.loading = false;
                });
                setInterval(() => {
                    getToken()
                }, 40000)

            },

            handleDoolOpen(type, isVisible) {
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)

            },

            handleDoolOpen1(type, isVisible) {
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)

            },
            handleDoolOpen2(type, isVisible) {
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)

            },





            handleFaceOpen(type, isVisible){
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)
            },
            handleCarOpen(type, isVisible){
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)
            },
            handleFace2Open(type, isVisible){
                this.getToken()

                console.log(this.token)
                this.handleDrawerToggle(type, isVisible)
            },

        },

    };
</script>

<style lang="less">

</style>
