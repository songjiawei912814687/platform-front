<template>
    <Drawer v-model="actionVisible"
            @on-close="handleClose"
            :maskClosable="false"
            :destroyOnClose="true"
            :width="650"
            title="动作管理">
        <a-spin tip="正在加载中..." :spinning="loading">
            <div class="action">
                <a-button @click="add('actionAddVisible', true)" >录入</a-button>
            </div>
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>


                    <template>
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </span>
            </a-table>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
        </div>
        <action-add :actionAddVisible="actionAddVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :menuId="menuId"
             @cancel="handleUpdateData('actionAddVisible', false)"
             ></action-add>

        <action-detail-view :actionDetailView="actionDetailView"
                            :modifyId="modifyId"
                            @cancel="handleUpdateData('actionDetailView', false)"
                            ></action-detail-view>
    </Drawer>
</template>

<script>
    import {
        Row,
        Col,
        Button,
        Table,
        DatePicker,
        Upload,
        Icon,
        Spin,
        Drawer,
        Divider,
        Popconfirm,
    } from 'ant-design-vue';
    import {getPage, getDel} from '@/remote/action';
    import {getTree} from '@/remote/menu';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import {autoDoFn, transformTree} from '@/utils/util';
    import ActionAdd from './ActionAdd'
    import ActionDetailView from './ActionDetailView'


    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: 100,
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
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATable: Table,
            ADatePicker: DatePicker,
            AUpload: Upload,
            AIcon: Icon,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            ADrawer: Drawer,
            ASpin: Spin,
            SearchBox,
            SearchBoxItem,
            ActionAdd,
            ActionDetailView
        },
        props: ['actionVisible', 'handleClose', 'menuId', 'orgTreeData'],
        data() {
            return {
                columns,
                actionAddVisible: false,
                actionDetailView: false,
                modifyId: '',
                data: [],
                viewVisible: false,
                loading: false,
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
                scroll: {
                    y: document.documentElement.clientHeight - 310,
                    x: 1000,
                },

                orgId: '',
                authorityActionList: window.authorityActionList,
            };
        },
        created() {
        },
        watch: {
            actionVisible() {
                this.initList();

            },
        },
        methods: {
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage({menuId: this.menuId,...this.pagination,});
                    if (res) {
                        this.data = res.data.list;
                    }
                    this.loading = false;
                });
            },


            handleModifyShow(rowData) {
                this.handleDrawerToggle('actionAddVisible', true);
                this.modifyId = rowData.id;
            },
            handleViewShow(rowData) {
                this.handleDrawerToggle('actionDetailView', true);
                this.modifyId = rowData.id;
            },
            handleDrawerToggle(type, isVisible) {
                this[type] = isVisible;
                if (!isVisible) {
                    this.modifyId = '';
                }
            },
            handleAddSuccess() {
                this.initList();
                this.initBaseData();
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
            handleUpdateData(name, value) {
                this[name] = value;
            },
            handleSelectStaffOk(){
                this.initList();
            },
            add(type, isVisible){
                this.modifyId = ''
                this.handleDrawerToggle(type,isVisible)
            }


        },
    };
</script>

<style lang="less">

</style>
