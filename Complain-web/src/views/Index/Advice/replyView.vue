<template>
    <a-drawer :visible="replyVisible"
              @close="handleClose"
              :loading="replyLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="回复查看">
        <a-spin tip="正在加载中..." :spinning="replyLoading">
             <a-table :columns="columns"
                    :rowKey="record => String(record.id)"
                    :dataSource="replyData"
                    :loading="replyLoading"
                    :pagination="false"
                >
             </a-table>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>

import { Row, Col, Button, Form, Drawer, Spin, Tooltip,Table } from "ant-design-vue";
// import { getDetail } from '@/remote/classify';
import { autoDoFn } from "@/utils/util";

const { Item } = Form;

const columns = [
    {
        'title':'回复内容',
        'dataIndex':'lin_content',
        'width':300
    },{
        'title':'回复时间',
        'dataIndex':'lin_time',
        'width':200
    }
]

export default {
    name: "ReplyView",
    components: {
        ARow: Row,
        ACol: Col,
        AButton: Button,
        AForm: Form,
        AFormItem: Item,
        ASelectOption: Option,
        ADrawer: Drawer,
        ASpin: Spin,
        ATooltip: Tooltip,
        ATable:Table,
    },
    props: ["replyVisible", "handleClose", "modifyId"],
    data() {
        return {
            replyData: [],
            columns:columns,
            replyLoading: false
        };
    },
    watch: {
        replyVisible() {
            if (this.replyVisible && this.modifyId) {
                autoDoFn(async () => {
                    console.log('-----------------')
                    this.replyLoading = true;
                    //   const res = await getDetail({ id: this.modifyId });
                    const res = {
                        success:true,
                        data:[
                            {
                                'lin_content':'回复信息1',
                                'lin_time':'2018-10-24 10:00:00'
                            },{
                                'lin_content':'回复信息1',
                                'lin_time':'2018-10-24 10:00:00'
                            },
                        ]
                    }
                    if(res.success){
                        this.replyData = res.data;
                    }
                    this.replyLoading = false;
                });            
            }
        }
    },
    methods: {}
}
</script>

