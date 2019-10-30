<template>
    <div class="content-wrap">
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
            <a-button type='default' class="returnBack" @click="returnHome">首页</a-button>
        </div>

        <hr class="lines">

        <div class="infoBox">
            <div class="resBox">
                <div class="detail-label">类型：</div>
                <div class="detail-content">
                    <p>{{resdata.typeName}}</p>
                </div>
                <div class="detail-label">部门：</div>
                <div class="detail-content">
                    <p>{{resdata.organizationName}}</p>
                </div>
                <div class="detail-label">问题：</div>
                <div class="detail-content">
                    <p>{{resdata.title}}</p>
                </div>
                <div class="detail-label">答案：</div>
                <div class="detail-content">
                    <p>{{resdata.description}}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { Button, Breadcrumb } from 'ant-design-vue';

    import { autoDoFn } from '@/utils/util';
    import { get } from '@/remote/consultquestion';

    export default {
        name:'detail',
        components:{
            AButton: Button,
            ABreadcrumb: Breadcrumb
        },
        data(){
            return {
                id:'',
                title:'',
                description:"",
              resdata: {},
                routes: [
                    {
                        path: '../../index/homepage',
                        breadcrumbName: '首页'
                    }, {
                        path: '../../index/consultquestion',
                        breadcrumbName: '问题解答'
                    }, {
                        path: 'consultdetail',
                        breadcrumbName: '问题详情'
                    }
                ],
            }
        },
        created(){
            this.id = this.$route.query.id
            this.getData();
        },
        methods:{
            getData(){
                autoDoFn(async () => {
                    const res = await get({
                        'id':this.id
                    });
                    this.loading = false;
                    if(res.success){
                        this.resdata = res.data;
                    }
                })
            },
            returnBack(){
                // this.$router.back(-1);
                this.$router.push('/index/consultquestion')
            },
            returnHome() {
                // this.$router.back(-1);
                this.$router.push('/index/homepage')
            },
        }
    }
</script>

<style scoped lang="less">
    .resultBox{
        width:60%;
        margin:50px auto;
        line-height:35px;
    }

    .resBox{
        .detail-label{
            background-color: #159bd4;
            color: #fff;
            padding-left: 15px;
            font-size: 14px;
            line-height: 30px;
        }
        .detail-content{
            background-color: #fff;
            >p {
                font-size: 14px;
                line-height: 25px;
                min-height: 25px;
                padding-left: 15px;
                margin-bottom: 2px;
                background-color: #e9e9e9;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }

    .lines{
        margin:0;
    }
    .resultBox .title{
        width:90px;
        float: left;
        font-weight: bold;
    }
    .resultBox .contents {
        width: calc(100% - 90px);
        float: left;
        border: 1px solid #e5e5e5;
        margin-bottom: 20px;
        padding: 0 10px;
    }
    .lastInfo{
        min-height: 200px;
    }

</style>
