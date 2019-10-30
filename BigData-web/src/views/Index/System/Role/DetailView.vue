<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="人员信息查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='角色名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">描述</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Button, Form, Drawer, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/system-role';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;

export default {
  name: 'DetailView',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelectOption: Option,
    ADrawer: Drawer,
    ASpin: Spin,
  },
  props: ['viewVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            this.viewData = {
              ...res.data,
              attendanceState: String(res.data.attendanceState),
              maritalStatus: String(res.data.maritalStatus),
              partyMemberState: String(res.data.partyMemberState),
              sex: String(res.data.sex),
              userCompile: String(res.data.userCompile),
              workingState: String(res.data.workingState),
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>
