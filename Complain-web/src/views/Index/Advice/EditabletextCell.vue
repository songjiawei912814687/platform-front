<template>
    <div class='editable-cell'>
        <div v-if="editable" class='editable-cell-input-wrapper'>
            <a-input
                    :value="value"
                    @change="handleChange"
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
import { Input, Icon } from 'ant-design-vue';

export default {
  props: {
    text: '',
  },
  components: {
    AInput: Input,
    AIcon: Icon,
  },
  data() {
    return {
      value:this.text,
      editable: false,
    };
  },
  methods: {
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    handleChange(e) {
      this.value = e.target.value;
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
