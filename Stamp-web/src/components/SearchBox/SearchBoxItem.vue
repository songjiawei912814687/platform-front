<template>
    <div class="item-wrap">
        <a-col :xs="3" :sm="3" :md="3" :lg="2" :xl="2" :span="2" style="margin-bottom: 10px">
            <a-tooltip placement="topRight" >
                <template slot="title">
                    <span>{{label}}</span>
                </template>
                <p class="search-box-item-label">{{label}}</p>
            </a-tooltip>
        </a-col>
        <a-col  :xs="6 * colSpan - 3" :sm="6 * colSpan - 3" :md="6 * colSpan - 3" :lg="6 * colSpan - 2" :xl="6 * colSpan - 2" :span="6 * colSpan - 2" style="margin-bottom: 10px">
            <slot></slot>
        </a-col>
    </div>
</template>

<script>
import { Col, Tooltip } from 'ant-design-vue';

export default {
  name: 'SearchBoxItem',
  components: {
    ACol: Col,
    ATooltip: Tooltip,
  },
  props: {
    label: {
      default: '',
      type: String,
      required: true,
    },
    span: {
      default: 1,
      type: Number,
    },
  },
  computed: {
    colSpan() {
      if (this.span > 4 || this.span < 1) {
        return 1;
      }
      return this.span;
    },
  },
};
</script>
