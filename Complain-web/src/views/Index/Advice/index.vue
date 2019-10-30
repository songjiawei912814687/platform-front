<template>
	<div class="content-wrap">
		<h2 class="content__title">投诉建议</h2>
		<search-box @onSearch="handleSearch" @onReset="handleReset">

			<search-box-item label="查询时间：" :span='1'>
				<a-range-picker v-model="searchParams.searchTime"
								style="width: 100%"
								format="YYYY-MM-DD"
								:placeholder="['请选择时间', '请选择时间']">

				</a-range-picker>
			</search-box-item>
			<search-box-item label="群众姓名：">
				<a-input placeholder="请输入姓名" v-model="searchParams.name"/>
			</search-box-item>
			<search-box-item label="手机号码：">
				<a-input placeholder="请输入手机号码" v-model="searchParams.phone"/>
			</search-box-item>
			<search-box-item label="工号：">
				<a-input placeholder="请输入工号" v-model="searchParams.jobNumber"/>
			</search-box-item>
			<search-box-item label="来源：">
				<a-select showSearch allowClear style="width: 100%" v-model="searchParams.dateResource" placeholder="请选择来源">
					<a-select-option value="0">电话</a-select-option>
					<a-select-option value="1">现场</a-select-option>
					<a-select-option value="2">上级下发</a-select-option>
					<a-select-option value="3">微信</a-select-option>
					<a-select-option value="4">二次回复</a-select-option>
					<a-select-option value="5">短信</a-select-option>
				</a-select>
			</search-box-item>

			<search-box-item label="投诉部门：">
				<a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" v-model="searchParams.departmentId"
				 :treeData="organizationOptions" treeDefaultExpandAll :showSearch='true' treeNodeFilterProp="title" placeholder="请选择组织机构"></a-tree-select>
			</search-box-item>
			<search-box-item label="有效状态：">
				<a-select showSearch allowClear style="width: 100%" v-model="searchParams.isUse" placeholder='请选择有效状态'>
					<a-select-option value="0">无效</a-select-option>
					<a-select-option value="1">有效</a-select-option>
				</a-select>
			</search-box-item>
			<search-box-item label="发布状态：">
				<a-select showSearch allowClear style="width: 100%" v-model="searchParams.publish" placeholder='请选择发布状态'>
					<a-select-option value="0">未发布</a-select-option>
					<a-select-option value="1">已发布</a-select-option>
				</a-select>
			</search-box-item>
			<search-box-item label="回访状态：">
				<a-select showSearch allowClear style="width: 100%" v-model="searchParams.isPhoneCall" placeholder='请选择回访状态'>
					<a-select-option value="0">未回访</a-select-option>
					<a-select-option value="1">已回访</a-select-option>
				</a-select>
			</search-box-item>
			<search-box-item label="处理状态：">
				<a-select showSearch allowClear style="width: 100%" v-model="searchParams.dealState" placeholder='请选择处理状态'>
					<a-select-option value="0">未处理</a-select-option>
					<a-select-option value="1">已处理</a-select-option>
				</a-select>
			</search-box-item>
		</search-box>

		<div class="action">
			<a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_ADD') > -1">录入</a-button>
		</div>

		<div class="content">
			<a-table :columns="columns" :dataSource="tableData" :loading="loading" :pagination="pagination" :rowKey="record => String(record.id)"
			 :scroll="scroll" @change="onPageChange">

				<span slot="action" slot-scope="text, record">
					<a @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_VIEW') > -1">查看</a>

					<template v-if="String(record.isPhoneCall)==='0'  && authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_ISCALL') > -1">
						<a-divider type="vertical" />
						<a  href="javascript:;" @click="handleVisitor(record)">回访</a>
					</template>

					<template v-if="String(record.publish) === '0' && String(record.isPhoneCall)==='1' && authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_RELEASE') > -1">
						<a-divider type="vertical" />
						<a-popconfirm title="确认要发布此条数据?" @confirm="handleRelease(record)" okText="确认" cancelText="取消">
							<a>发布</a>
						</a-popconfirm>
					</template>

					<template v-if="String(record.dealState) === '0' && String(record.publish) === '1' && String(record.isPhoneCall)==='1'  && authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_PROCESSINGCOMPLETION') > -1">
						<a-divider type="vertical" />
						<a href="javascript:;" @click="handleDeal(record)">处理</a>
					</template>

					<template v-if=" authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_EDITOR') > -1">
						<a-divider type="vertical" />
						<a @click="handleModifyShow(record)">编辑</a>
					</template>
					<template v-if="String(record.publish) === '0' && String(record.isPhoneCall)==='0' && authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_DELETE') > -1">
						<a-divider type="vertical" />
						<a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消">
							<a>删除</a>
						</a-popconfirm>
					</template>
					<!--<template v-if="String(record.publish) === '0' && String(record.isPhoneCall)==='0'">-->
						<!--<a-divider type="vertical" />-->
						<!--<a  href="javascript:;" @click="handleVisitor(record)">回访</a>-->
					<!--</template>-->

                    <template v-if= "authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_EMPSCORE') > -1">
						<a-divider type="vertical" />
						<a href="javascript:;" @click="handEmpScore(record)">员工扣分</a>
					</template>
                    <template v-if="authorityActionList.indexOf('A_FEEDBACK_COMPLAINTPROPOSAL_ORGSCORE') > -1">
						<a-divider type="vertical" />
						<a href="javascript:;" @click="handOrgScore(record)">部门扣分</a>
					</template>

					<template v-if="String(record.isUse) === '0'">
						&nbsp;<a-icon type="bulb" style ="color: lawngreen; font-size: 18px;" theme="filled" />
					</template>
					<template v-if="String(record.isUse) === '1'">
						&nbsp;<a-icon type="bulb" style ="color: red; font-size: 18px;"  theme="filled"/>
					</template>

					<template v-if="String(record.outOfDate) === '0'">
						&nbsp;<a-icon type="clock-circle" theme="filled" style="color: lawngreen; font-size: 18px;" />
					</template>
					<template v-if="String(record.outOfDate) === '1'">
						&nbsp;<a-icon type="clock-circle" theme="filled" style="color: red;  font-size: 18px;" />
					</template>




					<!--<template v-if="String(record.dealState) !== '0' && String(record.publish) === '1'">-->
						<!--<a-divider type="vertical" />-->
						<!--<a href="javascript:;" @click="handleInvalid(record)">无效</a>-->
					<!--</template>-->
					<!-- <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleReply(record)">回复</a>
                    </template> -->
				</span>
			</a-table>

			<div style="position: relative; left: 0px;top: -70px;width: 400px">
				<span style="margin: 20px 20px;">页/行</span>
				<a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;" placeholder=''
				 :getPopupContainer="triggerNode => triggerNode.parentNode">
					<a-select-option value='10'>10/行</a-select-option>
					<a-select-option value='30'>30/行</a-select-option>
					<a-select-option value='50'>50/行</a-select-option>
					<a-select-option value='100'>100/行</a-select-option>
				</a-select>
				<span style="margin-left: 10px">共{{pagination.total}}条</span>
			</div>
		</div>

		<add-view
				:addVisible="addVisible"
				@successCallback="handleAddSuccess"
				:modifyId="modifyId"
				:handleClose="() => handleDrawerToggle('addVisible', false)">
		</add-view>

		<detail-view
				:viewVisible="viewVisible"
				:modifyId="modifyId"
				:handleClose="() => handleDrawerToggle('viewVisible', false)">
		</detail-view>

		<reply-view
				:replyVisible="replyVisible"
				:modifyId="modifyId"
				:handleClose="()=>handleDrawerToggle('replyVisible',false)">
		</reply-view>

		<deal-view
				:dealVisible="dealVisible"
				:modifyId="modifyId"
				@successCallback="handleDealSuccess"
				:handleClose="()=>handleDrawerToggle('dealVisible',false)">
		</deal-view>

		<visitor-view
				:visitorVisible="visitorVisible"
				:modifyId="modifyId"
				@successCallback = "handleVisitorSuccess"
				:handleClose="()=>handleDrawerToggle('visitorVisible',false)">
		</visitor-view>

        <add-emp-score
            :addEmpScoreVisible = "addEmpScoreVisible"
            :modifyId="modifyId"
			:classifyList="classifyList"
			:ruleList="ruleList"
            @successCallback="handEmpScoreSuccess"
            :handleClose="()=>handleDrawerToggle('addEmpScoreVisible',false)">
        </add-emp-score>

		<add-org-score
				:addOrgScoreVisible = "addOrgScoreVisible"
				:organizationId="organizationId"
				:year="year"
				:month = "month"
				@successCallback="handOrgScoreSuccess"
				:handleClose="()=>handleDrawerToggle('addOrgScoreVisible',false)">
		</add-org-score>
	</div>
</template>

<script>
	import {
		Row,
		Col,
		Input,
		Button,
		Table,
		Select,
		Upload,
		Icon,
		Divider,
		Popconfirm,
		Cascader,
        DatePicker,
		TreeSelect
	} from 'ant-design-vue';

    const {RangePicker} = DatePicker;

	const {
		Option
	} = Select;
    import moment from 'moment';
	import {
		autoDoFn,
		transformTree
	} from '@/utils/util';
	import SearchBox from '@/components/SearchBox/SearchBox';
	import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
	import AddView from './addView';
	import DetailView from './detailView';
	import ReplyView from './replyView';
	import DealView from './dealView';
	import VisitorView from './visitorView';
    import AddEmpScore from './AddEmpScore';
    import AddOrgScore from  './addOrgScore';
	import {
		getOrganizationTree,selectAllAppraisalIndex,selectAllAppraisalRule
	} from '@/remote/common';
	import {
		getPage,
		importExcel,
		exportExcel,
		getDel,
		publish,
		setInvalid,
        getApprialItemDetail
	} from '@/remote/advice';


    const columns = [{
			title: '来源',
			dataIndex: 'dateResourceName',
			width: 100,
		},
		{
			title: '群众姓名',
			dataIndex: 'suggestionName',
			width: 120,
		},
		{
			title: '群众电话',
			dataIndex: 'suggestionPhoneNumber',
			width: 150,
		},
        {
            title: '被投诉人工号',
            dataIndex: 'employeeNo',
            width: 100,
        },
        {
            title: '被投诉人姓名',
            dataIndex: 'employeeName',
            width: 100,
        },
		{
			title: '被投诉部门',
			dataIndex: 'organizationName',
			width: 150,
		},
		{
			title: '投诉时间',
			dataIndex: 'createdDateTime',
			width: 200,
		},
        {
            title: '回访状态',
            dataIndex: 'isCallName',
            width: 130,
        },
		{
			title: '发布状态',
			dataIndex: 'publishName',
			width: 130,
		},
        {
            title: '计时(天)',
            dataIndex: 'outTimes',
            width: 100,
        },
		{
			title: '处理状态',
			dataIndex: 'dealStateName',
			width: 130,
		},
        {
            title: '有效投诉',
            dataIndex: 'isUseName',
            width: 130,
        }, {
			title: '操作',
			key: 'action',
			width: 400,
			scopedSlots: {
				customRender: 'action'
			},
		}
	]


	export default {
		name: 'index',
		components: {
			AInput: Input,
			ARow: Row,
			ACol: Col,
			AButton: Button,
			ATable: Table,
			ASelect: Select,
			ASelectOption: Option,
			AUpload: Upload,
			AIcon: Icon,
			ADivider: Divider,
			APopconfirm: Popconfirm,
			SearchBox,
			SearchBoxItem,
			ACascader: Cascader,
			ATreeSelect: TreeSelect,
            ADatePicker: DatePicker,
            ARangePicker: RangePicker,
			AddView,
			DetailView,
			ReplyView,
			DealView,
			VisitorView,
            AddEmpScore,
            AddOrgScore,
            ruleList:[],
		},
		data() {
			return {
                username:localStorage.getItem("userName"),
				organizationOptions: [], //投诉部门
				searchParams: {
					organizationChose: [],
					departmentId: '',
                    isUse:'',
					publish:'',
					dealState: '',
                    isPhoneCall:'',
					outOfDate: '',
					outDays: '',
                    outTimes: '',
                    searchTime: [],
					name:'',
					phone:'',
					jobNumber:''
				},
                depamentPlanData:[],
                depamentPlan:[],
                classifyList:[],
				tableData: [],
				columns: columns,
				loading: false,
				pageSizeOptions: [10, 20, 30, 40, 50],
				pagination: {
					pageSize: 10,
					defaultCurrent: 1,
					total: 0,
					rows: 10,
					page: 0,
				},
				scroll: {
					x: true,
					y: document.documentElement.clientHeight - 360
				},
				modifyId: '',
				addVisible: false,
				viewVisible: false,
				replyVisible: false,
				dealVisible: false,
                visitorVisible:false,
                addEmpScoreVisible:false,
                addOrgScoreVisible:false,
				authorityActionList: window.authorityActionList,
				organizationId: '',
				year:'',
				month:'',
			}
		},
		created() {
            this.initBaseData();
			this.getOrganizationTree();
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
                        startTime: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD 00:00:00"):'',
                        endTime: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD 23:59:59"):'',
					});
					if (res.success) {
						this.tableData = res.data.list;
						this.pagination.total = res.data.total;
						this.pagination.page = res.data.pageNum;
						this.pagination.row = res.data.pageSize;
					}
					this.loading = false;
				});
			},
            initBaseData() {
                autoDoFn(async () => {
                    const res = await selectAllAppraisalIndex({
                        state: window.parseInt('0'),
                        type: window.parseInt(''),
                    });
                    if (res.success) {
                        this.classifyList = res.data;
                    }
                    const res1 = await selectAllAppraisalRule();
                    if (res1.success) {
                        this.ruleList = res1.data;
                    }
                });
            },
			handleSearch() {
				this.initList();
			},
			handleReset() {
				this.searchParams = {
					organizationChose: [],
					departmentId: '',
                    isUse:'',
                    publish:'',
                    dealState: '',
                    isPhoneCall:'',
					searchTime:'',
					phone:'',
					name:'',
					jobNumber:''
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
			onPageChange(pagination) {
				this.pagination.page = pagination.current;
				this.$nextTick(() => {
					this.initList();
				});
			},
			// 获取组织树
			getOrganizationTree() {
				autoDoFn(async () => {
					const res = await getOrganizationTree({})
					if (res.success) {
						this.organizationOptions = transformTree(res.data)
					}
				})
			},

			// 切换显示与隐藏
			handleDrawerToggle(type, isVisible) {
				this[type] = isVisible;
				if (!isVisible) {
					this.modifyId = '';
				}
			},
			handleViewShow(rowData) {
				this.handleDrawerToggle('viewVisible', true)
				this.modifyId = rowData.id;
			},
			handleModifyShow(rowData) {
				this.handleDrawerToggle('addVisible', true);
				this.modifyId = rowData.id;
			},
			handleAddSuccess() {
				this.handleDrawerToggle('addVisible', false);
				this.initList();
			},
			//回访
            handleVisitor(rowData){
                this.handleDrawerToggle('visitorVisible', true);
                this.modifyId = rowData.id;
            },

			//回访成功
            handleVisitorSuccess(){
                this.handleDrawerToggle('visitorVisible', false);
                this.initList();
            },
			// 点击处理完成
			handleDeal(rowData) {
				this.handleDrawerToggle('dealVisible', true);
				this.modifyId = rowData.id;
			},
			// 处理成功
			handleDealSuccess() {
				this.handleDrawerToggle('dealVisible', false);
				this.initList();
			},

            //员工扣分
            handEmpScore(rowData){
                this.handleDrawerToggle('addEmpScoreVisible', true);
                this.modifyId = rowData.id;
            },
            // 员工扣分完成
            handEmpScoreSuccess() {
                this.handleDrawerToggle('addEmpScoreVisible', false);
                this.initList();
            },

			//部门扣分
            handOrgScore(rowData){
                this.organizationId = rowData.organizationId;
                this.year = moment(rowData.createdDateTime).format('YYYY');
                this.month = moment(rowData.createdDateTime).format('MM');
                this.handleDrawerToggle('addOrgScoreVisible', true);
			},

            // 部门扣分完成
            handOrgScoreSuccess() {
                this.handleDrawerToggle('addOrgScoreVisible', false);
                this.initList();
            },

			// 发布
			handleRelease(rowData) {
				let params = {
					'id': rowData.id,
					'outOfDate': rowData.outDateTime
				}
				autoDoFn(async () => {
					this.loading = true;
					const res = await publish(params);
					if (res.success) {
						this.$message.success('发布成功');
						this.initList()
					}
					this.loading = false;
				})
			},
			// 无效
			handleInvalid(rowData) {
				autoDoFn(async () => {
					this.loading = true;
					const res = await setInvalid({
						'idList': rowData.id
					});
					if (res) {
						this.$message.success('无效操作成功')
						this.initList();
					}
					this.loading = false;
				})
			},
			// 回复
			handleReply(rowData) {
				this.handleDrawerToggle('replyVisible', true);
				this.modifyId = rowData.id;
			},
			// 删除
			handleDelete(id) {
				autoDoFn(async () => {
					this.loading = true;
					const res = await getDel({
						'idList': id
					});
					if (res.success) {
						this.$message.success('删除成功');
						this.initList();
					}
					this.loading = false;
				})
			},
			filterTreeNode(input, treeNode) {
				return treeNode.data.props.title.indexOf(input) > -1;
			}
		}
	}
</script>

<style>
</style>
