<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="刻章详情查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='员工姓名'>
                            {{viewData.empNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='员工工号'>
                            {{viewData.empName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='叫号时间'>
                            {{viewData.callTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item label='经办人姓名'>
                        {{viewData.doName || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='经办人身份证号码'>
                        {{viewData.doIdentity || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='经办人手机号码'>
                        {{viewData.doNumber || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='企业名称'>
                        {{viewData.companyName || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='法人代表'>
                        {{viewData.lealPerson || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='法人身份证号码'>
                        {{viewData.lealIdentity || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='统一社会信用代码'>
                        {{viewData.socialCode || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='企业经营地址'>
                        {{viewData.companyAddress || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <a-form-item label='服务套餐'>
                        {{viewData.servicePlanName || '--'}}
                    </a-form-item>
                </a-col>
                    <a-col :span="12">
                    <!--<a-form-item label='刻章单位'>-->
                        <!--{{viewData.stampCompany==="A"?"营业执照+公章" :viewData.stampCompany==="B1"?"营业执照+公章+发票":viewData.stampCompany==="B2"?"营业执照+公章+开户":viewData.stampCompany==="C"?"营业执照+公章+发票+开户":'&#45;&#45;'}}-->
                    <!--</a-form-item>-->

                        <a-form-item label='刻章单位'>
                            {{viewData.stampCompanyName ||'--'}}
                        </a-form-item>
                </a-col>
                    <a-col :span="12">
                        <a-form-item label='备注'>
                            {{viewData.bak || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <p class="des-label">附件</p>
                        <div class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <p v-for="file in viewData.attachmentList" :key="file.url">
                                <a :href="file.url" target="_blank">{{file.fileName}}</a>
                            </p>
                        </div>
                        <div class="des-content" v-else>--</div>
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
import { getDetail } from '@/remote/stamp';
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
