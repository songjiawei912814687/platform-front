<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="考勤规则查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='工号'>
                            {{viewData.employeeNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='姓名'>
                            {{viewData.employeeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='考勤机名称'>
                            {{viewData.attendanceDeviceName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='验证方式'>
                            {{viewData.authentication || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='打卡时间'>
                            {{viewData.punchTime || '--'}}
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
import { getDetail } from '@/remote/attendanceData';
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
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>

<style lang="less">
    .org-view-form {
        .ant-form-item-children {
            font-size: 16px;
            color: #333;
        }
    }
</style>
