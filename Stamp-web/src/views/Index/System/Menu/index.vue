<template>
    <div class="content-wrap">
        <h2 class="content__title">菜单管理</h2>
        <!--<search-box @onSearch="handleSearch" @onReset="handleReset">-->
        <!--</search-box>-->
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('M_STAMP_SYSTEMSETTINGS_MENUMANAGEMENT_ADD') > -1">录入</a-button>
        </div>
        <div class="content" style="top: 100px;">
            <a-table :columns="columns" :dataSource="data"
                     :rowKey="record => String(record.id)"
                     :loading="loading" :scroll="scroll" :pagination="false">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('M_STAMP_SYSTEMSETTINGS_MENUMANAGEMENT_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEMSETTINGS_MENUMANAGEMENT_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEMSETTINGS_MENUMANAGEMENT_DELETE') > -1">
                         <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template >
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="action(record)" v-if="authorityActionList.indexOf('M_STAMP_SYSTEMSETTINGS_MENUMANAGEMENT_ACTIONMANAGEMENT') > -1">动作管理</a>
                    </template>

                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>

        <action-index :actionVisible="actionVisible"
                      :menuId="menuId"
                      :handleClose="() => handleDrawerToggle('actionVisible', false)">

        </action-index>

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
    } from 'ant-design-vue';
    import { getPage, getDel } from '@/remote/menu';
    import { getTree } from '@/remote/menu';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import { autoDoFn, transformTree } from '@/utils/util';
    import ActionIndex from './actionIndex'
import { constants } from 'fs';

    const { Item } = Form;
    const { Option } = Select;

    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            width: 1500,
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
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
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
            ActionIndex
        },
        data() {
            return {
                columns,
                addVisible: false,
                modifyId: '',
                data: [],
                viewVisible: false,
                actionVisible: false,
                menuId: '',
                searchParams: {
                    name: '',
                },
                loading: false,
                orgTreeData: [],
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
                    const res = await getPage({ ...this.searchParams });
                    if (res) {
                        this.data = res.data;
                    }
                    this.loading = false;
                });
            },
            initBaseData() {
                autoDoFn(async () => {
                    const orgRes = await getTree();
                    if (orgRes) {
                        this.orgTreeData = [
                            {
                                label: '无',
                                value: '0',
                                key: '0',
                                children: transformTree(orgRes.data),
                            },
                        ];
                        console.log("orgTreeData"+this.orgTreeData)
                    }

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
                        this.initBaseData();
                        this.initList();
                    }else{
                        this.loading = false;
                    }
                });
            },
            action(data){
                this.handleDrawerToggle('actionVisible',true)
                this.menuId = data.id
            }


        },
    };
</script>

<style lang="less">

</style>
