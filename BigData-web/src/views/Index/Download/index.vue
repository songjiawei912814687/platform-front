<template>
    <div class="content-wrap">


        <h2 class="content__title">下载中心</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="标题：">
                <a-input v-model="searchParams.title" placeholder="请输入标题"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_SYSTEM_DOWNLOADCENTER_DOWNLOADCENTER_ADD') > -1"
            >录入
            </a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">

                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_VIEW') > -1">查看</a>
                    <template >
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)" v-if="authorityActionList.indexOf('A_SYSTEM_DOWNLOADCENTER_DOWNLOADCENTER_EDITOR') > -1">编辑</a>
                    </template>


                    <template >
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认" cancelText="取消">
                            <a href="javascript:;" v-if="authorityActionList.indexOf('A_SYSTEM_DOWNLOADCENTER_DOWNLOADCENTER_DELETE') > -1">删除</a>
                        </a-popconfirm>
                    </template>


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
        <!--新增-->
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             @cancel="handleDrawerToggle('addVisible', false)"
        ></add>
        <!--详情-->
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     @cancel="() => handleDrawerToggle('viewVisible', false)"></detail-view>

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
    import { getDownPage, getDel} from '@/remote/download';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import DetailView from './DetailView';
    import {autoDoFn,transformTree} from '@/utils/util';
    import Add from './Add'

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            width: 400,
        },
        {
            title: '发布状态',
            dataIndex: 'discription',
            width: 100,
        },
        {
            title: '发布时间',
            dataIndex: 'createdDateTime',
            width: 100,
        },

        {
            title: '操作',
            key: 'action',
            width: 100,
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
            SearchBox,
            SearchBoxItem,
            DetailView,
            Add
        },
        data() {
            return {
                columns,
                viewVisible: false,
                modifyId: '',
                data: [],
                addVisible: false,
                searchParams: {
                    name: '',
                    windowNo: '',
                },
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 1000,
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
                    const res = await getDownPage({
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
            },

            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    username: '',
                    name: '',
                    userType: ''
                };
                this.pagination = {
                    defaultCurrent: 1,
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





        },
    };
</script>

<style lang="less">

</style>
