<template>
    <div class="wrap-content">
        <div class="nowposition">
            <a-breadcrumb :routes="routes" separator=">">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                  <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{route.breadcrumbName}}
                    </span>
                    <router-link v-else :to="paths.join('/')">
                        {{route.breadcrumbName}}
                    </router-link>
                    <!-- <span>
                         {{route.breadcrumbName}}
                     </span>-->
                </template>
            </a-breadcrumb>
            <a-button type='default' class="returnBack" @click="returnBack">返回</a-button>
            <a-button type='default' class="returnBack" @click="returnHome">首页</a-button>
        </div>

        <div class="infoBox">
            <a-table :columns="columns"
                     :dataSource="tableList"
                     :rowKey="record => String(record.id)"
                     :pagination="false"
                     :loading="loading">
                <div slot="emptyTableFileName" slot-scope="text, record" class="downloads">
                    <div class="actions" v-show="record.emptyTableFileName!==undefined">
                        <a @click="download(record.emptyTableFileUrl)">[{{record.emptyTableFileName}}]</a>
                    </div>
                </div>
                <div slot="exampleTableFileName" slot-scope="text, record" class="downloads">
                    <div class="actions" v-show="record.exampleTableFileName!==undefined">
                        <a @click="download(record.exampleTableFileUrl)">[{{record.exampleTableFileName}}]</a>
                    </div>
                </div>

            </a-table>
        </div>
    </div>
</template>

<script>
  import {Button, Breadcrumb, Table} from 'ant-design-vue';
  import print from 'print-js'

  const columns = [
    {
      title: '材料名称',
      dataIndex: 'name',
      width: 200,
    }, {
      title: '材料出具单位',
      dataIndex: 'meteriaOrganization',
      width: 200,
    }, {
      title: '材料形式',
      dataIndex: 'materialFormName',
      width: 200,
    }, {
      title: '必要性及描述',
      dataIndex: 'necessarilyDescription',
      width: 120,
    }, {
      title: '示例表',
      dataIndex: 'exampleTableFileName',
      width: 200,
      scopedSlots: {customRender: 'exampleTableFileName'}
    }, {
      title: '空白表',
      dataIndex: 'emptyTableFileName',
      width: 200,
      scopedSlots: {customRender: 'emptyTableFileName'},

    }
  ];

  import {autoDoFn} from '@/utils/util';
  import {download} from '@/remote/userguide';

  export default {
    name: 'index',
    components: {
      AButton: Button,
      ABreadcrumb: Breadcrumb,
      ATable: Table
    },
    data() {
      return {
        id: '',
        type: 0,
        routes: [
          {
            path: '../../../index/homepage',
            breadcrumbName: '首页'
          }, {
            path: '../../../index/userguide',
            breadcrumbName: '事项指南'
          }, {
            path: '../../../index/itemlist',
            breadcrumbName: '事项列表'
          }, {
            path: '../../index/downloads?id=' + this.id + '&type=' + this.type,
            breadcrumbName: '申报材料'
          }
        ],
        tableList: [],
        loading: true,
        columns: columns,
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.qlId = this.$route.query.qlId;
      this.type = this.$route.query.type;
      this.qlName = this.$route.query.qlName;
      this.getData();
    },
    methods: {
      getData() {
        autoDoFn(async () => {
          const res = await download({
            'id': this.id
          });
          this.loading = false;
          if (res.success) {
            var resultList = res.data;
            this.tableList = resultList.filter(item =>{
              return item.emptyTableFileName!==undefined||item.exampleTableFileName!==undefined;
            });
          }
        })
      },

      download(url) {
        if (url) {
          debugger;
          print({printable: url});
          // window.open(`${url}`, '_blank');
        }
      },

      returnBack() {
        // this.$router.back(-1);
        this.$router.push('/index/itemlist?id=' + this.qlId + '&type=' + this.type +  '&qlName=' + this.qlName);
      },
      returnHome() {
        // this.$router.back(-1);
        this.$router.push('/index/homepage')
      },

      Formattrim(str) { //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
      }
    }
  }
</script>

<style scoped>
    .downloads span {
        color: #4088C7;
        cursor: pointer;
    }
</style>
