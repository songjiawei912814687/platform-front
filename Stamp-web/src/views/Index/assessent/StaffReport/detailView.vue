<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="400"
              title="明细">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-table
                    :columns="columns"
                    :dataSource="tableList"
                    :rowKey="record => String(record.id)"
                    :pagination=false
            >

            </a-table>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
    import { Row, Col, Button, Drawer, Spin, Tooltip, Table } from 'ant-design-vue';
    import { getDetail } from '@/remote/staffReport';
    import { autoDoFn } from '@/utils/util';

    const columns = [
        {
            title: '规则名称',
            dataIndex: 'ruleName',
            width: 400,
        },
        {
            title: '扣分分值',
            dataIndex: 'value',
            width: 400,
        },
        {
            title: '记录时间',
            dataIndex: 'recordDateTime',
            width: 400,
        },

    ];
    export default {
        name: "detailView",
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
            ATooltip: Tooltip,
            ATable: Table
        },
        props: ['viewVisible', 'handleClose', 'modifyId'],
        data() {
            return {
                columns,
                tableList: [],
                viewData: {},
                viewLoading: false,
            };
        },
        watch: {
            viewVisible() {
                if (this.modifyId && this.viewVisible) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res.success) {
                            this.tableList = res.data
                        }
                        this.viewLoading = false;
                    });
                }
            },
        },
    }
</script>

<style scoped>

</style>