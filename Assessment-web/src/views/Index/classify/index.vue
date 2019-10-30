<template>
    <div class="content-wrap">
        <h2 class="content__title">指标分类</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="指标类型：">
                <a-select placeholder='请选择指标类型' v-model="searchParams.type">
                    <a-select-option value='0'>动态效能指标</a-select-option>
                    <a-select-option value='1'>常态效能指标</a-select-option>
                    <a-select-option value='3'>工作人员考核</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="指标名称：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
            <search-box-item label="对象类型：">
                <a-select placeholder='请选择对象类型' v-model="searchParams.objectType">
                    <a-select-option value='0'>窗口</a-select-option>
                    <a-select-option value='1'>工作人员</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="状态：">
                <a-select placeholder='请选择状态' v-model="searchParams.state">
                    <a-select-option value='0'>启用</a-select-option>
                    <a-select-option value='1'>停用</a-select-option>
                </a-select>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_ADD') > -1 || !useAuthority">录入
            </a-button>
            <!-- <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_PERSONNEL_JOBS_EXPORT') > -1">导出</a-button>-->
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_VIEW') > -1 || !useAuthority">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_EDITOR') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                     <template
                             v-if="record.state === 1 && authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_START') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleChangeState(record,true)">启用</a>
                    </template>
                   <template
                           v-else-if="record.state === 0 && authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_STOP') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleChangeState(record,false)">停用</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_DELETE') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
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
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
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
} from 'ant-design-vue';
import { getPage1, getDel, getStart, getStop } from '@/remote/classify';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

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
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender:(text, row, index)=>`${index + 1+this.pagination.pageSize*(this.pagination.page-1)}`,
          width: 50,
        },
        {
          title: '指标类型',
          dataIndex: 'typeName',
          width: 100,
        },
        {
          title: '分类名称',
          dataIndex: 'name',
          width: 100,
        },
        {
          title: '基准值',
          dataIndex: 'datumValue',
          width: 50,
        },
        {
          title: '累计最高加分',
          dataIndex: 'maxBonus',
          width: 60,
        },
        {
          title: '对象类型',
          dataIndex: 'objectName',
          width: 50,
        },
        {
          title: '状态',
          dataIndex: 'stateName',
          width: 50,
        },
        {
          title: '排序',
          dataIndex: 'displayOrder',
          width: 50,
        },
        {
          title: '操作',
          key: 'action',
          width: 400,
          scopedSlots: { customRender: 'action' },
        },
      ],
      addVisible: false,
      viewVisible: false,
      modifyId: '',
      data: [],
      searchParams: {
        // type:null,
        name: '',
        // objectType: null,
        // state:null
      },
      classifyList: [], // 分类列表
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1700,
      },
        pageSizeOptions: [10, 20, 30, 40, 50],
        pagination: {
            pageSize: 10,
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
      authorityActionList: window.authorityActionList,
      useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.initList();
  },
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage1({
          ...this.searchParams,
          ...this.pagination,
        });
        if (res.success) {
          this.data = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.page = res.data.pageNum;
          this.pagination.row = res.data.pageSize;
        }
        this.loading = false;
      });
    },
    handleModifyShow(rowData) {
      this.handleDrawerToggle('addVisible', true);
      this.modifyId = rowData.id;
    },
    handleViewShow(rowData) {
      this.handleDrawerToggle('viewVisible', true);
      this.modifyId = rowData.id;
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
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        name: '',
      };
      this.pagination = {
        pageSize: 10,
        defaultCurrent: 1,
        total: 0,
        rows: 10,
        page: 0,
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    handleDelete(id) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel({ id });
        if (res.success) {
          this.$message.success('删除成功');
          this.initList();
        } else {
          this.loading = false;
        }
      });
    },
    // 启用与停用
    handleChangeState(data, type) {
      this.loading = true;
      if (type) {
        autoDoFn(async () => {
          const res = await getStart({ idList: data.id });
          if (res.success) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      } else {
        autoDoFn(async () => {
          const res = await getStop({ idList: data.id });
          if (res.success) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      }
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
    .ant-select.ant-select-enabled {
        width: 100%;
    }
</style>
