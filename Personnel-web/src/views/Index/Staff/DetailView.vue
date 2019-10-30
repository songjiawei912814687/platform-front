<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="人员信息查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='工号'>
                            {{viewData.employeeNo || '--'}}
                        </a-form-item>
                        <a-form-item label='姓名'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='头像'>
                            <img v-if="viewData.icon" :src="viewData.icon" style="width: 120px; height: 120px" alt="avatar"/>
                            <p v-else>无</p>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='组织机构'>
                            {{viewData.organizationId === '0' ? '无' : (viewData.organizationName || '--')}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='职务'>
                            {{viewData.jobsName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='身份证'>
                            {{viewData.idCard || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                                label='人员类型'>
                            {{['后台', '窗口', '行政','其他'][viewData.windowState] || ''}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-if="String(viewData.windowState) === '0'">
                        <a-form-item label='后台'>
                            {{viewData.office || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-if="String(viewData.windowState) === '1'">
                        <a-form-item label='窗口'>
                            {{viewData.windowNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='出生日期'>
                            {{viewData.dateBirth || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='性别'>
                            {{viewData.sex === '0' ? '男' : '女'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='人员编制'>
                            <!--{{String(viewData.userCompile) === '0' ? '公务员' : '编外人员'}}-->
                            {{['国家机关人员编制','国家事业单位人员编制','国家企业单位人员编制','编外人员'][viewData.userCompile] || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='婚姻状态'>
                            {{['未婚','已婚','离异','丧偶'][viewData.maritalStatus] || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='入职日期'>
                            {{viewData.inductionDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='民族'>
                            {{viewData.national || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='学历'>
                            {{viewData.recordOfFormalSchoolingName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='政治面貌'>
                            {{viewData.partyMemberStateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-show="partyMemberStateState === '1' || partyMemberStateState === '2' || partyMemberStateState === '4'">
                        <a-form-item label='所属党支部'>
                            {{viewData.partyBranchName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-show="partyMemberStateState === '1' || partyMemberStateState === '2' || partyMemberStateState === '4'">
                        <a-form-item label='入党时间'>
                            {{viewData.joinPartyDate || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='手机号码'>
                            {{viewData.phoneNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='办公电话'>
                            {{viewData.officePhone || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='在职状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='市民卡号'>
                            {{viewData.citizenCards || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='市民卡物理地址'>
                            {{viewData.citizenCardPhysicalAddress || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='市民卡银行卡号'>
                            {{viewData.bankCardNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='车牌号'>
                            {{viewData.plateNo || '--'}}
                        </a-form-item>
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
import { getDetail } from '@/remote/staff';
import { autoDoFn } from '@/utils/util';
import {partyMemberStateData} from "../../../common/dictData";

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
        partyMemberStateState: ''
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
              formationStatus: String(res.data.formationStatus),
              partyMemberState: String(res.data.partyMemberState),
              sex: String(res.data.sex),
              userCompile: String(res.data.userCompile),
              workingState: String(res.data.workingState),
            };
            this.partyMemberStateState = String(res.data.partyMemberState)
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>
