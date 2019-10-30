<template>
    <a-modal
            :title="modal.title"
            :visible="modal.notSatisfactionVisible"
            @cancel="handleCancel"
            v-if="modal.notSatisfactionVisible"
            :width="850"
    >
        <template slot="footer">
            <a-button key="back" @click="handleCancel">关闭</a-button>
        </template>
        <a-table :columns="modal.notSatisfactionColumns"
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
    name: "notSatisfactionData",
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
        if (this.modal.notSatisfactionVisible) {
          autoDoFn(async () => {
            this.loading = true;
            let res = await selectUnstatisOrRunMany({
              satisfaction: '1',
              orgaId: this.modal.notSatisRecoed.orgaId,
              startTime:this.modal.notSatisRecoed.startTime,
              endTime:this.modal.notSatisRecoed.endTime,
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
