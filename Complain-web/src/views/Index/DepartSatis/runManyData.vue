<template>
    <a-modal
            :title="modal.title"
            :visible="modal.runManyVisible"
            @cancel="handleCancel"
            v-if="modal.runManyVisible"
            :width="800"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </template>
        <a-table :columns="modal.runManyColumns"
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
    name: "DataList",
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
        if (this.modal.runManyVisible) {
          autoDoFn(async () => {
            this.loading = true;
              let res = await selectUnstatisOrRunMany({
                  completeRate: '2',
                  orgaId: this.modal.runManyRecord.orgaId,
                  startTime:this.modal.runManyRecord.startTime,
                  endTime:this.modal.runManyRecord.endTime,
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
