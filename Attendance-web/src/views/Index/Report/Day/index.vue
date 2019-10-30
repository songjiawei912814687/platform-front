 <template>
	<div class="content-wrap">
		<h2 class="content__title">考勤日报表</h2>
		<search-box @onSearch="handleSearch" @onReset="handleReset">
			<!--<search-box-item label="日期：">-->
				<!--<a-date-picker @change="changehandle1" :disabledDate="disabledDate" :allowClear="false" v-model="searchParams.days" placeholder='请选择日期'></a-date-picker>-->
			<!--</search-box-item>-->

			<search-box-item  label="查询时间：" :span="2">
				<a-range-picker @change="changehandle2" v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
			</search-box-item>
			<search-box-item label="所属机构：">
				<a-tree-select style="width: 100%"
							   :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
							   :treeData="orgTreeData"
				showSearch treeNodeFilterProp="title"
				 placeholder='请选择所属机构'
							   treeDefaultExpandAll :rowKey="record => String(record.id)"
							   v-model="searchParams.organizationId"
				 :allowClear="true"></a-tree-select>
			</search-box-item>
			<search-box-item label="姓名：">
				<a-input v-model="searchParams.name" placeholder='请输入姓名' />
			</search-box-item>
			<search-box-item label="工号：">
				<a-input v-model="searchParams.no" placeholder='请输入工号' />
			</search-box-item>
			<search-box-item  label="状态：">
				<a-select v-model="searchParams.stateType"  style="width: 100%;"
				 placeholder='请选择审批类型' :getPopupContainer="triggerNode => triggerNode.parentNode">
					<a-select-option value=''>全部</a-select-option>
					<a-select-option value='1'>正常</a-select-option>
					<a-select-option value='2'>异常</a-select-option>
				</a-select>
			</search-box-item>

            <search-box-item  label="请假：">
                <a-select v-model="searchParams.isLeave"  style="width: 100%;"
                          placeholder='请选择审批类型' :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option value=''>全部</a-select-option>
                    <a-select-option value='1'>是</a-select-option>
                    <a-select-option value='2'>否</a-select-option>
                </a-select>
            </search-box-item>

            <search-box-item  label="核销假状态：">
                <a-select v-model="searchParams.verification"  style="width: 100%;"
                          placeholder='请选择审批类型' :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option value=''>全部</a-select-option>
                    <a-select-option value='1'>正常</a-select-option>
                    <a-select-option value='2'>异常</a-select-option>
                </a-select>
            </search-box-item>

			<!--<search-box-item label="日报表：">-->
				<!--<a-input v-model="searchParams.dates"-->
						 <!--placeholder='请输入日期' />-->
			<!--</search-box-item>-->
			<!--<search-box-item>-->
				<!--<a-button style="position: absolute;left: -110px;" @click="handleReportDay(data)"-->
						  <!--v-if="authorityActionList.indexOf('A_ATTENDANCE_STATISTICALREPORTS_ATTENDANCEDAILYDATA_HANDLE') > -1">-->
					<!--生成-->
				<!--</a-button>-->
			<!--</search-box-item>-->

			<search-box-item>
				<a-button style="position: absolute;" @click="handleReportDay(data)"
						  v-if="authorityActionList.indexOf('A_ATTENDANCE_STATISTICALREPORTS_ATTENDANCEDAILYDATA_HANDLE') > -1">
					生成
				</a-button>
			</search-box-item>

		</search-box>
		<div class="action">
			<a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_ATTENDANCE_STATISTICALREPORTS_ATTENDANCEDAILYDATA_EXPORT') > -1">
				导出
			</a-button>
		</div>
		<div class="content">
			<a-table :columns="columns" :rowKey="record => String(record.employeeId)" :dataSource="data" :loading="loading"
			 :scroll="scroll" :pagination="pagination">
				<span slot="leave" slot-scope="text, record">
					<span v-if="record.isLeave === '否'">{{record.isLeave}}</span>
					<a href="javascript:0" v-if="record.isLeave === '是'" @click="handleLeaveShow(record)">{{record.isLeave}}</a>
				</span>
				<span slot="goToWork" slot-scope="text, record">
					<span v-if="record.signInTime === undefined">- -</span>
					<span v-if="record.signInTime !== undefined">{{record.signInTime}} </span>
				</span>

				<span slot="goHome" slot-scope="text, record">
					<span v-if="record.signOutTime === undefined">- -</span>
					<span v-if="record.signOutTime !== undefined">{{record.signOutTime}} </span>
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
		<data-list :modal="modal" @close="handleDateListClose" />
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
		TreeSelect,
	} from 'ant-design-vue';
	import {
		getPage,
		exportExcel,
        handleReportDay,
        handleReportDays
	} from '@/remote/reportDay';
	import {
		getOrgTree
	} from '@/remote/base';
	import SearchBox from '@/components/SearchBox/SearchBox';
	import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
	import {
		autoDoFn,
		transformTree
	} from '@/utils/util';
	import moment from 'moment';
	import DataList from './DataList'

	const {
		Item
	} = Form;
	const {
		Option
	} = Select;
	const {
		RangePicker
	} = DatePicker;
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
        '婚假',
        '探亲假',
        '陪产假',
        '丧假',
	];

	const columns = [{
			title: '姓名',
			dataIndex: 'employeeName',
			width: 200,
		},
		{
			title: '工号',
			dataIndex: 'employeeNo',
			width: 200,
		},
		{
			title: '上班打卡时间',
			dataIndex: 'signInTime',
			scopedSlots: {
				customRender: 'goToWork'
			},
			width: 200,
		},
		{
			title: '下班打卡时间',
			dataIndex: 'signOutTime',
			scopedSlots: {
				customRender: 'goHome'
			},
			width: 200,
		},
		{
			title: '请假',
			dataIndex: 'isLeave',
			width: 200,
			scopedSlots: {
				customRender: 'leave'
			},
		},
		{
			title: '迟到',
			dataIndex: 'beLate',
			width: 200,
		},
		{
			title: '早退',
			dataIndex: 'leaveEarly',
			width: 200,
		},
		{
			title: '未打卡',
			dataIndex: 'punch',
			width: 200,
		},
		{
			title: '状态',
			dataIndex: 'statusName',
			width: 200,
		},
        {
            title: '核销假状态',
            dataIndex: 'verification',
            width: 200,
        },
	];

	const leaveColumns = [
	    {
			title: '请假类型',
			dataIndex: 'applicationTypeName',
			width: 300,
		},
		{
			title: '开始时间',
			dataIndex: 'startTime',
			width: 300,
		},
		{
			title: '结束时间',
			dataIndex: 'endTime',
			width: 300,
		},
        {
            title: '第一次核销假打卡时间',
            dataIndex: 'verificationTimeOne',
            width: 300,
            scopedSlots: {
                customRender: 'verificationTimeOne'
            },
        },
        {
            title: '第二次核销假打卡时间',
            dataIndex: 'verificationTimeTwo',
            width: 300,
            scopedSlots: {
                customRender: 'verificationTimeTwo'
            },
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
			ARangePicker: RangePicker,
			SearchBox,
			SearchBoxItem,
			DataList,
		},
		data() {
			return {
				columns,
				addVisible: false,
				modifyId: '',
				data: [],
				date: '',
				viewVisible: false,
				searchParams: {
					organizationId: '',
					no: '',
					name: '',
					stateType: '',
					searchTime: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    isLeave:'',
                    verification:'',
					days: moment().subtract(1, 'days'),
					dates:'',
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
				orgTreeData: [],
				staffList: [],
				applicationTypeArr,
				authorityActionList: window.authorityActionList,
				modal: {
					visible: false,
					columns: [],
					title: '',
					record: {},
				}
			};
		},
		created() {
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
						days: this.searchParams.days==''?'':this.searchParams.days.format("YYYY-MM-DD"),
						startDate: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
						endDate:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

					});
					if (res) {
						res.data.map(item => { // item为数组的元素
							item.punch= item.punch=='是'?'是':'否';
							return item ;
						})
						this.data = res.data;
						this.pagination.total = res.data.length
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
					console.log(this.orgTreeData)
				});
			},
			handleSearch() {
				this.initList();
			},
			handleReset() {
				this.searchParams = {
					organizationId: '',
					no: '',
					name: '',
					days: moment().subtract(1, 'days'),
                    startDate:moment().subtract(1, 'days'),
                    endDate:moment().subtract(1, 'days'),
				};
				this.$nextTick(() => {
					this.initList();
				});
			},
			disabledDate(currentDate) {
				if (!currentDate) {
					return false;
				}
				return moment(currentDate.format("YYYY-MM-DD")).valueOf() > moment(moment().format("YYYY-MM-DD")).valueOf();
			},
			exportExcel() {
				autoDoFn(async () => {
					let res = await exportExcel({
						...this.searchParams,
                        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
					});
					if (res) {
						window.open(`${res.data}`, '_blank')
					}
				})
			},
			handleLeaveShow(record) {
				// let days = moment( this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '')
                let days = moment( record.attendanceDate)
				this.modal = {
					visible: true,
					columns: leaveColumns,
					title: '查看请假记录',
					record: {
						employeeId: record.employeeId,
						date: record.attendanceDate,
					},
				}
			},
			handleDateListClose() {
				this.modal = {
					visible: false,
					columns: [],
					title: '',
					record: {},
				}
			},
			changehandle1() {
				this.searchParams.searchTime = []
			},
			changehandle2() {
				this.searchParams.days = ''
			},

            // handleReportDay() {
            //     autoDoFn(async () => {
            //         let getDay = await handleReportDay({
            //             ...this.searchParams,
            //             dates: this.searchParams.dates.toString(),
            //         });
            //         if (getDay) {
            //             this.$message.success('生成考勤日报成功');
            //         }
            //         this.$message.falseValue('生成考勤日报表失败');
            //     })
            // },

            handleReportDay() {
                autoDoFn(async () => {
                    let getDay = await handleReportDays({
                        ...this.searchParams,
                        // dates: this.searchParams.dates.toString(),
                        beginDates: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                        endDates: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
                    });
                    if (getDay) {
                        this.$message.success('生成考勤日报成功');
                    }
                    this.$message.falseValue('生成考勤日报表失败');
                })
            },

		},
	};
</script>

<style lang="less">

</style>
