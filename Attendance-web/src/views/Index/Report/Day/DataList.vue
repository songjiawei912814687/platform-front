<template>
    <a-modal
            :title="modal.title"
            :visible="modal.visible"
            @cancel="handleCancel"
            v-if="modal.visible"
            :width="700"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </template>
        <a-table :columns="modal.columns"
                 :dataSource="data"
                 :loading="loading"
                 :rowKey="record => String(record.id)"
                 :pagination="false" >
            <span slot="startTime" slot-scope="text, record">{{record.startDate + ' ' + record.startTime}}</span>
            <span slot="endTime" slot-scope="text, record">{{record.endDate + ' ' + record.endTime}}</span>
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="handleViewShow(record)">查看</a>
            </span>
        </a-table>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :applicationTypeArr="applicationTypeArr"
                     :handleClose="() => this.viewVisible = false"></detail-view>
    </a-modal>
</template>

<script>
  import {getDetail} from '@/remote/reportDay';
  import {autoDoFn} from '@/utils/util';
  import {Modal, Button, Table} from 'ant-design-vue';
    import DetailView from '../../Leave/Supply/DetailView';

  const applicationTypeArr = [
    '',
    '临时外出二小时公事',
    '哺乳假',
    '孕假',
    '产假',
    '年休假',
    '因公外出',
    '事假',
    '病假',
    '其他',
    '临时外出二小时私事',
  ];

  export default {
    name: "DataList",
    data() {
      return {
        data: [],
        loading: false,
        applicationTypeArr,
        modifyId:'',
        viewVisible:false,
      }
    },
    components: {
      AModal: Modal,
      AButton: Button,
      ATable: Table,
      DetailView,
    },
    props: ['modal'],
    watch: {
      modal() {
        if (this.modal.visible) {
          autoDoFn(async () => {
            this.loading = true;
            let res = await getDetail({
              date: this.modal.record.date,
              employeeId: this.modal.record.employeeId,
            });
            if (res) {
              this.data = res.data;
            }
            this.loading = false;
          });
        }
      }
    },
    methods: {
      handleCancel() {
        this.$emit("close");
      },
      handleViewShow(rowData) {
        this.viewVisible = true;
        this.modifyId = rowData.id;
      },
    }
  }
</script>

<style scoped>

</style>
