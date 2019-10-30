<template>
    <div class="content-wrap feedback_page">
        <h2 class="content__title">反馈信息</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="查询时间：" :span='1'>
                <a-range-picker v-model="searchParams.searchTime"
                                style="width: 100%"
                                format="YYYY-MM-DD"
                                :placeholder="['请选择时间', '请选择时间']">

                </a-range-picker>
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model.trim="searchParams.personName" placeholder="请输入姓名"/>
            </search-box-item>
            <search-box-item label="受理部门：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        v-model="searchParams.organizationId"
                        :treeData="organizationOptions"
                        treeDefaultExpandAll
                        :showSearch='true'
                        treeNodeFilterProp="title"
                        placeholder='请选择部门'
                ></a-tree-select>
            </search-box-item>
            <search-box-item label="人员工号：">
                <a-input v-model.trim="searchParams.employeesNo" placeholder="请输入人员工号"/>
            </search-box-item>

            <search-box-item label="手机号码：">
                <a-input v-model.trim="searchParams.phone" placeholder="请输入群众手机号码"/>
            </search-box-item>

            <search-box-item label="评价内容：">
                <a-input v-model.trim="searchParams.appraiseContent" placeholder="请输入群众回复内容"/>
            </search-box-item>

            <search-box-item label="满意率：">
                <a-select v-model="searchParams.satisfaction" placeholder="请选择满意率" style="width: 100%;">
                    <a-select-option value="0">满意</a-select-option>
                    <a-select-option value="1">不满意</a-select-option>
                </a-select>
            </search-box-item>

            <search-box-item label="实现率：">
                <a-select v-model="searchParams.complete" placeholder="请选择实现率" style="width: 100%;">
                    <a-select-option value="1">跑一次</a-select-option>
                    <a-select-option value="2">跑多次</a-select-option>
                </a-select>
            </search-box-item>
        </search-box>

        <div class='action' >
            <input style="display:none" type="file" ref="inputer" accept=".xls,.xlsx" @change="importExcel">
            <a-button @click="handleImport" :loading="importLoading" v-if="authorityActionList.indexOf('A_FEEDBACK_FEEDBACKINFORMATION_IMPORT') > -1" >导入</a-button>
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_FEEDBACK_FEEDBACKINFORMATION_EXPORT') > -1" >导出</a-button>
        </div>

        <div class="content" style="top: 150px;">
            <a-table :columns="columns"
                     :dataSource="tableData"
                     :loading="loading"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_FEEDBACK_FEEDBACKINFORMATION_VIEW') > -1">查看</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleModifyShow(record)" v-if="authorityActionList.indexOf('A_FEEDBACK_FEEDBACKINFORMATION_EDITOR') > -1">修改</a>
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

        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <add :viewVisible="addVisible"
                     :modifyId="modifyId"
             @successCallback="handleAddSuccess"
                     :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
    </div>
</template>

<script>
  import {
    Row,
    Col,
    Input,
    Button,
    Table,
    Select,
    Upload,
    DatePicker,
    Icon,
    Divider,
    Popconfirm,
    Cascader,
    TreeSelect
  } from 'ant-design-vue';

  const {Option} = Select;
  const {RangePicker} = DatePicker;
  import {autoDoFn, transformTree} from '@/utils/util';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
  import DetailView from './detailView';
  import Add from './add';

  import moment from 'moment';
  import {getOrganizationTree} from '@/remote/common';
  import {getPage, importExcel, exportExcel} from '@/remote/feedback';


  const columns = [
    {
      title: '姓名',
      dataIndex: 'personName',
      width: 100,
    }, {
      title: '电话',
      dataIndex: 'phone',
      width: 150,
    }, {
      title: '受理部门',
      dataIndex: 'organizationName',
      width: 170,
    }, {
      title:'窗口号',
          dataIndex:'windowNo',
          width:100,
      },{
      title:'业务名称',
          dataIndex:'matters',
          width:150,
      }, {
      title: '人员工号',
      dataIndex: 'employeesNo',
      width: 130,
    }, {
      title: '办理时间',
      dataIndex: 'feedbackTime',
      width: 130,
    }, {
      title: '评价状态',
      dataIndex: 'appraiseStateName',
      width: 100
    }, {
          title: '评价内容',
          dataIndex: 'appraiseContent',
          width: 200
      }, {
      title: '满意度',
      dataIndex: 'satisfactionName',
      width: 100,
    }, {
      title: '实现率',
      dataIndex: 'completeRateName',
      width: 100,
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      // fixed: 'right',
      scopedSlots: {customRender: 'action'},
    }
  ]

  const fileaccept = ['xls', 'xlsx']


  export default {
    name: 'index',
    components: {
      AInput: Input,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      ATable: Table,
      ASelect: Select,
      ASelectOption: Option,
      AUpload: Upload,
      AIcon: Icon,
      ADivider: Divider,
      APopconfirm: Popconfirm,
      ADatePicker: DatePicker,
      ARangePicker: RangePicker,
      SearchBox,
      SearchBoxItem,
      DetailView,
      Add,
      ACascader: Cascader,
      ATreeSelect: TreeSelect
    },
    data() {
      return {
        importLoading: false,    //导入的loading
        addVisible:false,
        searchParams: {
          personName: '',
          // organizationChose: [],
          organizationId: '',
          employeesNo: '',
          phone:'',
          satisfaction:'',
          complete:'',
          // 评价内容
          appraiseContent:'',
          searchTime: [],
        },
        organizationOptions: [],  //组织树列表
        hadChild: true,  //组织树是否有子元素
        columns: columns,
        tableData: [],    //假数据
        loading: false,
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          pagination: {
              pageSize: '10',
              defaultCurrent: 1,
              total: 0,
              rows: 10,
              page: 0,
          },
        modifyId: '',
        viewVisible: false,
        fileList: [],
        configType: '',
        authorityActionList: window.authorityActionList,
      }
    },
    created() {
      this.getOrganizationTree();
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
          const res = await getPage({
            ...this.searchParams,
            ...this.pagination,
              startTime: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD 00:00:00"):'',
              endTime: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD 23:59:59"):'',
          });
          if (res.success) {
            this.tableData = res.data.list;
            this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize;
          }
          this.loading = false;
        });
      },
      // 获取组织树
      getOrganizationTree() {
        autoDoFn(async () => {
          const res = await getOrganizationTree({})
          if (res.success) {
            this.organizationOptions = transformTree(res.data)
          }
        })
      },
      // 遍历组织树
      formatTree(data) {
        if (data && data.length) {
          return data.map(item => ({
            ...item,
            value: String(item.value),
            key: item.key,
            children: this.formatTree(item.children),
          }));
        }
      },
      handleSearch() {
        console.log(this.searchParams)
        this.initList();
      },
      handleReset() {
        this.searchParams = {
          personName: '',
          // organizationChose: [],
          organizationId: '',
          employeesNo: '',
            phone:'',
            appraiseContent:'',
            searchTime:'',
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
      onPageChange(pagination) {
        this.pagination.page = pagination.current;
        this.$nextTick(() => {
          this.initList();
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
      // 导入
      handleImport() {
        this.$refs.inputer.click();
      },
      // 导入
      importExcel(e) {
        autoDoFn(async () => {
          this.importLoading = true;
          let fd = new FormData();
          fd.append("file", e.target.files[0]);
          const res = await importExcel(fd);
          if (res) {
            if (res.success) {
              this.$message.success('导入成功');
              this.initList();
            } else {
              this.$message.error(res.message)
            }
          }
          this.importLoading = false;
        })
      },
      // 导出
      exportExcel() {
        autoDoFn(async () => {
          let res = await exportExcel({
            ...this.searchParams,
            startTime: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD 00:00:00"):'',
            endTime: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD 23:59:59"):'',
          });
          if (res) {
            window.open(`${res.data}`, '_blank');
          }
        });
      },

      beforeUpload(file) {
        console.log(file)
        const arr = file.name.split('.');
        if (fileaccept.indexOf(arr[arr.length - 1]) > -1) {
          return true;
        } else {
          this.$message.error('文件格式上传错误，支持".xls .xlsx"格式')
          return false;
        }
      },
      handleFormatError() {
        this.$message.error('文件格式上传错误')
      },
      handleAddSuccess() {
        this.handleDrawerToggle('addVisible', false);
        this.initList();
      },
      handleSuccess(res, file) {
        console.log(res)
        if (res.success) {
          this.$message.success('文件导入成功')
          autoDoFn(async () => {
            this.loading = true;
            const res = await importExcel({file});
            console.log(res)
            if (res.success) {
              this.initList();
            }
            this.loading = false;
          });
          // this.initList();
        }
        // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },

    }
  }
</script>

<style>
    .feedback_page .ivu-upload {
        display: inline-block !important;
        margin-right: 20px;
    }

    .feedback_page .ivu-upload-list {
        display: none;
    }
</style>
