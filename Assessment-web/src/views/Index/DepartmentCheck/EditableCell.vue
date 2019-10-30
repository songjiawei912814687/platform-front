<template>
    <div class='editable-cell'>
        <div v-if="editable" class='editable-cell-input-wrapper'>
            <a-input-number
                    :value="value"
                    @change="handleChange"
                    @pressEnter="check"
                    style="width：70px"/>
            <a-icon
                    style="cursor: pointer;font-size: 16px"
                    type='check'
                    class='editable-cell-icon-check'
                    @click="check"
            />
        </div>
        <div v-else class='editable-cell-text-wrapper'>
            {{value}}
            <a-icon type='edit' class='editable-cell-icon' @click="edit" style="cursor: pointer;font-size: 16px"/>
        </div>
    </div>
</template>
<script>
import { InputNumber, Icon } from 'ant-design-vue';

export default {
  props: {
    text: Number,
  },
  components: {
    AInputNumber: InputNumber,
    AIcon: Icon,
  },
  data() {
    return {
      value: window.isNaN(this.text) ? 0 : this.text,
      editable: false,
    };
  },
  methods: {
    handleChange(value) {
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
</script>
<style scoped>
    .ant-input-number {
        width: 70px;
    }
</style>
