<template>
    <div>
        <div id="staff" >
            <Staff></Staff>
        </div>
        <div id="department">
            <Department></Department>
        </div>
        <div id="window">
            <Window></Window>
        </div>
        <div id="complaint">
            <Complaint></Complaint>
        </div>

    </div>
</template>

<script>
  import Staff from './Staff.vue';
  import Department from './Department.vue';
  import Window from './Window.vue';
  import Complaint from './Complaint.vue';

  export default {
    components: {
      Staff,
      Department,
      Window,
      Complaint,
    },
    name: 'index',
  };
</script>

<style lang="less">
</style>
