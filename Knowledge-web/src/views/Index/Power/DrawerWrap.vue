<template>
    <Drawer :value="wrapVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="1200"
            title="材料清单">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <!--<search-box @onSearch="handleSearch" @onReset="handleReset">
                <search-box-item label="材料名称：">
                    <a-input v-model="searchParams.name"/>
                </search-box-item>
            </search-box>
            <div class="action" style="margin:20px 0">
                &lt;!&ndash;<a-button @click="handleDrawerToggle('addVisible1', true)">录入</a-button>&ndash;&gt;
            </div>-->
            <div class="content">
                <a-table :columns="columns"
                         :dataSource="data"
                         :loading="loading"
                         :scroll="scroll"
                         :rowKey="record => record.id">
                        <span slot="exampleTableFileName" slot-scope="text, record">
                            <a :href="record.exampleTableFileUrl">{{record.exampleTableFileName}}</a>
                        </span>
                    <span slot="emptyTableFileName" slot-scope="text, record">
                            <a :href="record.emptyTableFileUrl">{{record.emptyTableFileName}}</a>
                        </span>
                </a-table>
            </div>
        </a-spin>
    </Drawer>
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
    Drawer,
    DatePicker,
    Upload,
    Icon,
    Spin,
    Divider,
    Popconfirm,
    Switch,
  } from 'ant-design-vue';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';

  import {autoDoFn} from '@/utils/util';
  import {setData} from '@/remote/power';

  const {Item} = Form;
  const {Option} = Select;

  const columns = [
    {
      title: '材料名称',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: '材料形式',
      width: 200,
      dataIndex: 'materialFormName',
    },
    {
      title: '必要性及描述',
      width: 200,
      dataIndex: 'necessarilyDescription',
    },
    {
      title: '示例表',
      width: 150,
      dataIndex: 'exampleTableFileName',
      scopedSlots: {customRender: 'exampleTableFileName'},
    },
    {
      title: '空白表',
      width: 150,
      dataIndex: 'emptyTableFileName',
      scopedSlots: {customRender: 'emptyTableFileName'},
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
      ADrawer: Drawer,
      ASpin: Spin,
      SearchBox,
      SearchBoxItem,
    },
    props: ['wrapVisible', 'handleClose', 'grainId'],
    data() {
      return {
        columns,
        addVisible1: false,
        viewVisible1: false,
        selectStaffVisible: false,
        addLoading: false,
        selectedRowKeys: [],
        modifyId: '',
        data: [],
        classifyList: [],
        searchParams: {
          name: '',
        },
        loading: false,
        scroll: {
          y: document.documentElement.clientHeight - 301,
          x: 1000,
        },
        pagination: {
          defaultCurrent: 1,
          total: 0,
          row: 10,
          page: 0,
        },
      };
    },
    watch: {
      wrapVisible() {
        if (this.wrapVisible && this.grainId) {
          this.initList();
        }
      },
    },
    methods: {
      initList() {
        autoDoFn(async () => {
          this.loading = true;
          const res = await setData({
            // qullFullId: '010041000047033451514330183',
            qlInnerCode: this.grainId,
            ...this.searchParams,
            // ...this.pagination,

          });
          if (res && typeof res.data === 'object') {
            this.data = res.data;
            /* this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize; */
          }
          this.loading = false;
        });
      },
      handleExample(url) {
        window.open(url, '_blank');
      },
      handleBlank(name) {
        window.open(name, '_blank');
      },
      handleDrawerToggle(type, isVisible) {
        this[type] = isVisible;
        if (!isVisible) {
          this.modifyId = '';
        }
      },
      handleAddSuccess() {
        this.handleDrawerToggle('addVisible1', false);
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
    },
  };
</script>

<style lang="less">

</style>

