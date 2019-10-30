<template>
    <div>
        <div class="icon" style="right: 100px">
            <a-input v-model="value" style="width: 25vh" placeholder='请输入人员姓名,手机号码或车牌号'></a-input>
        </div>
        <div class="icon" style="padding:0 10px;padding-right: 8px">
            <a-icon @click="search" type="search">搜索</a-icon>
        </div>
        <a-modal style="position: absolute;right: 100px;top: 60px"
                 :visible="membersVisible"
                 @cancel="handleClose"
                 :footer="null"
                 :mask="false"
                 :width="760"
        >
            <a-table :columns="membersColumns"
                     @change="onMembersPageChange"
                     :dataSource="employees"
                     :loading="membersLoading"
                     :pagination="membersPagination"></a-table>

        </a-modal>
    </div>
</template>

<script>
    import {Icon, Input, Button, Modal, Table, message} from 'ant-design-vue';
    import {getEmployee} from '@/remote/base'
    import {autoDoFn} from "../../utils/util";


    const membersColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '工号',
            dataIndex: 'employeeNo',
        },
        {
            title: '组织机构',
            dataIndex: 'organizationName',
        },
        {
            title: '手机',
            dataIndex: 'phoneNumber',
        },
        {
            title: '车牌号',
            dataIndex: 'plateNo',
        },
    ];
    export default {
        name: "index",
        components: {
            AIcon: Icon,
            AInput: Input,
            AButton: Button,
            AModal: Modal,
            ATable: Table
        },
        data() {
            return {
                membersColumns,
                value: '',
                membersLoading: false,
                employees: [],
                membersVisible: false,
                membersPagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
            }
        },
        methods: {
            search() {
                this.initEmployee()
            },
            handleClose() {
                this.membersVisible = false
            },
            initEmployee() {
                autoDoFn(async () => {
                    const res = await getEmployee({
                        ...this.membersPagination,
                        nameOrPhone: this.value
                    })
					if(!res.data || res.data.list.length <= 0){
						console.log(res)
						message.info("未查到任何数据")
					}
                    if (res.data.list.length > 0) {
                        this.employees = res.data.list
                        this.membersPagination.total = res.data.total;
                        this.membersPagination.page = res.data.pageNum;
                        this.membersPagination.row = res.data.pageSize;
                        this.membersVisible = true
                    }
                })
            },
            onMembersPageChange(pagination) {
                this.membersPagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initEmployee();
                    this.membersVisible = true;
                });
            },
        }
    }
</script>

<style scoped>



</style>
