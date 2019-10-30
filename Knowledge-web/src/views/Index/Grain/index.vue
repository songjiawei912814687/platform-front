<template>
  <div class="content-wrap">
    <h2 class="content__title">最小颗粒管理</h2>
    <search-box @onSearch="handleSearch" @onReset="handleReset">
      <search-box-item label="权力名称：">
        <a-input v-model="searchParams.qlName"/>
      </search-box-item>
      <search-box-item label="情况分类：">
        <a-input v-model="searchParams.happeningType"/>
      </search-box-item>
      <search-box-item label="组织机构：">
        <!--<a-select placeholder='请选择组织机构' v-model = "searchParams.acpInstitution" showSearch = true>-->
        <!--<a-select-option-->
        <!--v-for = "item in acpInstitutionList"-->
        <!--:value = "item"-->
        <!--:key = "item">-->
        <!--{{item}}-->
        <!--</a-select-option>-->
        <!--</a-select>-->

        <a-tree-select
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="orgTreeData"
          showSearch
          treeNodeFilterProp="title"
          placeholder="请选择所属机构"
          treeDefaultExpandAll
          :rowKey="record => String(record.id)"
          v-model="searchParams.organizationId"
          :allowClear="true"
        ></a-tree-select>
      </search-box-item>
    </search-box>
    <div class="action">
      <a-button
        @click="handleDrawerToggle('addVisible', true)"
        v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_ADD') > -1"
      >录入</a-button>
    </div>
    <div class="content">
      <a-table
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :scroll="scroll"
        :rowKey="record => record.id"
        @change="onPageChange"
        :pagination="false"
      >
        <span slot="action" slot-scope="text, record">
          <a
            href="javascript:;"
            @click="publish({id: record.id})"
            v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_EDITOR') > -1&&
                       (String(record.orgId)==String(orgId)||String(username) ==='中心机关')"
          >{{record.amputated===0?'取消发布':'发布'}}</a>
          <a-divider
            type="vertical"
            v-if="String(record.orgId)==String(orgId)||String(username) ==='中心机关'"
          />
          <a
            href="javascript:;"
            @click="handleModifyShow(record)"
            v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_EDITOR') > -1&&
                       (String(record.orgId)==String(orgId)||String(username) ==='中心机关')"
          >编辑</a>
          <a-divider
            type="vertical"
            v-if="String(record.orgId)==String(orgId)||String(username) ==='中心机关'"
          />
          <a
            href="javascript:;"
            @click="handleViewShow(record)"
            v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_VIEW') > -1"
          >查看</a>
          <a-divider type="vertical"/>
          <a
            href="javascript:;"
            @click="setDataList(record)"
            v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_MATERIALLIST') > -1"
          >材料清单</a>
          <a-divider
            type="vertical"
            v-if="String(record.orgId)==String(orgId)||String(username) ==='中心机关'"
          />
          <a-popconfirm
            title="确认要删除此条数据?"
            @confirm="handleDelete({idList: record.id})"
            okText="确认"
            cancelText="取消"
          >
            <a
              href="javascript:;"
              v-if="authorityActionList.indexOf('A_KNOWLEDGE_MINIMUMPARTICALMANAGEMENT_DELETE') > -1&&
                       (String(record.orgId)==String(orgId)||String(username) ==='中心机关')"
            >删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <drawer-wrap
      :wrapVisible="wrapVisible"
      :grainId="grainId"
      :qullFullId="qullFullId"
      :parentId="parentId"
      :organizationId="organizationId"
      :handleClose="() => handleDrawerToggle('wrapVisible', false)"
    ></drawer-wrap>
    <add
      :addVisible="addVisible"
      @successCallback="handleAddSuccess"
      :modifyId="modifyId"
      :QlTreeData="QlTreeData"
      :handleClose="() => handleDrawerToggle('addVisible', false)"
    ></add>
    <detail-view
      :viewVisible="viewVisible"
      :modifyId="modifyId"
      :handleClose="() => handleDrawerToggle('viewVisible', false)"
    ></detail-view>
  </div>
</template>

<script>
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  DatePicker,
  Upload,
  Icon,
  Divider,
  Popconfirm,
  Switch,
  TreeSelect
} from "ant-design-vue";
import SearchBox from "@/components/SearchBox/SearchBox";
import SearchBoxItem from "@/components/SearchBox/SearchBoxItem";
import Add from "./Add";
import DetailView from "./DetailView";
import DrawerWrap from "./DrawerWrap";
import { autoDoFn, transformTree2, transformTree } from "@/utils/util";
import { getPage, getDel, getParList, publish } from "@/remote/grain";
import { findAccInsutudion } from "@/remote/power";
import { getOrgTree } from "@/remote/base";
const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: "权力名称",
    dataIndex: "qlName",
    width: 300
  },
  {
    title: "情况分类",
    dataIndex: "happeningType",
    width: 300
  },
  {
    title: "受理机构",
    dataIndex: "acpInstitution",
    width: 300
  },

  {
    title: "适用范围",
    dataIndex: "process"
  },
  {
    title: "操作",
    key: "action",
    width: 320,
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "Index",
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATable: Table,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ADatePicker: DatePicker,
    AUpload: Upload,
    AIcon: Icon,
    ADivider: Divider,
    APopconfirm: Popconfirm,
    ASwitch: Switch,
    ATreeSelect: TreeSelect,
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
    DrawerWrap
  },
  data() {
    return {
      columns,
      addVisible: false,
      viewVisible: false,
      wrapVisible: false,
      parentId: 0,
      selectStaffVisible: false,
      modifyId: "",
      grainId: "",
      orgId: localStorage.getItem("organId"),
      username: localStorage.getItem("userName"),
      data: [],
      orgTreeData: [],
      QlTreeData: [],
      acpInstitutionList: [],
      searchParams: {
        qlName: "",
        happeningType: "",
        organizationId: ""
      },
      loading: false,
      qullFullId: "",
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: true
      },
      authorityActionList: window.authorityActionList
      // pagination: {
      //   defaultCurrent: 1,
      //   total: 0,
      //   row: 10,
      //   page: 0,
      // },
    };
  },
  created() {
    this.initList();
    this.initBaseData();
  },
  methods: {
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams
        });
        if (res) {
          this.data = res.data;
        }
        this.loading = false;
      });
    },

    initBaseData() {
      autoDoFn(async () => {
        const orgRes = await findAccInsutudion();
        if (orgRes) {
          this.acpInstitutionList = orgRes.data;
        }
      });
      autoDoFn(async () => {
        const orgRes = await getOrgTree();

        if (orgRes) {
          if (orgRes.data.length == 0) {
            this.orgTreeData = transformTree([
              { id: localStorage.organId, name: localStorage.organName }
            ]);
          } else {
            this.orgTreeData = transformTree(orgRes.data);
          }
        }
      });
      autoDoFn(async () => {
        const ParList = await getParList();
        if (ParList) {
          this.QlTreeData = transformTree2(ParList.data);
        }
      });
    },
    handleModifyShow(rowData) {
      this.handleDrawerToggle("addVisible", true);
      this.modifyId = rowData.id;
      console.log("record.orgId:" + record.orgId);
    },
    handleViewShow(rowData) {
      this.handleDrawerToggle("viewVisible", true);
      this.modifyId = rowData.id;
    },
    handleDrawerToggle(type, isVisible) {
      this[type] = isVisible;
      if (!isVisible) {
        this.modifyId = "";
      }
    },
    handleAddSuccess() {
      this.handleDrawerToggle("addVisible", false);
      this.initList();
      this.initBaseData();
    },
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        happeningType: "",
        qlName: "",
        organizationId: ""
      };
      this.pagination = {
        defaultCurrent: 1,
        row: 10,
        page: 0
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    handleDelete(data) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel(data);
        if (res) {
          this.$message.success("删除成功");
          this.initList();
          this.initBaseData();
        } else {
          this.loading = false;
        }
      });
    },
    publish(data) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await publish(data);
        if (res) {
          this.$message.success(res.message);
          this.initList();
        } else {
          this.loading = false;
        }
      });
    },
    // 选择
    setDataList(record) {
      this.handleDrawerToggle("wrapVisible", true);
      this.grainId = record.id;
      this.qullFullId = record.qlsxId;
      this.parentId = record.parentId;
      this.organizationId = record.orgId;
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    }
  }
};
</script>

<style lang="less">
</style>
