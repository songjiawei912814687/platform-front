<template>
    <div class="content-wrap">
        <h2 class="content__title">会议室预约</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="日期：">
                <a-date-picker placeholder='请选择日期' v-model="searchParams.date" @change="dayChange" style="width: 100%"/>
            </search-box-item>
        </search-box>
        <div class="room-content__header">
            <div class="room-content-row clearfix">
                <div class="room-content-col room-content-col__name">会议室</div>
                <div class="room-content-col" v-for="item in meetingTime">{{item.name}}</div>
            </div>
        </div>
        <div class="room-content">
            <a-spin tip="正在加载中..." :spinning="loading">
                <div class="room-content__content">
                    <div>
                        <div class="room-content-row clearfix" v-for="room in data">
                            <div class="room-content-col room-content-col__name">{{room.name}}</div>
                            <div class="room-content-col" v-for="item in meetingTime">
                                <p class="room-appointment"
                                   v-if="!isOverDate && authorityActionList.indexOf('A_MEETING_MEETINGAPPLY_ADD') > -1"
                                   @click="handleAddShow(item, room)">预约</p>
                            </div>
                            <div class="room-content-meeting"
                                 v-for="meeting in room.meetingList"
                                 :style="{width: (meeting.endDateTime+1 - meeting.startDateTime) * 4 + '%', left:((meeting.startDateTime+1) * 4 ) + '%' }">
                                <a-popover placement="bottom" :title="meeting.theme">
                                    <div slot="content" style="max-width: 500px">
                                        <p>主办单位：{{meeting.hostUnit}}</p>
                                        <p>会议时间：{{meetingDate + ' ' + meetingTime[meeting.startDateTime].name}} -
                                            {{meetingDate + ' ' + meetingTime[meeting.endDateTime].name}}</p>
                                        <p>申请人：{{meeting.employeesName}}</p>
                                        <p>审核状态：{{meeting.stateName}}</p>
                                        <p v-if="meeting.attachmentList.length">附件：<a v-for="file in meeting.attachmentList"
                                                                                      :href="file.url" target="_blank">{{file.fileName}}&nbsp;&nbsp;&nbsp;</a>
                                        </p>
                                        <div style="text-align: right;margin-top: 10px" v-show="meeting.isCreator"
                                             v-if="authorityActionList.indexOf('A_MEETING_MEETINGAPPLY_DELETE') > -1">
                                            <a-popconfirm v-if="meeting.employeeId === employeesId" title="确认要删除此条数据?"
                                                          @confirm="handleDelete({idList: meeting.id})" okText="确认"
                                                          cancelText="取消">
                                                <a-button type="danger">取消</a-button>
                                            </a-popconfirm>
                                            <a-button @click="handleViewShow(meeting)" style="margin-left: 10px">查看
                                            </a-button>
                                            <a-button v-if="meeting.state === 0" type="primary" style="margin-left: 10px"
                                                      @click="handleModifyShow(meeting, room)">修改
                                            </a-button>
                                        </div>
                                    </div>
                                    <p class="meeting-time">
                                        {{meeting.theme}}<br/>
                                    </p>
                                </a-popover>
                            </div>
                        </div>
                    </div>
                </div>
            </a-spin>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :staffList="staffList"
             :modifyId="modifyId"
             :room="room"
             :meetingDate="meetingDate"
             :startDateTime="startTime"
             :realStartTime="realStartTime"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
    </div>
</template>

<script>
    import {
        Row,
        Col,
        Input,
        Button,
        Table,
        Form,
        Select,
        DatePicker,
        Upload,
        Icon,
        Divider,
        Popconfirm,
        Popover,
        Spin,
        message
    } from 'ant-design-vue';
    import {getPage, getDel} from '@/remote/appointment';
    import {getOrgTree, getEmployeesAll, getRoleAll} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';
    import {meetingTime} from '@/common/dictData';
    import moment from 'moment';
    import {getIsPerson} from "@/remote/base";

    const {Item} = Form;
    const {Option} = Select;

    export default {
        name: 'Index',
        components: {
            AInput: Input,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATable: Table,
            AForm: Form,
            AFormItem: Item,
            ASelect: Select,
            ASelectOption: Option,
            ADatePicker: DatePicker,
            AUpload: Upload,
            AIcon: Icon,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            APopover: Popover,
            ASpin: Spin,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
        },
        data() {
            return {
                addVisible: false,
                viewVisible: false,
                modifyId: '',
                data: [],
                searchParams: {
                    date: moment(),
                },
                loading: false,
                meetingTime,
                staffList: [],
                startTime: '0',
                room: {},
                meetingDate: moment().format("YYYY-MM-DD"),
                authorityActionList: window.authorityActionList,
            };
        },
        created() {
            this.initBaseData();
            this.initList();
        },
        computed: {
            isOverDate() {
                return moment(moment().format("YYYY-MM-DD")).valueOf() > moment(this.meetingDate).valueOf();
            }
        },
        methods: {
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage({
                        date: this.searchParams.date ? this.searchParams.date.format('YYYY-MM-DD') : '',
                        ...this.pagination,
                    });
                    if (res) {
                        this.data = res.data.roomList;
                        this.meetingDate = res.data.date;
                    }
                    this.loading = false;
                });
            },
            initBaseData() {
                const that = this;
                autoDoFn(async () => {
                    const staffRes = await getEmployeesAll();
                    if (staffRes) {
                        that.staffList = staffRes.data.list;
                    }
                });
            },
            dayChange() {
              this.initList()
            },
            // 会议室预约
            handleAddShow(item, room) {
                if(this.searchParams.date.dayOfYear()<moment().dayOfYear()){
                    message.error("预约时间已过，请重新选择")
                    return
                }
                if(item.value){
                    if(this.searchParams.date.dayOfYear()===moment().dayOfYear()){
                        let mydate = new Date();
                        let h = mydate.getHours();
                        console.log(mydate)
                        console.log(item)
                        if((Number(item.value) + 8) <= h){
                            message.error("预约时间已过，请重新选择")
                            return
                        }
                    }


                }
				autoDoFn(async () => {
					const res = await getIsPerson();
					console.log(res);
					if (res.success) {
						this.addVisible = true;
						this.startTime = item.value;
						this.room = room;
					}
				})



            },
            handleModifyShow(rowData, room) {
                this.addVisible = true;
                this.modifyId = rowData.id;
                this.room = room;
            },
            handleViewShow(rowData) {
                this.viewVisible = true;
                this.modifyId = rowData.id;
            },
            handleDrawerToggle(type, isVisible) {
                this[type] = isVisible;
                if (!isVisible) {
                    this.modifyId = '';
                }
            },
            handleAddSuccess() {
                this.handleDrawerToggle('addVisible', false);
                this.initList();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    date: moment(),
                };
                this.pagination = {
                    defaultCurrent: 1,
                    row: 10,
                    page: 0,
                };
                this.$nextTick(() => {
                    this.initList();
                });
            },
            handleDelete(data) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getDel(data);
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.initList();
                    }else {
                        this.initList();
                        this.loading = false;
                    }
                    this.loading = true;
                });
            },
        },
    };
</script>

<style lang="less">
    @import "../../../common/base";

    .room-content__header {
        position: absolute;
        top: 99px;
        left: 0;
        width: 100%;
        background-color: #fff;
        z-index: 9;
        overflow-x: hidden;
        overflow-y: scroll;
        .room-content-row {
            width: 100%;
            position: relative;
            overflow: hidden;

            .room-content-col {
                height: 50px;
                line-height: 50px;
                float: left;
                width: 4%;
                border: 1px solid #eee;
                text-align: center;
                word-break: break-all;
            }
        }
    }

    .room-content {
        position: absolute;
        top: 149px;
        left: 0;
        right: 0;
        bottom: 80px;
        overflow: hidden;
        .ant-spin-nested-loading, .ant-spin-container{
            height: 100%;
        }
        .room-content__content {

            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;

            .room-content-row {
                overflow: hidden;
                width: 100%;
                position: relative;

                .room-content-col {
                    float: left;
                    width: 4%;
                    height: 100px;
                    border: 1px solid #eee;
                    text-align: center;
                    line-height: 100px;
                    word-break: break-all;

                    &.room-content-col__name {
                        padding-top: 25px;
                        line-height: 25px;
                    }

                    &:hover {
                        .room-appointment {
                            display: block;
                        }
                    }

                    .room-appointment {
                        display: none;
                        color: #fff;
                        background-color: @main-color;
                        height: 100px;
                        line-height: 100px;
                        text-align: center;
                        cursor: pointer;
                    }
                }

                .room-content-meeting {
                    height: 100px;
                    position: absolute;
                    top: 0;
                    text-align: center;
                    line-height: 100px;
                    font-size: 16px;
                    color: #fff;
                    cursor: pointer;
                    border: 1px solid #fff;

                    .meeting-time {
                        width: 100%;
                        height: 100px;
                        line-height: 100px;
                        background-color: #F77F5C;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }

        .meeting-action {
            text-align: right;
        }
    }
</style>
