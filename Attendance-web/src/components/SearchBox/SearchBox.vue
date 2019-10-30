<template>
    <div class="gkp-search-box-wrap">
        <div class="gkp-search-box"
             :style="boxStyle">
            <a-row ref="node">
                <slot></slot>
            </a-row>
            <div class="search-btns" v-if="isShowBtn">
                <a-button @click="handleReset">{{resetTxt}}</a-button>
                <a-button @click="handleSearch" type="primary">{{searchTxt}}</a-button>
                <a-button v-if="allSpanNum > 4" :type="isOpen ? 'primary' : 'default'" @click="switchOpen" shape="circle">
                    <a-icon type="ellipsis" />
                </a-button>
            </div>
        </div>
    </div>

</template>

<script>
  import { Row, Button, Icon } from 'ant-design-vue';

  export default {
    name: 'SearchBox',
    components: {
      ARow: Row,
      AButton: Button,
      AIcon: Icon,
    },
    data() {
      return {
        isOpen: false,
        allSpanNum: 0,
      };
    },
    props: {
      searchTxt: {
        type: String,
        default: '查询',
      },
      resetTxt: {
        type: String,
        default: '重置',
      },
      isShowBtn: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      switchOpen() {
        this.isOpen = !this.isOpen;
      },
      handleReset() {
        this.$emit('onReset');
      },
      handleSearch() {
        this.$emit('onSearch');
      },
    },
    computed: {
      boxStyle() {
        return {
          height: this.isOpen ? 'auto' : '50px',
          paddingRight: this.isShowBtn ? (this.allSpanNum > 4 ? '250px' : '180px') : '0',
        };
      },
    },
    mounted() {
      this.$refs.node.$children.length && this.$refs.node.$children.forEach((item) => {
        this.allSpanNum += item._props.span;
      });
    },
  };
</script>

<style lang="less">
    .gkp-search-box-wrap{
        position: relative;
        z-index: 999;
        height: 50px;
        background-color: #fff;
    }
    .gkp-search-box{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        overflow: hidden;
        padding-right: 230px;
        padding-left: 24px;
        transition: all .5s;
        background-color: #fff;
        border-bottom: 1px solid #eef1f3;
    }
    .gkp-search-box .search-box-item-label{
        text-align: right;
        height: 32px;
        line-height: 32px;
        padding: 0;
        margin: 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .gkp-search-box .search-btns{
        position: absolute;
        right: 0;
        top: 0;
        .ant-btn{
            margin-right: 10px;
        }
    }
</style>
