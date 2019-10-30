<template>
    <a-modal
            :title="modal.title"
            :visible="modal.unSatisVisible"
            @cancel="handleCancel"
            v-if="modal.unSatisVisible"
            :width="1000"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </template>
        <a-table :columns="modal.unSatisColumns"
                 :dataSource="data"
                 :loading="loading"
                 :rowKey="record => String(record.id)"
                 :pagination="false" >
        </a-table>
    </a-modal>
</template>

<script>
  import {autoDoFn} from '@/utils/util';
  import {Modal, Button, Table} from 'ant-design-vue';
  import {selectUnstatisOrRunMany} from '@/remote/departsatis'
  export default {
    name: "unSatisfactionData",
    data() {
      return {
        data: [],
        loading: false,
        modifyId:'',
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
        if (this.modal.unSatisVisible) {
          autoDoFn(async () => {
            this.loading = true;
            let res = await selectUnstatisOrRunMany({
              satisfaction: '1',
                empNo: this.modal.unSatisRecord.empNo,
                startTime:this.modal.unSatisRecord.startTime,
              endTime:this.modal.unSatisRecord.endTime,
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
    }
  }
</script>

<style scoped>

</style>
