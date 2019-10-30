<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="1200"
              title="权力事项查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="36">
                    <a-col :span="12">
                        <a-form-item label='权力名称'>
                            {{viewData.qlNames || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='权力编号'>
                            {{viewData.qlFullId || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='办件类型'>
                            {{viewData.bjtypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='涉及内容'>
                            {{viewData.contentInvolve || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='适用对象'>
                            {{viewData.applicableObject || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='权力事项类型'>
                            {{viewData.qlKindName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='权力来源'>
                            {{viewData.itemsourceName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='受理机构'>
                            {{viewData.acpInstitution || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='联办机构'>
                            {{viewData.decInstitution || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='责任科室'>
                            {{viewData.leadDept || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='事项审查类型'>
                            {{viewData.shixiangsctypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='申请方式'>
                            {{viewData.applyTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='联系电话'>
                            {{viewData.applyTypeTel || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='跟新时间'>
                            {{viewData.updateDate || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='办公地址'>
                            {{viewData.addressInfo || '--'}}
                        </a-form-item>
                        <a-col :span="12">
                            <a-form-item label='咨询电话'>
                                {{viewData.linkTel || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='监督投诉电话'>
                                {{viewData.superviseTel || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='审批结果'>
                                {{viewData.banjianFinishfiles || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='办事者到办事现场次数'>
                                {{viewData.applyerminCount || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='承诺期限'>
                                {{viewData.promiseDay || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='法定期限'>
                                {{viewData.anticipateDay || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='热门事项'>
                                {{viewData.hotName || '--'}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='最小颗粒'>
                                {{viewData.particlesName || '--'}}
                            </a-form-item>
                        </a-col>
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
import { autoDoFn } from '@/utils/util';
import { getDetail } from '@/remote/power';

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
