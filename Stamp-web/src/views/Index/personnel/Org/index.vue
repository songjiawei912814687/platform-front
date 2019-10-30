<template>
    <div class="content-wrap">
        <h2 class="content__title">组织机构管理</h2>
        <!--<search-box @onSearch="handleSearch" @onReset="handleReset">-->
        <!--</search-box>-->
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_ORGANIZATION_ADD') > -1">录入
            </a-button>
        </div>
        <div class="content" style="top: 99px;">
            <a-table :columns="columns" :dataSource="data"
                     :rowKey="record => String(record.id)"
                     :loading="loading" :scroll="scroll" :pagination="false">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_ORGANIZATION_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_ORGANIZATION_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_ORGANIZATION_DELETE') > -1">
                         <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :staffList="staffList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
    </div>
</template>

<script>
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
        Modal,
        Drawer
    } from 'ant-design-vue';
    import {getPage, getDel,exportExcel} from '@/remote/org';
    import {getOrgTree, getEmployeesAll} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '组织机构名称',
            dataIndex: 'name',
            width: 900,
        },
        {
            title: '排序',
            dataIndex: 'displayOrder',
            width: 150,
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
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
            AModal: Modal,
            ADrawer: Drawer,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
        },
        data() {
            return {
                columns,
                addVisible: false,
                modifyId: '',
                data: [],
                viewVisible: false,
                searchParams: {
                    name: '',
                },
                loading: false,
                orgTreeData: [],
                staffList: [],
                scroll: {
                    y: document.documentElement.clientHeight - 310,
                    x: 1000,
                },
                orgId: '',
                authorityActionList: window.authorityActionList,
            };
        },
        created() {
            this.initBaseData();
            this.initList();
        },
        methods: {
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage({...this.searchParams});
                    if (res) {
                        this.data = res.data;
                    }
                    this.loading = false;
                });
            },
            initBaseData() {
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    console.log(orgRes)
                    if (orgRes) {
                        this.orgTreeData = [
                            {
                                label: '无',
                                value: '0',
                                key: '0',
                                children: transformTree(orgRes.data),
                            },
                        ];
                    }
                    console.log(this.orgTreeData)
                });
            },
            handleModifyShow(rowData) {
                this.handleDrawerToggle('addVisible', true);
                this.modifyId = rowData.id;

            },
            handleViewShow(rowData) {
                this.handleDrawerToggle('viewVisible', true);
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
                this.initBaseData();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    name: '',
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
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
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

        },
    };
</script>

<style lang="less">

</style>
