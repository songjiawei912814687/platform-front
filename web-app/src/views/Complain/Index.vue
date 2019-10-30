<template>
    <div style="padding-bottom: 60px">
        <mt-field label="姓名" placeholder="请输入姓名" v-model="formData.suggestionName"></mt-field>
        <mt-field label="电话" placeholder="请输入电话" v-model="formData.suggestionPhoneNumber" type="tel"></mt-field>
        <mt-cell title="投诉部门" is-link @click.native="departVisible = true">{{formData.organizationName}}</mt-cell>
        <mt-cell title="投诉窗口" is-link @click.native="windowVisible = true" :disabled="!formData.organizationName">{{formData.windowNo}}</mt-cell>
        <!--<mt-field label="投诉部门" placeholder="请选择投诉部门"></mt-field>-->
        <mt-field label="投诉工号" placeholder="请输入投诉工号" v-model="formData.employeeNo" type="number"></mt-field>
        <mt-cell title="投诉内容"></mt-cell>
        <mt-field placeholder="请输入投诉内容" type="textarea" rows="4" v-model="formData.content"></mt-field>
        <div style="padding: 10px">
            <a-upload name="file"
                      listType="picture-card"
                      action="/upload"
                      :fileList="fileList"
                      :data="{resourceType: 3}"
                      @change="handleChange"
            >
                <div>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传图片</div>
                </div>
            </a-upload>
        </div>
        <div style="padding:0 10px;position: fixed;bottom: 10px;width: 100%">
            <a-button type="primary" block :loading="loading" @click="addComplain">提交</a-button>
        </div>

        <a-drawer
                :visible="departVisible"
                :maskClosable="true"
                :closable="false"
                @close="departVisible = false"
        >
            <div slot="title" class="org-title">
                <span>选择部门</span>
                <a @click="backUpper" v-if="path.length">上一级</a>
            </div>
            <div class="tab-content">
                <mt-cell v-for="(item, index) in currentList"
                         :key="index"
                         @click.native="selectDepartment(item)"
                         :title="item.name"></mt-cell>
            </div>
        </a-drawer>

        <a-drawer
                :visible="windowVisible"
                :maskClosable="true"
                :closable="false"
                @close="windowVisible = false"
        >
            <div slot="title" class="org-title">
                <span>选择窗口</span>
            </div>
            <div class="tab-content">
                <mt-cell v-for="(item, index) in windowCurrentList"
                         :key="index"
                         @click.native="selectWindow(item)"
                         :title="item.windowNo"></mt-cell>
            </div>
        </a-drawer>
    </div>
</template>
<script>
  import { Upload,Icon,Drawer,Button } from 'ant-design-vue';
  import {autoDoFn} from '@/utils/util';
  import { addComplain, getOrgList, getWindows } from '@/remote/complain';
  import { findOrganizationList } from '@/remote/userguide';
  export default {
    name: "Index",
    components: {
      AUpload: Upload,
      AIcon: Icon,
      ADrawer: Drawer,
      AButton: Button,
    },
    data() {
      return {
        fileList: [],
        departList: [],
        windowList: [],
        currentList: [],
        departVisible: false,
        windowCurrentList: [],
        windowVisible: false,
        formData: {},
        loading: false,
        path: [],
        windowPath: [],
      }
    },
    created() {
      this.getDepartData();
    },
    methods: {
      // 按部门
      getDepartData() {
        autoDoFn(async () => {
          // const res = await findOrganizationList();
          const res = await getOrgList();
          if (res && res.success) {
            this.departList = res.data;
            this.currentList = res.data;
          }
        })
      },
      // 获取窗口
      getWindowData(organizationId) {
        autoDoFn(async () => {
          // const res = await findOrganizationList();
          const res = await getWindows({organizationId});
          if (res && res.success) {
            this.windowList = res.data;
            this.windowCurrentList = res.data;
          }
        })
      },
      selectDepartment(item) {
        if(item.children && item.children.length){
          this.path = [...this.path, item.id];
          this.currentList = item.children;
        }else{
          this.departVisible = false;
          this.formData.organizationName = item.name;
          this.formData.orgId = item.id;
          this.formData.windowName = '';
          this.formData.windowNo = '';
          this.getWindowData(item.id);
          // this.path = [];
        }
      },
      selectWindow(item) {
        this.windowVisible = false;
        this.formData.windowName = item.windowNo;
        this.formData.windowNo = item.windowNo;
        this.formData.windowId = item.id
      },
      handleChange (info) {
        let fileList = info.fileList;
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        fileList = fileList.filter((file) => {
          if (file.response) {
            if(file.response.code !== 0){
              this.$message.error(file.name + '上传失败!');
            }
            return file.response.code === 0;
          }
          return true;
        });
        this.fileList = fileList;
      },
      addComplain() {
        if(!this.formData.suggestionName){this.$message.error('姓名不能为空');return false;}
        if(!this.formData.suggestionPhoneNumber){this.$message.error('电话不能为空');return false;}
        if(!this.formData.organizationName){this.$message.error('投诉部门不能为空');return false;}
        if(!this.formData.windowName){this.$message.error('投诉窗口不能为空');return false;}
        if(!this.formData.employeeNo){this.$message.error('投诉工号不能为空');return false;}
        if(!this.formData.content){this.$message.error('投诉内容不能为空');return false;}
        autoDoFn(async () => {
          this.loading = true;
          const res = await addComplain({
            ...this.formData,
            attachmentList: this.fileList.map(item => ({
              "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
              "fileName": item.response.data[0].fileName,//必填  文件名 string
              "suffix": item.response.data[0].suffixName,//必填 后缀名 string
              url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                `${item.response.data[0].filePath}` :
                `/uploadFile${item.response.data[0].filePath}`,
            }))
          });
          if(res){
            this.$message.success('提交成功');
            this.formData = {};
            this.fileList = [];
            this.path = [];
            this.currentList = Object.assign([], this.departList);
          }
          this.loading = false;
        })
      },
      backUpper() {
        const path = this.path.filter((item, index) => index < this.path.length - 1);
        const currentList = path.reduce((total, key) => {
          return total.find(item => item.id === key).children;
        }, this.departList);
        this.path = path;
        this.currentList = currentList;
      },
    },
  }
</script>

<style lang="less">
    .ant-drawer-body{
        padding: 0;
        height: calc(100% - 55px);
        overflow: auto;
    }
    .org-title{
        position: relative;
        a{
            position: absolute;
            right: 0;
            font-size: 12px;
        }
    }
</style>
