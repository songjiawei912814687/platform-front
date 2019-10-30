<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="1000"
              title="咨询问题查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='问题标题'>
                            {{viewData.title || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
<!--                        <a-form-item label='问题内容'>-->
<!--                            {{viewData.description || '&#45;&#45;'}}-->
<!--                        </a-form-item>-->
                        <p class="des-label">答案</p>
                        <p class="des-content">
                            {{viewData.description || '--'}}
                        </p>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label='提问人'>
                            {{viewData.askName || '--'}}
                        </a-form-item>
<!--                        <p class="des-label">提问人</p>-->
<!--                        <p class="des-content">-->
<!--                            {{viewData.askName || '&#45;&#45;'}}-->
<!--                        </p>-->
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label='提问人手机号码'>
                            {{viewData.askTel || '--'}}
                        </a-form-item>
<!--                        <p class="des-label">提问人手机号码</p>-->
<!--                        <p class="des-content">-->
<!--                            {{viewData.askTel || '&#45;&#45;'}}-->
<!--                        </p>-->
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label='回答时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <p class="des-label">附件</p>
                        <div class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <p v-for="file in viewData.attachmentList" :key="file.url">
                                <a :href="file.url" target="_blank">{{file.fileName}}</a>
                            </p>
                        </div>
                        <div class="des-content" v-else>--</div>
                    </a-col>
                    <!--<a-col :span="24">-->
                        <!--<a-form-item label='是否公开'>-->
                            <!--{{viewData.isOpenName || '&#45;&#45;'}}-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="24">-->
                        <!--<a-form-item label='是否置顶'>-->
                            <!--{{viewData.isTopName || '&#45;&#45;'}}-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="24">-->
                        <!--<a-form-item label='最后回答人'>-->
                            <!--{{viewData.lastUpdateUserName || '&#45;&#45;'}}-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <!--<a-col :span="24">-->
                        <!--<a-form-item label='最后回答时间'>-->
                            <!--{{viewData.lastUpdateDateTime || '&#45;&#45;'}}-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->

                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Button, Form, Drawer, Spin, Tooltip } from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import { getDetail } from '@/remote/refer';

const { Item } = Form;

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
    ATooltip: Tooltip,
  },
  props: ['viewVisible', 'handleClose', 'modifyId'],
  data() {
    return {
        viewData: {},
        viewLoading: false,
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            this.viewData = {
              ...res.data,
            };
          }
          this.viewLoading = false;
        });
      }
    },
  },
};
</script>
<style>
    /*.ant-form label {*/
    /*    font-size: 18px;*/
    /*}*/
    .detail-view .ant-form-item-children {
        font-size: 18px;
    }
</style>
