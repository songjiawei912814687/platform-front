<template>
    <div class="content-wrap">
        <h2 class="content__title">权力事项管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="权力名称：">
                <a-input v-model="searchParams.qlName"  @pressEnter="handleSearch"/>
            </search-box-item>
            <search-box-item label="涉及内容：">
                <a-input v-model="searchParams.contentInvolve"  @pressEnter="handleSearch"/>
            </search-box-item>
            <search-box-item label="热门事项：">
                <a-select placeholder='请选择是否是热门事项' v-model="searchParams.hot">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="最小颗粒：">
                <a-select placeholder='请选择是否是最小颗粒' v-model="searchParams.particles">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="组织机构：">
               <!--<a-select placeholder='请选择受理机构' v-model = "searchParams.acceptOrg" showSearch = true>-->
                   <!--<a-select-option-->
                           <!--v-for = "item in acpInstitutionList"-->
                           <!--:value = "item"-->
                           <!--:key = "item">-->
                      <!--{{item}}-->
                   <!--</a-select-option>-->
               <!--</a-select>-->

                <a-tree-select style="width: 100%"
                               :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                               :treeData="orgTreeData"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构'
                               treeDefaultExpandAll
                               :rowKey="record => String(record.id)"
                               v-model="searchParams.organizationId"
                               :allowClear="true">
                </a-tree-select>
            </search-box-item>
        </search-box>
        <div class="action">
            <!--<a-button @click="handleDrawerToggle('addVisible', true)">录入</a-button>-->
            <a-button @click="downloadExcel" v-if="authorityActionList.indexOf('A_KNOWLEDGE_POWERMATTERSMANAGEMENT_EXPORT') > -1">导出</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => record.qlInnerCode"
                     @change="onPageChange"
                     :pagination="pagination">

                <span slot="qlBasicCode" slot-scope="text, record">
                    {{record.qlKindName}}-{{record.qlMainitemId}}-{{record.qlSubitemId}}
                </span>
                <span slot="hot1" slot-scope="text, record">
                    <a-switch :checked="!!record.hot" checkedChildren="开" unCheckedChildren="关"
                              :disabled= "String(record.orgId)!==String(orgId)&&String(username) !=='中心机关'"
                              @change="checked => changeHot(checked, record)"/>
                </span>
                <span slot="min" slot-scope="text, record">
                    <a-switch :checked="!!record.particles" checkedChildren="开" unCheckedChildren="关"
                              :disabled= "String(record.orgId)!==String(orgId)&&String(username) !=='中心机关'"
                              @change="checked => changeParticles(checked, record)"/>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_POWERMATTERSMANAGEMENT_VIEW') > -1">查看</a>
                    <a-divider type="vertical"/>

                    <a href="javascript:;" @click="setDataList(record.qlInnerCode)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_POWERMATTERSMANAGEMENT_APPLYMATERIALS') > -1">申报材料</a>

                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleModifyShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_POWERMATTERSMANAGEMENT_EDITOR') > -1 &&
                         String(record.orgId)==String(orgId)||String(username) ==='中心机关'">
                        修改
                    </a>
                </span>
            </a-table>
            <div style="position: relative; left: 0px;top: -70px;width: 400px">
                <span style="margin: 20px 20px;">页/行</span>
                <a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;"
                          placeholder=''
                          :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option value = '10'>10/行</a-select-option>
                    <a-select-option value = '30'>30/行</a-select-option>
                    <a-select-option value = '50'>50/行</a-select-option>
                    <a-select-option value = '100'>100/行</a-select-option>
                </a-select>
                <span style="margin-left: 10px">共{{pagination.total}}条</span>
            </div>
        </div>
        <a-modal
                title="是否下载"
                :visible="visible"
                @ok="handleOk"
                @cancel="handleCancel">
            <p>{{ModalText}}</p>
        </a-modal>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <drawer-wrap
                :wrapVisible="wrapVisible"
                :grainId="grainId"
                :handleClose="() => handleDrawerToggle('wrapVisible', false)">
        </drawer-wrap>

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
  Modal,
  Divider,
  Popconfirm,
  Switch,
  TreeSelect
} from 'ant-design-vue';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import DrawerWrap from './DrawerWrap';
import { autoDoFn,transformTree3,transformTree } from '@/utils/util';
import {getOrgTree} from '@/remote/base';
import { getPage, setHot, setParticles, selectCount, download,findAccInsutudion } from '@/remote/power';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '权力基本码',
    dataIndex: 'qlBasicCode',
    width: 300,
    scopedSlots: { customRender: 'qlBasicCode' },
  },
  {
    title: '权力名称',
    dataIndex: 'qlNames',
    width: 300,
  },
  {
    title: '受理机构',
    width: 300,
    dataIndex: 'acpInstitution',
    // dataIndex: 'organizationName',

  },
  {
    title: '热门事项',
    width: 150,
    key: 'hot1',
    scopedSlots: { customRender: 'hot1' },
  },
  {
    title: '最小颗粒',
    width: 150,
    key: 'min',
    scopedSlots: { customRender: 'min' },
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  name: 'Index',
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
    AModal: Modal,
    ATreeSelect: TreeSelect,
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
    DrawerWrap,
  },
  data() {
    return {
      columns,
      addVisible: false,
      viewVisible: false,
      wrapVisible: false,
      visible: false,
      ModalText: '',
      grainId: '',
      orgId: localStorage.getItem("organId"),
      username:localStorage.getItem("userName"),
      modifyId: '',
      data: [],
      acpInstitutionList:[],
      classifyList: [],
      searchParams: {
        qlName: '',
        contentInvolve: '',
        hot: '',
        particles: '',
        organizationId:'',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: true,
      },
        orgTreeData:[],
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
            pageSize: '10',
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
        authorityActionList: window.authorityActionList,
    };
  },
  created() {
    this.initList();
    this.initBaseData();
  },
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams,
          ...this.pagination,
        });
        if (res) {
          this.data = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.page = res.data.pageNum;
          this.pagination.row = res.data.pageSize;
          console.log("this.data"+this.data)
        }
        this.loading = false;
      });
    },
      initBaseData() {
          autoDoFn(async () => {
              const orgRes = await getOrgTree();
              if (orgRes) {
                  if(orgRes.data.length==0){
                      this.orgTreeData = transformTree([{'id':localStorage.organId,'name':localStorage.organName}]);
                  }else{
                      this.orgTreeData = transformTree(orgRes.data);
                  }
              }
          });
          autoDoFn(async () => {
              const orgRes = await findAccInsutudion();
              if(orgRes){
                  this.acpInstitutionList = orgRes.data
              }
          });
      },
    handleModifyShow(rowData) {
      this.handleDrawerToggle('addVisible', true);
      this.modifyId = rowData.qlInnerCode;
    },
    handleViewShow(rowData) {
      this.handleDrawerToggle('viewVisible', true);
      this.modifyId = rowData.qlInnerCode;
    },
    handleDrawerToggle(type, isVisible) {
      this[type] = isVisible;
      if (!isVisible) {
        this.modifyId = '';
      }
    },
    handleAddSuccess() {
      this.handleDrawerToggle('addVisible', false);
      this.initList();
    },
    handleLeaveSuccess() {
      this.handleDrawerToggle('leaveVisible', false);
      this.initList();
    },
    setDataList(id) {
      this.handleDrawerToggle('wrapVisible', true);
      this.grainId = id;
    },
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        qlName: '',
        contentInvolve: '',
        hot: '',
        organizationId: '',
      };
      this.pagination = {
        defaultCurrent: 1,
        row: 10,
        page: 0,
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    changeHot(checked, record) {
      autoDoFn(async () => {
        const res = await setHot({ id: record.qlInnerCode, state: checked ? 1 : 0 });
        if (res) {
          this.$message.success('操作成功');
          this.initList();
        }
      });
    },
    changeParticles(checked, record) {
      autoDoFn(async () => {
        const res = await setParticles({ id: record.qlInnerCode, state: checked ? 1 : 0 });
        if (res) {
          this.$message.success('操作成功');
          this.initList();
        }
      });
    },
    downloadExcel() {
      this.visible = true;
      autoDoFn(async () => {
        const res = await selectCount();
        if (res) {
          this.ModalText = `共有${res.data}条数据是否需要导出？`;
        }
      });
    },
    handleOk() {
      autoDoFn(async () => {
        const res = await download();
        if (res) {
          window.open(`${res.data}`, '_blank');
          this.visible = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    },
  },
};
</script>

<style lang="less">

</style>
