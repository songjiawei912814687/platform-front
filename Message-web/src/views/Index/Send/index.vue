<template>
  <div class="content-wrap">
    <div class="send-content-wrap">
      <h2 class="content__title">发短信</h2>
      <div class="send-content">
        <a-form
          @submit="handleSubmit"
          layout="vertical"
          :autoFormCreate="(form)=>{this.form = form}"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="是否定时"
                fieldDecoratorId="isTiming"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否定时!'}]}"
              >
                <a-select placeholder="请选择是否定时" @change="setTime">
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="showSelectTime">
              <a-form-item
                label="定时时间"
                fieldDecoratorId="timingTime"
                :fieldDecoratorOptions="{rules: [{ required: showSelectTime, message: '请选择定时时间!'}]}"
              >
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="接收小组" fieldDecoratorId="groupIdList">
                <a-select placeholder="请选择接收小组" mode="multiple">
                  <a-select-option
                    v-for="item in groupList"
                    :value="String(item.id)"
                    :key="String(item.id)"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" style="position: relative; padding-right: 180px">
              <a-form-item label="接收人员" fieldDecoratorId="sendIdList">
                <a-select mode="multiple">
                  <a-select-option
                    v-for="item in sendList"
                    :value="String(item.id)"
                    :key="String(item.id)"
                  >{{item.phoneNumber}}/{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <!-- <a-form-item
                                    label='接收人员'
                                    fieldDecoratorId="sendList">
                                <a-text-area :autosize="{ minRows: 1 }" placeholder='请选择接收人员'/>
              </a-form-item>-->
              <a-button
                style="position: absolute; right: 110px; top: 28px;"
                type="danger"
                @click="clearStaffSelect"
              >清空</a-button>
              <a-button
                style="position: absolute; right: 12px; top: 28px;"
                type="primary"
                @click="staffSelect"
                v-if="authorityActionList.indexOf('A_MESSAGE_SENDMESSAGE_ADDPERSON') > -1"
              >添加人员</a-button>
            </a-col>
            <a-col :span="24" style="position: relative; padding-right: 130px">
              <a-form-item label="接收号码" fieldDecoratorId="phoneList">
                <a-text-area :autosize="{ minRows: 1 }" placeholder="请添加号码" disabled/>
              </a-form-item>
              <a-button
                style="position: absolute; right: 12px; top: 28px;"
                type="primary"
                @click="addPhoneNumShow"
                v-if="authorityActionList.indexOf('A_MESSAGE_SENDMESSAGE_ADDNUMBER') > -1"
              >添加号码</a-button>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="短信内容"
                fieldDecoratorId="description"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入短信内容!'},{max:255,message:'最多105个字符！'}]}"
              >
                <a-text-area placeholder="请输入短信内容" style="height: 150px"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="send-footer">
        <a-button
          @click="handleSubmit"
          type="primary"
          :loading="addLoading"
          v-if="authorityActionList.indexOf('A_MESSAGE_SENDMESSAGE_SEND') > -1"
        >发送</a-button>
      </div>
    </div>
    <!--<add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :staffList="staffList"
    :handleClose="() => handleDrawerToggle('addVisible', false)"></add>-->
    <staff-modal
      :membersVisible="selectStaffVisible"
      :propsSelectedRowKeys="selectedRowKeys"
      :organTree="orgTreeData"
      @cancel="() => this.selectStaffVisible = false"
      @ok="handleSelectStaffOk"
      type="checkbox"
    ></staff-modal>
    <a-modal
      title="添加号码"
      :visible="phoneVisible"
      @cancel="phoneVisible = false"
      @ok="handlePhoneOk"
      :width="760"
    >
      <div class="phone-header">
        <a-row :gutter="16">
          <a-col :span="12">
            <p>会议主题：</p>
            <a-input v-model="phoneForm.keyWord"></a-input>
          </a-col>
          <a-col :span="12">
            <p>手机号码：</p>
            <a-input v-model="phoneForm.mobilPhone"></a-input>
          </a-col>
        </a-row>
        <a-button class="add-phone-num" @click="handleSearch">查询</a-button>
        <a-row>
          <a-upload
            name="files"
            :multiple="true"
            action="/api-message/msg/importMobilephone"
            :showUploadList="false"
            @change="handleChange"
          >
            <a-button :loading="uploadLoading">导入</a-button>
          </a-upload>
        </a-row>
      </div>
      <a-table
        :columns="columns"
        :dataSource="dataList"
        :rowKey="record => String(record.id)"
        :loading="loading"
        :pagination="false"
        :destroyOnClose="true"
        :rowSelection="{selectedRowKeys: selectedRowKeys, hideDefaultSelections: true, type: 'checkbox', selections: true, onChange: onSelectChange}"
      ></a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Drawer,
  Spin,
  TreeSelect,
  DatePicker,
  Modal,
  Table,
  Divider,
  Upload,
  message
} from "ant-design-vue";
import { formPost, getImportLists } from "@/remote/message";
import { getPage, getOrgTree, getAll } from "@/remote/group";
import { findConfigs } from "@/remote/stencil";
import { autoDoFn, transformTree2 } from "@/utils/util";
import Add from "./Add";
import StaffModal from "@/components/StaffModal/StaffModal";
import moment from "moment";

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const columns = [
  {
    title: "会议主题",
    dataIndex: "keyWord"
  },
  {
    title: "电话号码",
    dataIndex: "mobilPhone"
  }
];
export default {
  name: "index",
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ATextArea: TextArea,
    ADrawer: Drawer,
    ASpin: Spin,
    ATreeSelect: TreeSelect,
    ADatePicker: DatePicker,
    ATable: Table,
    AModal: Modal,
    ADivider: Divider,
    Add,
    StaffModal,
    AUpload: Upload
  },
  data() {
    return {
      loading: false,
      addLoading: false,
      uploadLoading: false,
      selectStaffVisible: false,
      showSelectTime: false,
      selectedRowKeys: [],
      selections: [],
      staffList: [],
      typeList: [],
      sendList: [],
      sendIdList: [],
      groupList: [],
      orgTreeData: [],
      addPhoneVisible: false,
      phoneList: [],
      dataList: [],
      phoneVisible: false,
      columns,
      phoneForm: {
          keyWord: "",
        mobilPhone: "",
        id: ""
      },
      authorityActionList: window.authorityActionList,
      useAuthority: window.defaultConfig.useAuthority
    };
  },
  created() {
    this.initBaseData();
    this.initOrganData();
  },
  methods: {
    moment,

    initBaseData() {
      autoDoFn(async () => {
        const res = await findConfigs({});
        if (res.success) {
          this.typeList = res.data;
        }
      });
      autoDoFn(async () => {
        const res = await getAll({ row: 9999 });
        if (res) {
          this.groupList = res.data;
        }
      });
    },
    initOrganData() {
      autoDoFn(async () => {
        const orgRes = await getOrgTree();
        if (orgRes) {
          this.orgTreeData = [
            {
              label: "无",
              value: "0",
              key: "0",
              children: transformTree2(orgRes.data)
            }
          ];
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var sendIdLists = values.sendIdList
            ? values.sendIdList.join(",")
            : "";
          this.sendList = this.sendList.filter(
            item => sendIdLists.indexOf(String(item.id)) !== -1
          );
          if (
            !(values.groupIdList && values.groupIdList.length) &&
            !this.sendList.length &&
            !this.phoneList.length
          ) {
            this.$message.error("接受人员、小组、号码必须填一个！");
            return false;
          }
          if (
            window.parseInt(values.isTiming) &&
            values.timingTime.valueOf() < moment().valueOf()
          ) {
            this.$message.error("定时时间不能小于当前时间！");
            return false;
          }
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost('', {
              name: String(values.name),
              description: String(values.description),
              isTiming: window.parseInt(values.isTiming),
              sendList: [
                ...this.sendList.map(
                  item => `${item.phoneNumber}/${item.name}`
                ),
                ...this.phoneList.map(item => `${item.mobilPhone}/${item.keyWord}`)
              ],
              timingTime: values.timingTime
                ? values.timingTime.format("YYYY-MM-DD HH:mm:ss")
                : "",
              // type: window.parseInt(values.type),
              groupIdList: values.groupIdList
                ? values.groupIdList.join(",")
                : ""
            });
            if (res.success) {
              this.$message.success("操作成功");
              this.sendList = [];
              this.sendIdList = [];
              this.phoneList = [];
              this.form.setFieldsValue({
                sendList: "",
                phoneList: "",
                timingTime: undefined,
                groupIdList: [],
                sendIdList: this.sendIdList,
                description: ""
              });
            }
            this.addLoading = false;
          });
        }
      });
    },
    // 时间选择
    setTime(value) {
      if (value === "1") {
        this.showSelectTime = true;
      } else {
        this.showSelectTime = false;
      }
    },
    // 选择人员
    staffSelect() {
      this.selectStaffVisible = true;
    },
    // 清空人员
    clearStaffSelect() {
      this.selectedRowKeys = [];
      this.sendList = [];
      this.sendIdList = [];
      this.form.setFieldsValue({
        sendList: "",
        sendIdList: this.sendIdList
      });
    },
    handleSearch() {
      this.searchList();
    },
    addPhoneNumShow() {
      this.phoneVisible = true;
      this.phoneForm = {
        keyWord: "",
        mobilPhone: ""
      };
      this.searchList();
    },
    searchList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getImportLists({
          ...this.phoneForm
        });
        if (res.success) {
          this.dataList = res.data;
        }
        this.loading = false;
      });
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selections = selectedRows;
    },

    handlePhoneOk() {
      this.form.setFieldsValue({
        phoneList: this.selections
          .map(item => `${item.mobilPhone}/${item.keyWord}`)
          .join(",")
      });
      this.phoneList = this.selections;
      this.phoneVisible = false;
    },
    addPhoneNumToList() {
      let phoneList = [...this.phoneList];
      if (!this.phoneForm.name) {
        this.$message.error("请输入姓名");
        return false;
      }
      let reg = /^1[0-9]{10}$/;
      if (!this.phoneForm.phone || !reg.test(this.phoneForm.phone)) {
        this.$message.error("请输入正确电话号码");
        return false;
      }
      if (this.phoneForm.id) {
        let index = phoneList.length
          ? phoneList.findIndex(item => item.id === this.phoneForm.id)
          : -1;
        if (index > -1) {
          phoneList.splice(index, 1, Object.assign({}, this.phoneForm));
        }
      } else {
        phoneList.push({
          ...Object.assign({}, this.phoneForm),
          id: String(new Date().getTime())
        });
      }
      this.phoneList = phoneList;
      this.phoneForm = {
        name: "",
        phone: ""
      };
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      console.log(selections);
      const oldSelectionKeys = this.sendList.map(item => String(item.id));
      const newSelections = selections.filter(
        item => oldSelectionKeys.indexOf(String(item.id)) === -1
      );
      const allSelections = [...this.sendList, ...newSelections];
      this.sendList = allSelections;
      const newKeys = newSelections.map(item => String(item.id));
      this.sendIdList =
        this.form.getFieldValue("sendIdList") === undefined
          ? []
          : this.form.getFieldValue("sendIdList");
      this.sendIdList = [...this.sendIdList, ...newKeys];
      this.form.setFieldsValue({
        sendList: allSelections
          .map(item => `${item.phoneNumber}/${item.name}`)
          .join(","),
        sendIdList: this.sendIdList
      });
      this.selectStaffVisible = false;
    },
    updatePhoneHandle(record) {
      this.phoneForm = Object.assign({}, record);
    },
    deletePhoneHandle(record) {
      this.phoneList = this.phoneList.filter(item => item.id !== record.id);
    },
    handleChange(e) {
      this.uploadLoading = true;
      if (e.file.response.success) {
        message.info("导入成功");
        this.uploadLoading = false;
        this.searchList();
      } else {
        message.error(e.file.response.message);
        this.uploadLoading = false;
      }
      console.log(e);
    }
  }
};
</script>
<style lang="less" scoped>
.send-content-wrap {
  position: absolute;
  bottom: 80px;
  top: 0;
  left: 0;
  right: 0;
  .send-content {
    padding: 0 24px;
  }
  .send-footer {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    right: 0;
    text-align: right;
    padding-right: 20px;
    border-top: 1px solid #ccc;
    padding-top: 10px;
  }
}
.phone-header {
  position: relative;
  padding-right: 100px;
  .add-phone-num {
    position: absolute;
    top: 20px;
    right: 0;
  }
}
</style>
