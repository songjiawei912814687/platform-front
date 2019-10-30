<template>
    <div class="my-index-wrap">
        <a-row :gutter="24">
            <a-col :span="24">
                <div class="system-list clearfix" style="height: auto">
                    <a :href="systemUrl.personnel"  class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_PERSONNEL') > -1">
                        <img src="../../../assets/icon/sys1.png"/>
                        <p class="item__title" >人员管理系统</p>
                    </a>
                    <a :href="systemUrl.attendance"  class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_ATTENDANCE') > -1">
                        <img src="../../../assets/icon/sys3.png"/>
                        <p class="item__title" >考勤请假系统</p>
                    </a>
                    <a :href="systemUrl.meeting"  class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_MEETING') > -1">
                        <img src="../../../assets/icon/sys2.png"/>
                        <p class="item__title" >会议室预约系统</p>
                    </a>
                    <a :href="systemUrl.assessment"  class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_ASSESSMENT') > -1">
                        <img src="../../../assets/icon/sys4.png"/>
                        <p class="item__title" >效能考核系统</p>
                    </a>
                    <a id="message" :href="systemUrl.message"   class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_MESSAGE') > -1">
                        <img src="../../../assets/icon/短信发送.png"/>
                        <p class="item__title" >短信发送系统</p>
                    </a>
                    <a id="feedblank" :href="systemUrl.feedblank"   class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_FEEDBACK') > -1">
                        <img src="../../../assets/icon/投诉建议.png"/>
                        <p class="item__title" >投诉建议系统</p>
                    </a>

                    <a id="knowledge" :href="systemUrl.knowledge"   class="list__item" :target="self" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_KNOWLEDGE') > -1">
                        <img src="../../../assets/icon/知识库.png"/>
                        <p class="item__title" >知识库系统</p>
                    </a>

					<!--<a id="servicePlate" :href="systemUrl.servicePlate"   class="list__item" target="_blank" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_KNOWLEDGE') > -1">-->
					    <!--<img src="../../../assets/icon/智慧餐盘.png"/>-->
					    <!--<p class="item__title" >智慧餐盘系统</p>-->
					<!--</a>-->

                    <a id="servicePlate" :href="this.servicePlate"   class="list__item" target="_blank" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_KNOWLEDGE') > -1">
                        <img src="../../../assets/icon/智慧餐盘.png"/>
                        <p class="item__title" >智慧餐盘系统</p>
                    </a>

                    <a id="decision" :href="systemUrl.decision"   class="list__item" target="_blank" v-if="authorityActionList.indexOf('A_SYSTEM_MYHOME_KNOWLEDGE') > -1">
                        <img src="../../../assets/icon/辅助决策.png"/>
                        <p class="item__title" >辅助决策系统</p>
                    </a>

                </div>
            </a-col>
            <a-col :span="16">
                <div class="section-center">
                    <div class="section-title">
                        <h3 class="title__name">新闻中心</h3>
                        <router-link to="staff/staff" class="title__more">查看更多>></router-link>
                    </div>
                    <ul class="section-list" v-for="item in staffList">
                        <li class="list__item">
                            <a @click="sendStaffParams(item.id)" class="item__title">
                                <b style="color: red">
                                    {{item.disName === undefined || item.disName === '' ? '' : '['+item.disName+']'}}
                                </b>
                                <b style="color: cornflowerblue">
                                    {{'['+item.typeName+']'}}
                                </b>
                                {{item.title}}
                            </a>
                            <span class="item__time">{{item.createdDateTime}}</span>
                        </li>

                    </ul>
                </div>
            </a-col>
            <a-col :span="8">
                <div class="section-center">
                    <div class="section-title">
                        <h3 class="title__name">下载中心</h3>
                        <router-link to="download" class="title__more">查看更多>></router-link>
                    </div>
                    <ul class="section-list" v-for="item in DownList">
                        <li class="list__item">
                            <a @click="sendDownParams(item.id)" class="item__title">{{item.title}}</a>
                            <span class="item__time">{{item.createdDateTime}}</span>
                        </li>

                    </ul>
                </div>
            </a-col>
            <a-col :span="24">
                <div class="section-center">
                    <div class="section-title">
                        <h3 class="title__name">审批中心</h3>
                        <router-link to="review/approval" class="title__more">查看更多>></router-link>
                    </div>
                    <ul class="section-list" v-for="item in auditList">
                        <li class="list__item">
                            <p  class="item__title">[{{item.applicantName}}]{{item.approvalTypeName}}{{item.resultName}}</p>
                            <span class="item__time">{{item.applicationDateTime}}</span>
                        </li>

                    </ul>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {Row, Col} from 'ant-design-vue';
    import {autoDoFn} from "../../../utils/util";
    import {getToken} from "../../../remote/base";
    import { getDownPage } from '@/remote/download';
    import { getStaffPage } from '@/remote/staff';
    import { getPage } from '@/remote/audit';

    export default {
        name: "index",
        components: {
            ARow: Row,
            ACol: Col,

        },

        data() {
            return {
                systemUrl: window.defaultConfig.systemUrl,
                token: '',
                auditList: [],
                staffList: [],
                DownList: [],
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 20,
                    page: 0,
                },
				servicePlate: window.defaultConfig.systemUrl.servicePlate,
                adminLevel: localStorage.getItem('adminLevel'),
                authorityActionList: window.authorityActionList,
            }
        },
        created() {
            this.getToken();
            this.initTable();
        },
        methods: {
            getToken() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getToken();
                    if (res) {
                        console.log(res)
                        this.token = res.data
						this.servicePlate+=res.data
                    }
					console.log(res.data)
					console.log(this.servicePlate)
                    this.loading = false;
                });


            },
            initTable(){
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage();
                    if (res) {
                        console.log(res)
                        this.auditList = res.data.list
                    }
                    const staff = await getStaffPage();
                    if (staff) {
                        console.log(staff)
                        this.staffList = staff.data.list
                    }
                    const down = await getDownPage();
                    if (down) {
                        console.log(down)
                        this.DownList = down.data.list
                    }

                    this.loading = false;
                });
            },
          sendStaffParams(id) {
              this.$router.push({
                path: 'staff/staff/detail',
                name: 'staffDetail',
                query:{id: id}
              })
          },
          sendDownParams(id){
            this.$router.push({
              path: 'download/detail',
              name: 'downloadDetail',
              query:{id: id}
            })
          },



        }
    }
</script>

<style lang="less">
    @import "../../../common/base";

    .my-index-wrap {
        padding: 24px;
        overflow-y: auto;
        .system-list {
            height: 250px;
            padding-top: 60px;
            padding-left: 60px;
            background-color: #fff;
            box-shadow: 0 0 3px 3px rgba(200, 200, 200, .4);
            overflow: hidden;
            .list__item {
                display: block;
                width: 130px;
                height: 130px;
                position: relative;
                float: left;
                margin: 0 60px 60px 0;
                border-radius: 10px;
                text-decoration: none;
                &:nth-child(1n) {
                    background-color: #1ab199
                }
                &:nth-child(2n) {
                    background-color: #5b81fe
                }
                &:nth-child(3n) {
                    background-color: #d8544f
                }
                &:nth-child(4n) {
                    background-color: #4289c7
                }
                &:nth-child(5n) {
                    background-color: #c69cfa
                }
                img {
                    width: 130px;
                    height: 130px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .item__title {
                    color: #fff;
                    font-size: 16px;
                    text-align: center;
                    position: relative;
                    height: 30px;
                    line-height: 30px;
                    padding-top: 95px;
                }
            }
        }
        .section-center {
            background-color: #fff;
            box-shadow: 0 0 3px 3px rgba(200, 200, 200, .4);
            margin-top: 24px;
            padding-bottom: 10px;
            .section-title {
                height: 55px;
                line-height: 55px;
                position: relative;
                border-bottom: 1px solid #dcdcdc;
                .title__name {
                    color: #333333;
                    font-size: 16px;
                    padding: 0 150px 0 24px;
                    border-bottom: 1px solid #dcdcdc;
                    position: relative;
                }
                .title__more {
                    position: absolute;
                    color: #333333;
                    font-size: 14px;
                    right: 24px;
                    top: 0;
                    &:hover {
                        text-decoration: underline;
                        color: @main-color;
                    }
                }
            }
            .section-list {
                list-style: none;
                padding: 0;
                li {
                    height: 44px;
                    line-height: 44px;
                    font-size: 14px;
                    background-color: #fefefe;
                    padding-left: 24px;
                    padding-right: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    position: relative;
                    &:nth-child(odd) {
                        background-color: #f4fafe;
                    }
                    .item__title {
                        color: #666666;
                        &:hover {
                            color: @main-color;
                        }
                    }
                    .item__time {
                        position: absolute;
                        right: 24px;
                        top: 0;
                        color: #999999;
                    }
                }
            }
        }
    }
</style>
