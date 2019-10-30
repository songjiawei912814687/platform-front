<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="组织机构查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='组织机构名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='组织机构编号'>
                            {{viewData.organizationNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='组织机构编码'>
                            {{viewData.organizationCode || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='上级组织机构'>
                            {{viewData.parentId === '0' ? '无' : (viewData.parentName || '--')}}
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item label='机构类型'>-->
                            <!--{{viewData.type === '0' ? '机构' : '部门'}}-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item label='是否考核'>
                            {{viewData.assessmentState === '0' ? '是' : '否'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='考勤规则'>
                            {{viewData.ruleName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='部门员工工号首位数'>
                            {{viewData.firstLetter || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='手机号'>
                            {{viewData.phoneNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='办公电话'>
                            {{viewData.officePhone || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='传真'>
                            {{viewData.fax || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='排序'>
                            {{viewData.displayOrder || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='分管领导'>
                            {{viewData.leadershipName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='部门管理员'>
                            {{viewData.departmentalManagerName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='创建时间'>
                            {{viewData.createdDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='创建人'>
                            {{viewData.createdUserName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">地址</p>
                        <p class="des-content">{{viewData.address || '--'}}</p>
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
import { Row, Col, Button, Form, Drawer, Spin, Tooltip } from 'ant-design-vue';
import { getDetail } from '@/remote/org';
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
    ATooltip: Tooltip,
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
          console.log(res.data.firstLetter+"-----==--==");
          if (res) {
            this.viewData = {
              ...res.data,
              firstLetter:String(res.data.firstLetter),
              parentId: String(res.data.parentId),
              type: String(res.data.type),
              assessmentState: String(res.data.assessmentState),
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
