<template>
	<div class="content-wrap">
		<h2 class="content__title">考勤报表</h2>
		<search-box @onSearch="handleSearch" @onReset="handleReset">
			<search-box-item  label="查询时间：" :span="2">
				<a-range-picker  v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
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
		</search-box>
		<div class="action">
			<a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ATTENDANCEDAILYDATA_EXPORT') > -1">
				导出
			</a-button>
			<a-button @click="obtainData" v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ATTENDANCEDAILYDATA_OBTAINDATA') > -1">
				数据采集
			</a-button>
		</div>
		<div class="content">
			<a-table :columns="columns" :rowKey="record => String(record.id)" :dataSource="data" :loading="loading"
			 :scroll="scroll" :pagination="pagination" @change="onPageChange" >
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
	import {getPage,exportExcel,obtainData} from '@/remote/reportDay';
	import {getOrgTree} from '@/remote/base';
	import SearchBox from '@/components/SearchBox/SearchBox';
	import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
	import {message} from 'ant-design-vue';
	import {
		autoDoFn,
		transformTree
	} from '@/utils/util';
	import moment from 'moment';

	const {
		Item
	} = Form;
	const {
		Option
	} = Select;
	const {
		RangePicker
	} = DatePicker;

	const columns = [
		{
			title: '组织名称',
			dataIndex: 'organizationName',
			width: 200,
		},
		{
			title: '姓名',
			dataIndex: 'employeeName',
			width: 200,
		},
		{
			title: '监控点名称',
			dataIndex: 'cameraName',
			width: 200,
		},
        {
            title: '记录时间',
            dataIndex: 'punchTime',
            width: 200,
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
					name: '',
					searchTime: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				},
				loading: false,
				scroll: {
					y: document.documentElement.clientHeight - 360,
					x: 1000,
				},
				pageSizeOptions: [10, 20, 30, 40, 50],
				pagination: {
					pageSize: 10,
					defaultCurrent: 1,
					total: 0,
					rows: 10,
					page: 0,
				},
				orgTreeData: [],
				authorityActionList: window.authorityActionList,
			};
		},
		created() {
			this.initBaseData();
			this.initList();
		},
		methods: {
			onShowSizeChange() {
				this.pagination.rows = this.pagination.pageSize
				this.pagination.page = 1
				this.initList()
			},
			onPageChange(pagination) {
				this.pagination.page = pagination.current;
				this.$nextTick(() => {
					this.initList();
				});
			},
			initList() {
				autoDoFn(async () => {
					this.loading = true;
					const res = await getPage({
						...this.searchParams,
						...this.pagination,
						startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
            			endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

					});
					if (res) {
						this.data = res.data.list.map((item,index)=>{
							console.log("-------"+index)
							item.key=index;
							return item;
							});
						this.pagination.total = res.data.total
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
			obtainData() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await obtainData();
                    if (res) {
                        message.info("数据采集已在后台执行")
                    }
                    this.loading = false;
                });
            },
		},
	};
</script>

<style lang="less">

</style>
