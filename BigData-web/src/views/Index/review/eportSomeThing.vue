<template>
	<a-modal title="导出" :visible="eportSomeThingVisible" @cancel="handleClose" :footer="null" :loading="addLoading" @ok="handleOk" :width="320">
	<div>
		<a-button style="margin-right: 30px;" type="primary" @click="audit">导出请假记录</a-button>
		<a-button  type="primary" @click="notAudit">导出加班记录</a-button>
	</div>
		
	</a-modal>
</template>

<script>
	import {
		Row,
		Col,
		Input,
		Button,
		Form,
		Select,
		Drawer,
		Spin,
		TreeSelect,
		Upload,
		Icon,
		DatePicker,
		Modal
	} from 'ant-design-vue';
	import {
		autoDoFn
	} from '@/utils/util';
	import {
		getAudit,
		getExcel
	} from '@/remote/audit';

	const {
		Item
	} = Form;
	const {
		Option
	} = Select;
	const {
		TextArea
	} = Input;
	export default {
		name: 'approval',
		components: {
			AInput: Input,
			ARow: Row,
			ACol: Col,
			AButton: Button,
			AForm: Form,
			AFormItem: Item,
			ASelect: Select,
			ASelectOption: Option,
			ATextArea: TextArea,
			ADrawer: Drawer,
			ASpin: Spin,
			ATreeSelect: TreeSelect,
			AUpload: Upload,
			AIcon: Icon,
			ADatePicker: DatePicker,
			AModal: Modal
		},
		data() {
			return {
				imageUrl: '',
				type: '',
				addLoading: false,
			};
		},
		props: ['eportSomeThingVisible', 'handleClose'],
		computed: {
			title() {
				return this.modifyId ? '审批' : '审批';
			},
		},
		methods: {
			audit(e) {
				debugger;
				this.type = '1';
				this.exportExcel();
			},
			notAudit(e) {
				this.type = '3';
				this.exportExcel();
			},
			exportExcel() {
				autoDoFn(async () => {
					let res = await getExcel({
						type: this.type
					});
					if (res) {
						window.open(`${res.data}`, '_blank')
					}
				})
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						autoDoFn(async () => {
							this.addLoading = true;
							const res = await getAudit({
								result: this.result,
								approvalAssociationId: this.modifyId,
								...values,
							});
							if (res) {
								this.$message.success('操作成功');
								this.$emit('successCallback');
							}
							this.addLoading = false;
						});
					}
				});
			},


		},
	};
</script>

<style scoped>

</style>
