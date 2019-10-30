<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="考核规则查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='指标分类'>
                            {{viewData.indexName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='规则名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">计分标准项</p>
                        <p class="des-content">
                            {{viewData.description || '--'}}
                        </p>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='分值'>
                            {{viewData.score || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='累计限额'>
                            {{viewData.cumulativeLimit || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='计分公式'>
                            {{viewData.scoreTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='打分设置'>
                            {{viewData.scoreSourceName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='默认打分'>
                            {{viewData.defaultScore || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" v-if="viewData.scoreSourceName==='自动计算'">
                        <a-form-item label='数据接口'>
                            {{viewData.dataTypeName}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Button, Form, Drawer, Spin } from 'ant-design-vue';
import { getDetail } from '@/remote/rule';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const dataTypeList = [
  { value: 1, name: '迟到' },
  { value: 2, name: '早退' },
  { value: 3, name: '未打卡' },
  { value: 5, name: '办件量' },
  { value: 7, name: '网上申报率' },
  { value: 9, name: '资源精简率' },
  { value: 11, name: '群众满意度' }];
export default {
  name: 'DetailView',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelectOption: Option,
    ADrawer: Drawer,
    ASpin: Spin,
  },
  props: ['viewVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
      dataTypeList,
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
              let dataTypeName
              dataTypeList.forEach(p=>{
                  if (p.value==res.data.dataType)  {
                      dataTypeName = p.name
                      return p.name
                  }
              })
            this.viewData = {
              ...res.data,
              state: String(res.data.state),
                dataTypeName:dataTypeName
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>

<style lang="less">

</style>
