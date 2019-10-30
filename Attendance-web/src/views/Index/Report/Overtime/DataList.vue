<template>
    <a-modal
            :title="modal.title"
            :visible="modal.visible"
            @cancel="handleCancel"
            v-if="modal.visible"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </template>
        <a-table :columns="modal.columns"
                 :dataSource="data"
                 :loading="loading"
                 :rowKey="record => String(record.id)"
                 :pagination="false" />
    </a-modal>
</template>

<script>
  import {getOverTimePage, getAdjustPage} from '@/remote/reportOvertime';
  import {autoDoFn} from '@/utils/util';
  import {Modal, Button, Table} from 'ant-design-vue';

  export default {
    name: "DataList",
    data() {
      return {
        data: [],
        loading: false,
      }
    },
    components: {
      AModal: Modal,
      AButton: Button,
      ATable: Table,
    },
    props: ['modal'],
    watch: {
      modal() {
        if (this.modal.visible) {
          autoDoFn(async () => {
            this.loading = true;
            let res = null;
            if(this.modal.getPageName === 'getOverTimePage'){
              res = await getOverTimePage({
                organizationId: this.modal.record.organizationId,
                employeesId: this.modal.record.employeesId,
                reportDate: this.modal.reportDate,
              });
            }else{
              res = await getAdjustPage({
                organizationId: this.modal.record.organizationId,
                employeesId: this.modal.record.employeesId,
                reportDate: this.modal.reportDate,
              });
            }
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

    }
  }
</script>

<style scoped>

</style>
