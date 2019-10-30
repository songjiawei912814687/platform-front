<template>
	<div class="content-wrap">
		<h2 class="content__title">审批中心</h2>
		<div>
			<span style="margin-left: 40px">审批类型:</span>
			<a-select v-model="approvalTypeSearch" style="width: 300px;margin: 20px 20px" @change="searchChange" placeholder='请选择审批类型'
			 :getPopupContainer="triggerNode => triggerNode.parentNode">
				<a-select-option value='0'>全部</a-select-option>
				<a-select-option value='1'>请假申请</a-select-option>
				<a-select-option value='3'>加班申请</a-select-option>
				<a-select-option value='5'>会议室申请</a-select-option>
				<a-select-option value='7'>人员入职申请</a-select-option>
				<a-select-option value='9'>人员离职申请</a-select-option>
				<a-select-option value='11'>考核申诉</a-select-option>
				<a-select-option value='13'>岗位调动</a-select-option>
				<a-select-option value='15'>人员调休</a-select-option>
				<a-select-option value='17'>员工加减分记录</a-select-option>
			</a-select>
			<span>审批状态</span>
			<a-select v-model="approvalResult" style="width: 300px;margin: 20px 20px" @change="searchChange" placeholder='请选择审批类型'
			 :getPopupContainer="triggerNode => triggerNode.parentNode">
				<a-select-option value='0'>待审核</a-select-option>
				<a-select-option value='1'>通过</a-select-option>
				<a-select-option value='3'>未通过</a-select-option>
				<a-select-option value='5'>已撤销</a-select-option>
			</a-select>
			<!-- <span>时间</span>
			<a-select v-model="applicantTime" style="width: 300px;margin: 20px 20px" @change="searchChange" placeholder='请选择审批类型'
			 :getPopupContainer="triggerNode => triggerNode.parentNode">
				<a-select-option value='0'>近三天</a-select-option>
				<a-select-option value='1'>近一星期</a-select-option>
				<a-select-option value='3'>近一个月</a-select-option>
				<a-select-option value='5'>近一年</a-select-option>
				<a-select-option value='7'>全部</a-select-option>
			</a-select> -->
			<a-button @click="clearSearch">重置</a-button>
		</div>
		<div>
			<a-button style="margin-left: 20px;" @click="eportSomeThing">导出</a-button>
		</div>
		<div class="content">

			<a-table :columns="columns" :dataSource="data" :loading="loading" :scroll="scroll" @change="onPageChange" :rowKey="record => String(record.id)"
			 :pagination="pagination">
				<span slot="action" slot-scope="text, record">
					<a href="javascript:;" v-if="record.result !== 5 && authorityActionList.indexOf('A_SYSTEM_AUDITCENTER_APPROVE_VIEWDETAILS') > -1"
					 @click="handleViewShow(record)">查看详情</a>


					<template>
						<a-divider type="vertical" />
						<a href="javascript:;" v-if="record.result !== 5 && authorityActionList.indexOf('A_SYSTEM_AUDITCENTER_APPROVE_APPROVALPROCESS') > -1"
						 @click="handleProcessShow(record)">审批流程</a>
					</template>

					<template>
						<a-divider type="vertical" />
						<a href="javascript:;" v-if="record.result !== 5 && authorityActionList.indexOf('A_SYSTEM_AUDITCENTER_APPROVE_APPROVAL') > -1"
						 @click="approval(record)">审批</a>
					</template>


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

		<adjust :adjustVisible="adjustVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('adjustVisible', false)"></adjust>

		<applys :applyVisible="applyVisible" :modifyId="modifyId" :resourceId="resourceId" :applicationTypeArr="applicationTypeArr"
		 @successCallback="handleAddSuccess" :handleClose="() => handleCloseDetailView('applyVisible', false)"></applys>

		<employee :employeeVisible="employeeVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('employeeVisible', false)"></employee>

		<meeting :meetingVisible="meetingVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('meetingVisible', false)"></meeting>

		<job-change :jobChangeVisible="jobChangeVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('jobChangeVisible', false)"></job-change>

		<overtime :overtimeVisible="overtimeVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('overtimeVisible', false)"></overtime>


		<process :processVisible="processVisible" :modifyId="modifyId" :resourceId="resourceId" :approvalType="approvalType"
		 :applicantId="applicantId" @successCallback="handleAddSuccess" :handleClose="() => handleDrawerToggle('processVisible', false)"></process>

		<approval :approvalVisible="approvalVisible" :modifyId="modifyId" @successCallback="handleAddSuccess" :handleClose="() => handleDrawerToggle('approvalVisible', false)"></approval>

		<Dismission :dismissionVisible="dismissionVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('dismissionVisible', false)"></Dismission>

		<appraisale :appraisaleVisible="appraisaleVisible" :modifyId="modifyId" :resourceId="resourceId" @successCallback="handleAddSuccess"
		 :handleClose="() => handleCloseDetailView('appraisaleVisible', false)"></appraisale>

		<conplain :appraisalcomplaintVisible="appraisalcomplaintVisible" :modifyId="modifyId" :resourceId="resourceId"
		 @successCallback="handleAddSuccess" :handleClose="() => handleCloseDetailView('appraisalcomplaintVisible', false)"></conplain>
		<eport-some-thing :eportSomeThingVisible="eportSomeThingVisible" @successCallback="handleEportSuccess" :handleClose="() => handleCloseDetailView('eportSomeThingVisible', false)"></eport-some-thing>
	</div>

</template>

<script>
	import SearchBox from '@/components/SearchBox/SearchBox';
	import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
	import {
		getPage
	} from '@/remote/audit';
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
		Pagination
	} from 'ant-design-vue'
	import {
		autoDoFn
	} from '@/utils/util';
	import Adjust from './AdjustDetailView';
	import Applys from './ApplyDetailView';
	import Employee from './EmployeeDetailView';
	import JobChange from './JobChangeDetailView';
	import Meeting from './MeetingDetailView';
	import Overtime from './OvertimeDetailView';
	import Process from './Process'
	import Approval from './approval'
	import Dismission from "./DismissionView"
	import Appraisale from './AppraisaleDetailView'
	import Conplain from './ComplainDetailView'
	import EportSomeThing from './eportSomeThing'


	const {
		Item
	} = Form;
	const {
		Option
	} = Select;
	const applicationTypeArr = [
		'',
		'临时外出二小时公事',
		'哺乳假',
		'孕假',
		'产假',
		'年休假',
		'因公外出',
		'事假',
		'病假',
		'其他',
		'临时外出二小时私事',
	];
	const columns = [

		{
			title: '审批类型',
			dataIndex: 'approvalTypeName',
			width: 200,
		},
		{
			title: '申请人',
			dataIndex: 'applicantName',
			width: 200,
		},
		{
			title: '隶属部门',
			dataIndex: 'organName',
			width: 200,
		},
		{
			title: '申请时间',
			dataIndex: 'applicationDateTime',
			width: 400,
		},
		{
			title: '审批结果',
			dataIndex: 'resultName',
			width: 300,
		},

		{
			title: '操作',
			key: 'action',
			width: 400,
			scopedSlots: {
				customRender: 'action'
			},
		}
	];
	export default {
		name: "Index",
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
			APagination: Pagination,
			SearchBox,
			SearchBoxItem,
			Adjust,
			Applys,
			Employee,
			JobChange,
			Meeting,
			Overtime,
			Process,
			Approval,
			Dismission,
			Appraisale,
			Conplain,
			EportSomeThing
		},
		data() {
			return {
				columns,
				data: [],
				overtimeVisible: false,
				adjustVisible: false,
				jobChangeVisible: false,
				meetingVisible: false,
				employeeVisible: false,
				applyVisible: false,
				processVisible: false,
				approvalVisible: false,
				dismissionVisible: false,
				appraisaleVisible: false,
				appraisalcomplaintVisible: false,
				eportSomeThingVisible: false,
				approvalType: '',
				approvalTypeSearch: '0',
				applicantId: '',
				applicationTypeArr,
				modifyId: '',
				resourceId: '',
				approvalId: '',
				approvalResult: '0',
				applicantTime: '0',
				searchParams: {
					approvalType: '',
				},
				pageSizeOptions: ['10', '20', '30', '40', '50'],
				pagination: {
					pageSize: 10,
					defaultCurrent: 1,
					total: 0,
					rows: 10,
					page: 0,
				},
				authorityActionList: window.authorityActionList,
			}

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
					const res = await getPage({
						approvalType: this.approvalTypeSearch,
						// applicantTime: this.applicantTime,
						approvalResult: this.approvalResult,
						...this.pagination,

					});
					if (res) {
						this.data = res.data.list;
						this.pagination.total = res.data.total;
						this.pagination.page = res.data.pageNum;
						this.pagination.rows = res.data.pageSize;
						this.pagination.pageSize = res.data.pageSize;
					}
					this.loading = false;
				});
			},
			handleProcessShow(rowData) {
				this.handleDrawerToggle('processVisible', true);
				this.modifyId = rowData.id;
				this.resourceId = rowData.resourceId;
				this.approvalType = rowData.approvalType;
				this.applicantId = rowData.applicantId;
			},

			handleViewShow(rowData) {
				debugger
				switch (rowData.approvalType) {
					case 1:
						this.handleDrawerToggle('applyVisible', true);
						break;
					case 3:
						this.handleDrawerToggle('overtimeVisible', true);
						break;
					case 5:
						this.handleDrawerToggle('meetingVisible', true);
						break;
					case 7:
						this.handleDrawerToggle('employeeVisible', true);
						break;

					case 9:
						this.handleDrawerToggle('dismissionVisible', true);
						break

					case 11:
						this.handleDrawerToggle('appraisalcomplaintVisible', true);
						break;
					case 13:
						this.handleDrawerToggle('jobChangeVisible', true);
						break;
					case 15:
						this.handleDrawerToggle('adjustVisible', true);
						break;

					case 17:
						this.handleDrawerToggle('appraisaleVisible', true);
						break;

				}

				this.modifyId = rowData.id;
				this.resourceId = rowData.resourceId;
			},

			eportSomeThing() {
				this.eportSomeThingVisible = true
			},
			handleDrawerToggle(type, isVisible) {
				this[type] = isVisible;
				if (!isVisible) {
					this.modifyId = '';
				}
			},
			handleCloseDetailView(type, isVisible) {
				this.handleDrawerToggle(type, isVisible);
				this.initList();
			},
			approval(rowData) {
				this.handleDrawerToggle('approvalVisible', true);
				this.modifyId = rowData.id;
			},
			handleEportSuccess(){
				this.handleDrawerToggle('eportSomeThingVisible', false);
			},
			handleAddSuccess() {
				this.handleDrawerToggle('approvalVisible', false);
				this.initList();
			},
			onPageChange(pagination) {
				console.log("dddd" + pagination.current)
				this.pagination.page = pagination.current;
				this.$nextTick(() => {
					this.initList();
				});
			},
			search() {
				this.initList()
			},
			clearSearch() {
				this.approvalTypeSearch = '0'
				// this.applicantTime = '0'
				this.approvalResult = '0'
				this.initList()
			},
			searchChange() {
				this.initList()
			}
		}
	}
</script>

<style scoped>

</style>
