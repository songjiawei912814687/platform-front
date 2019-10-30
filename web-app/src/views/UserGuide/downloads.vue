<template>
    <div class="wrap-content">
        <div class="nowposition">
            <span class="titles">当前位置：</span> 
            <a-breadcrumb :routes="routes" separator=">">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                    <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{route.breadcrumbName}}
                    </span>
                    <router-link v-else :to="paths.join('/')">
                        {{route.breadcrumbName}}
                    </router-link>
                </template>
            </a-breadcrumb>
            <a-button type='default' class="returnBack" @click="returnBack">返回</a-button>
        </div>

        <div class="infoBox">
            <a-table :columns="columns"
                    :dataSource="tableList"
                    :loading="loading">
                <div slot="name" slot-scope="text, record" class="downloads">
                    <span>下载</span>
                    <span @click="download(record.exampleTableFileUrl)">[{{record.exampleTableFileName}}]</span>
                    <span @click="download(record.emptyTableFileUrl)">[{{record.emptyTableFileName}}]</span>
                </div>        
            </a-table>
        </div>
    </div>
</template>

<script>
    import { Button, Breadcrumb, Table} from 'ant-design-vue';

    const columns = [
        {
            title: '材料名称',
            dataIndex: 'name',
            width: 100,
            scopedSlots: { customRender: 'name' },
        },{
            title: '材料出具单位',
            dataIndex: 'materialRes',
            width: 100,
        },{
            title: '材料形式',
            dataIndex: 'format',
            width: 100,
        },{
            title: '材料详细要求',
            dataIndex: 'detailRequirement',
            width: 100,
        },{
            title: '必要性及描述',
            dataIndex: 'necessity',
            width: 100,
        },{
            title: '备注',
            dataIndex: 'bak',
            width: 100,
        },
    ]

    import { autoDoFn } from '@/utils/util';
    import { download } from '@/remote/userguide';

    export default {
        name:'index',
        components:{
            AButton:Button,
            ABreadcrumb: Breadcrumb,
            ATable: Table
        },
        data(){
            return {
                id:'',  
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
                        path: '../../index/downloads',
                        breadcrumbName: '申报材料'
                    }
                ],
                tableList:[],
                loading:true,
                columns:columns,
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.getData();
        },
        methods:{
            getData(){
                autoDoFn(async () => {
                    const res = await download({
                        'qlFullId':this.id
                    });
                    this.loading = false;
                    if(res.success){
                        this.tableList = res.data.list;
                    }
                })
            },

            returnBack(){
                this.$router.back(-1);
            }
        }
    }
</script>

<style scoped>
    .downloads span{
        color:4088C7;
        cursor: pointer;
    }
</style>
