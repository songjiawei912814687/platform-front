<template>
    <div>
        <a-row :getter="24">
            <a-input style="margin-top: 40px;width: 60vh;margin-left: 70px" v-model="searchParams.keywords" placeholder="请输入要搜索的关键词"/>
            <a-button @click="search">百毒一下</a-button>
        </a-row>
        <a-row style="margin: 10px;margin-left: 70px">
            <a-button @click="handleType(100)">咨询问题</a-button>
            <a-button @click="handleType(200)">权利事项</a-button>
        </a-row>
        <a-row>
            <a-list
            itemLayout="horizontal"
            :dataSource="data"
            :split=false>
                <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta
                        description="aaaaaaaaa"
                        >
                        <a slot="title" href="#"><b>[{{String(item.type) === '200' ? "权利事项": "咨询问题"}}]</b>
                            <dl v-html="item.ql_name || item.queTitle">
                            {{String(item.type) === '200' ? item.ql_name : item.queTitle}}
                            </dl>
                        </a>
                        <p>{{String(item.type) === '200' ? item.contentInvolve === undefined || item.contentInvolve == 'undefined' ? '' : item.contentInvolve
                            +'   '+item.applicableObject === undefined || item.applicableObject === 'undefined' ? '' : item.applicableObject
                            + '   ' + item.acpInstitution === undefined || item.acpInstitution === 'undefined' ? '' : item.acpInstitution : item.queTitle }}</p>
                    </a-list-item-meta>
                </a-list-item>
            </a-list>
            <a-pagination @change="handlePageChange" :total="pagination.total" :defaultCurrent="pagination.defaultCurrent"></a-pagination>
        </a-row>
    </div>

</template>

<script>
    import {Input, Col, Row, List, Button,Pagination} from 'ant-design-vue'
    import {search} from "../../../remote/search";
    import {autoDoFn} from "../../../utils/util";

    const {Item,ItemMeta} = List
    export default {
        name: "index",
        components: {
            AInput: Input,
            ACol: Col,
            ARow: Row,
            AList: List,
            AButton: Button,
            AListItem: Item,
            AListItemMeta : ItemMeta,
            APagination : Pagination
        },
        data() {
            return {
                data: [],
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                },
                searchParams: {
                    keywords: '',
                    type: '',
                },
                addLoading: false
            }
        },
        methods: {
            search() {
                autoDoFn(async () => {
                    this.addLoading = true;
                    const res = await search({
                        ...this.searchParams,
                        ...this.pagination,
                    });
                    if (res.success) {
                        this.pagination.total = res.data.numFound
                        this.pagination.page = res.data.start
                        this.pagination.rows = res.data.rows
                        this.data = res.data.docs
                    }
                    this.addLoading = false;
                });
            },
            handlePageChange(pagination) {
                debugger
                this.pagination.page = pagination;
                this.$nextTick(() => {
                    this.search();
                });
            },
            handleType(type){
                this.searchParams.type = type
            }
        }
    }
</script>

<style scoped>

</style>
