<template>
    <div class="content-wrap">
        <h2 class="content__title">问题解答</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="问题标题：">
                <a-input v-model="searchParams.title"/>
            </search-box-item>
            <search-box-item label="所属机构：">
                <a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="organTree"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构' treeDefaultExpandAll :rowKey="record => String(record.id)" v-model="searchParams.organizationId"
                               :allowClear="true"></a-tree-select>
            </search-box-item>
            <search-box-item label="问题类型：">
                <a-select v-model="searchParams.type" placeholder="请选择问题类型" style="width: 100%;">
                    <a-select-option value=''>全部 </a-select-option>
                    <a-select-option value='25'>个人办事类</a-select-option>
                    <a-select-option value='24'>企业开办类</a-select-option>
                    <a-select-option value='23'>项目审批类</a-select-option>
                    <a-select-option value='155'>其他类</a-select-option>
                </a-select>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_CONSULTINGQUESTIONS_ADD') > -1">录入</a-button>
            <a-button @click="exportExcel"
                      v-if="authorityActionList.indexOf('A_KNOWLEDGE_CONSULTINGQUESTIONS_EXPORT') > -1">
                导出
            </a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="opens"  slot-scope="text, record">
                    <a-switch  v-model="record.isOpen" @change="changeOpen(parseInt(record.id),record.isOpen)"
                               :disabled= "String(record.organizationId)!==String(orgId)&&String(username) !=='中心机关'"/>
                </span>
                <span slot="stick"  slot-scope="text, record">
                    <a-switch :disabled="String(record.createdUserName) !== String(createdUserName)"
                              v-model="record.isTop" @change="changeTop(parseInt(record.id),record.isTop)"/>
                </span>
                <span slot="release"  slot-scope="text, record">
                    <a-popconfirm title="发布后不可撤回，请确认" @confirm="changeRelease(parseInt(record.id),record.state)"
                                  okText="确认"
                                  @cancel="cancelRelease" cancelText="取消">
                    <a-switch :disabled="String(record.createdUserName) !== String(createdUserName)" v-if="record.state !== 1" v-model="record.state"/>
                    </a-popconfirm>
                    <span v-if="record.state === 1">已发布</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleModifyShow(record)"  v-if="authorityActionList.indexOf('A_KNOWLEDGE_CONSULTINGQUESTIONS_EDITOR') > -1
                                            && (String(record.organizationId)===String(orgId)||String(username) ==='中心机关')">编辑</a>
                    <a-divider type="vertical" v-if = "String(record.organizationId)===String(orgId)||String(username) ==='中心机关'"/>
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_CONSULTINGQUESTIONS_VIEW') > -1">查看</a>
                    <a-divider type="vertical" v-if = "String(record.organizationId)===String(orgId)||String(username) ==='中心机关'"/>
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                  cancelText="取消">
                        <a href="javascript:;" v-if="authorityActionList.indexOf('A_KNOWLEDGE_CONSULTINGQUESTIONS_DELETE') > -1 &&
                                (String(record.organizationId)===String(orgId)||String(username) ==='中心机关')">删除</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if = "String(record.organizationId)===String(orgId)||String(username) ==='中心机关'"/>
                    <a href="javascript:;" v-if="String(record.organizationId) === String(organId)" @click="handleAnswerShow(record)">回答</a>

                    <a-divider type="vertical" v-if = "String(record.organizationId)===String(orgId)||String(username) ==='中心机关'"/>
                    <a-popconfirm type="vertical" title="确认要发送答案给提问人?" @confirm="handleSend(record)" okText="确认"
                                  cancelText="取消">
                        <a href="javascript:;" v-if="(String(record.organizationId)===String(orgId)||String(username) ==='中心机关')">发送答案</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if = "String(record.organizationId)===String(orgId)||String(username) ==='中心机关'"/>
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
             :QuestionType="QuestionType"
             :organTree="organTree"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>

        <answer :answerVisible="answerVisible"
                @successCallback="handleAnswerSuccess"
                :modifyId="modifyId"
                :QuestionType="QuestionType"
                :organTree="organTree"
                :handleClose="() => handleDrawerToggle('answerVisible', false)"
        >

        </answer>
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
        Switch,
        TreeSelect
    } from 'ant-design-vue';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';
    import {getPage, getDel, setOpen, setTop, getQuestionType, setRelese,exportExcel,sendAnswer} from '@/remote/refer';
    import {getOrgTree} from "@/remote/base";
    import Answer from './Answer'


    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '问题',
            width: 300,
            dataIndex: 'title',
            // fixed: 'left',
        },
        // {
        //     title: '回答',
        //     dataIndex: 'description',
        // },

        {
            title: '所属组织',
            width: 150,
            dataIndex: 'organizationName'
        },
        {
            title: '问题类型',
            width: 150,
            dataIndex: 'typeName'
        },
        {
            title: '是否回答',
            width: 150,
            dataIndex: 'answerStateName',
        },
        {
            title: '发布',
            width: 150,
            key: 'opens',
            scopedSlots: {customRender: 'release'},
        },
        {
            title: '是否公开',
            width: 150,
            key: 'opens',
            scopedSlots: {customRender: 'opens'},
        },
        {
            title: '是否置顶',
            width: 150,
            key: 'stick',
            scopedSlots: {customRender: 'stick'},
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            // fixed: 'right',
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
            ASwitch: Switch,
            ATreeSelect: TreeSelect,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
            Answer
        },
        data() {
            return {
                columns,
                addVisible: false,
                viewVisible: false,
                answerVisible: false,
                organTree: [],
                modifyId: '',
                orgTreeData: [],
                data: [],
                organizationId:localStorage.getItem("localStorage"),
                organId: localStorage.getItem("organId"),
				createdUserName: localStorage.getItem("userName"),
                QuestionType: [],
                classifyList: [],
                searchParams: {
                    title: '',
                    organizationId: '',
                    type:'',
                    askName:'',
                    askTel:'',
                },
                orgId: localStorage.getItem("organId"),
                username:localStorage.getItem("userName"),
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: true,
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
            this.initgetQuestionType();
            this.initOrganTree();

        },

        initBaseData() {
            autoDoFn(async () => {
                const orgRes = await getOrgTree();
                if (orgRes) {
                    if(orgRes.data.length==0){
                        this.orgTreeData = transformTree([{'id':localStorage.organId,'name':localStorage.organName}]);
                    }else{
                        this.orgTreeData = transformTree(orgRes.data);
                    }
                }
            });
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
            initgetQuestionType() {
                autoDoFn(async () => {
                    const res = await getQuestionType();
                    if (res) {
                        this.QuestionType = res.data
                    }
                })
            },

            exportExcel() {
                autoDoFn(async () => {
                    let res = await exportExcel({
                        ...this.searchParams,
                    });
                    if (res) {
                        window.open(`${res.data}`, '_blank')
                    }
                })
            },
            initOrganTree() {
                autoDoFn(async () => {
                    const res = await getOrgTree();
                    if (res) {
                        this.organTree = transformTree(res.data)
                    }
                })
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
            handleLeaveSuccess() {
                this.handleDrawerToggle('leaveVisible', false);
                this.initList();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    title: '',
                    organizationId:'',
                    type:'',
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
                    }
                    this.loading = false;
                });
            },

            handleSend(data) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await sendAnswer(data);
                    console.log("id:"+ this.data.id);
                    if (res) {

                        this.$message.success('发送答案成功');
                        this.initList();
                    }
                    this.loading = false;
                });
            },

            changeOpen(id, isOpen) {
                autoDoFn(async () => {
                    const res = await setOpen({id, isOpen: isOpen ? 1 : 0});
                    if (res) {
                        this.$message.success('操作成功');
                        this.initList();
                    }
                });
            },
            changeTop(id, isTop) {
                autoDoFn(async () => {
                    const res = await setTop({id, isTop: isTop ? 1 : 0});
                    if (res) {
                        this.$message.success('操作成功');
                        this.initList();
                    }
                });
            },
            changeRelease(id, isTop) {
                autoDoFn(async () => {
                    const res = await setRelese({id, state: isTop ? 1 : 0});
                    if (res) {
                        this.$message.success('操作成功');
                        this.initList();
                    }
                });
            },
            cancelRelease() {
                this.initList();
            },
            handleAnswerShow(rowData) {
                this.handleDrawerToggle('answerVisible', true);
                this.modifyId = rowData.id;
            },
            handleAnswerSuccess() {
                this.handleDrawerToggle('answerVisible', false);
                this.initList();
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
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        font-size: 17px;
    }
</style>
