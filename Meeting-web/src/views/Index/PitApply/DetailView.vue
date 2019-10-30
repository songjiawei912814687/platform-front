<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="会议预约查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='会议主题'>
                            {{viewData.theme || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='会议室'>
                            {{viewData.roomName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约日期'>
                            {{viewData.appointmentDate || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='开始时间'>
                            {{meetingTime1[viewData.startDateTime] ? meetingTime1[viewData.startDateTime].name : '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='结束时间'>
                            {{meetingTime1[viewData.endDateTime] ? meetingTime1[viewData.endDateTime+1].name : '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='主办单位'>
                            {{viewData.hostUnit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约人'>
                            {{viewData.employeesName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">与会人员</p>
                        <p class="des-content">{{ attendantsName || '--'}}</p>
                    </a-col>

                    <a-col :span="12"></a-col>
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
import { getDetail } from '@/remote/pitapply';
import { autoDoFn } from '@/utils/util';
import {meetingTime1} from '@/common/dictData';

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
      meetingTime1,
    };
  },
  computed: {
    attendantsName(){
      return this.viewData.attendantsName ? this.viewData.attendantsName.split(';').map(item => {
        return item.split(",")[1]
      }).join(',') : '--';
    },
      retireesName(){
          return this.viewData.retireesName ? this.viewData.retireesName.split(';').map(item => {
              return item.split(",")[1]
          }).join(',') : '--';
      }
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
