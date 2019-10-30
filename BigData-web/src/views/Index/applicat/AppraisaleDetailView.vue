<template>
    <a-drawer :visible="appraisaleVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="员工加减分查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='指标分类'>
                            {{viewData.indexName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='考核规则'>
                            {{viewData.ruleId || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='组织机构'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='记录人'>
                            {{viewData.employeeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='记录时间'>
                            {{viewData.recordDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='分值'>
                            {{viewData.value || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='累计限额'>
                            {{viewData.limits || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='计分公式'>
                            {{viewData.scoreTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='计分设置'>
                            {{viewData.scoreSourceName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='默认打分'>
                            {{viewData.defaultScore || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='得分'>
                            {{viewData.score || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">描述</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">附件</p>
                        <p class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <a v-for="file in viewData.attachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </p>
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
import {getAppraisaleDetail} from "../../../remote/dtailView";
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
  props: ['appraisaleVisible', 'handleClose', 'modifyId','resourceId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
    };
  },
  watch: {
      appraisaleVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getAppraisaleDetail({ id: this.resourceId });
          if (res.success) {
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
