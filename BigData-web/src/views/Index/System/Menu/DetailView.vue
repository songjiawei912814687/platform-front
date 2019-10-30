<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="组织机构查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='菜单名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='英文名'>
                            {{viewData.ename || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='菜单编号'>
                            {{viewData.code || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='是否展示'>
                            {{viewData.isShow === 0 ? '展示' : "不展示"}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='排序'>
                            {{viewData.disPlayOrderBy }}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='图标'>
                            {{viewData.icon || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='path'>
                            {{viewData.path || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='描述'>
                            {{viewData.description || '--'}}
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
import { Row, Col, Button, Form, Drawer, Spin, Tooltip } from 'ant-design-vue';
import { getDetail } from '@/remote/menu';
import { autoDoFn } from '@/utils/util';

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
              parentId: String(res.data.parentId),
              type: String(res.data.type),
              assessmentState: String(res.data.assessmentState),
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
    .org-view-form {
        .ant-form-item-children {
            font-size: 16px;
            color: #333;
        }
    }
</style>
