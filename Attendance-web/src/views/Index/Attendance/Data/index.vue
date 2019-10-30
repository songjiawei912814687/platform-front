<template>
    <div class="content-wrap">
        <h2 class="content__title">考勤数据管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <!--<search-box-item label="打卡时间：" :span="2">-->
                <!--<a-range-picker v-model="searchParams.searchTime"-->
                                <!--style="width: 100%"-->
                                <!--format="YYYY-MM-DD"-->
                                <!--:placeholder="['请选择开始日期', '请选择结束日期']">-->
                <!--</a-range-picker>-->
            <!--</search-box-item>-->

            <search-box-item  label="查询时间：" :span="2">
                <a-range-picker @change="changehandle2" v-model="searchParams.searchTime"
                                style="width: 100%" format="YYYY-MM-DD"
                                :placeholder="['请选择开始日期', '请选择结束日期']">
                </a-range-picker>
            </search-box-item>


            <search-box-item label="所属机构：">
                <a-tree-select style="width: 100%"
                               :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                               :treeData="orgTreeData"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构'
                               treeDefaultExpandAll :rowKey="record => String(record.id)"
                               v-model="searchParams.organizationId"
                               :allowClear="true"></a-tree-select>
            </search-box-item>
            <search-box-item label="验证方式：">
                <a-input v-model="searchParams.authentication" placeholder='请输入验证方式'/>
            </search-box-item>

            <search-box-item label="工号：">
                <a-input v-model="searchParams.no" placeholder='请输入工号'/>
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.employeeName" placeholder='请输入姓名'/>
            </search-box-item>

            <search-box-item label="考勤机名称：">
                <a-input v-model="searchParams.attendanceDeviceName" placeholder='请输入考勤机名称'/>
            </search-box-item>



        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCEDATA_ADD') > -1">补录</a-button>
            <a-button @click="handleGetLDK(data)" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCEDATA_ADD1') > -1">落地式考勤</a-button>
            <a-button @click="handleGetHIK(data)" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCEDATA_ADD2') > -1">挂壁式考勤</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <!--<span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                </span>-->
            </a-table>
            <div style="position: relative; left: 0px;top: -70px;width: 400px">
                <span style="margin: 20px 20px;">页/行</span>
                <a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;z-index: 999;"
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
             :orgTreeData="orgTreeData"
             :staffList="staffList"
             :handleClose="() => handleDrawerToggle('addVisible', false)">
        </add>
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
    TreeSelect,
  } from 'ant-design-vue';
  import {getPage, getDel,getLDKDate,getHikAttendance} from '@/remote/attendanceData';
  import {getOrgTree} from '@/remote/base';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
  import Add from './Add';
  import DetailView from './DetailView';
  import {autoDoFn, transformTree} from '@/utils/util';
  import {getIsPerson} from "@/remote/base";

  const {Item} = Form;
  const {Option} = Select;
  const {RangePicker} = DatePicker;
  const columns = [
    {
      title: '工号',
      dataIndex: 'employeeNo',
      width: 200
    },
    {
      title: '姓名',
      dataIndex: 'employeeName',
      width: 200
    },
    {
      title: '部门',
      dataIndex: 'organizationName',
      width: 300
    },
    {
      title: '考勤机名称',
      dataIndex: 'attendanceDeviceName',
      width: 350
    },
    {
      title: '验证方式',
      dataIndex: 'authentication',
      width: 300
    },
    {
      title: '打卡时间',
      dataIndex: 'punchTime',
      width: 300
    },
    {
      title: '备注',
      dataIndex: 'description',
      width: 300
    },
    /*{
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 230,
      scopedSlots: {customRender: 'action'},
    },*/
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
      ATreeSelect: TreeSelect,
      ARangePicker: RangePicker,
      SearchBox,
      SearchBoxItem,
      Add,
      DetailView,
    },
    data() {
      return {
        columns,
        addVisible: false,
        modifyId: '',
        data: [],
        viewVisible: false,
        searchParams: {
          no: '',
          employeeName: '',
          organizationName: '',
          searchTime: [],
        },


        loading: false,
        orgTreeData: [],
        staffList: [],
        scroll: {
          y: document.documentElement.clientHeight - 360,
          x: 1000,
        },
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
      this.initBaseData();
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

              startDate: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
              endDate:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

              // startTime: this.searchParams.searchTime[0].format("YYYY-MM-DD"),
              // endTime: this.searchParams.searchTime[1].format("YYYY-MM-DD"),

            // startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
            // endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

          });
          if (res) {
            this.data = res.data.list;
            this.pagination = {
              rows: res.data.pageSize,
              page: res.data.pageNum,
              total: res.data.total,
            }
          }
          this.loading = false;
        });
      },
      initBaseData() {
        autoDoFn(async () => {
          const orgRes = await getOrgTree();
          if (orgRes) {
            this.orgTreeData = transformTree(orgRes.data);
          }
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
      // handleGetLDK(data){
      //     autoDoFn(async () => {
      //         const getLDK = await getLDKDate(data);
      //         if (getLDK) {
      //             this.$message.success('拉取成功');
      //         }
      //         this.$message.falseValue('拉取失败');
      //     });
      // },

        handleGetLDK() {
            autoDoFn(async () => {
                let getLDK = await getLDKDate({
                    ...this.searchParams,
                    startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                    endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
                });
                if (getLDK) {
                    this.$message.success('拉取成功');
                }
                this.$message.falseValue('拉取失败');
            })
        },

        handleGetHIK() {
            autoDoFn(async () => {
                let getHIK = await getHikAttendance({
                    ...this.searchParams,
                    startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                    endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
                });
                if (getHIK) {
                    this.$message.success('拉取成功');
                }
                this.$message.falseValue('拉取失败');
            })
        },


      handleAddSuccess() {
        this.handleDrawerToggle('addVisible', false);
        this.initList();
      },
      handleSearch() {
        this.initList();
      },
      handleReset() {
        this.searchParams = {
          no: '',
          name: '',
          organizationId: undefined,
          punchTime: '',
          row: 10,
          page: 0,
        };
        this.$nextTick(() => {
          this.initList();
        });
      },
      handleDelete(data) {
        autoDoFn(async () => {
          this.loading = true;
          let res = await getDel(data);
          if (res) {
            this.$message.success('删除成功');
            this.initList();
          }
          this.loading = false;
        });
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
