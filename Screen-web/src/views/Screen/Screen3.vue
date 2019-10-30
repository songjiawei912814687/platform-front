<template>
    <div class="screen-wrap_3">
        <div class="title">
            <img src="../../assets/screen/logo.png"/>
            <span class="text_zh">杭州市公共资源交易中心富阳分中心</span>
            <span class="text_en"> Hangzhou public resources trading center fuyang branch</span>
        </div>
        <div class="table-top">
            <a-carousel :autoplay="true" :dots="false" :autoplaySpeed="30 * 1000">
                <!--<div class="item_1">
                    <div class="top_table">
                        <span class="top_title">政府采购采购公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;">招标单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">保证金</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="purchaseColumns"
                                 :dataSource="purchaseList"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.name}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.units}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.money}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.startTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.endTime}}</p>
                            </template>
                        </a-table>
                    </div>
                    <div class="top_table" style="margin-top: 15px">
                        <span class="top_title">政府采购中标公示</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;border-right: 1px solid #ffffff;">中标单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">采购价</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="purchaseColumns1"
                                 :dataSource="purchaseList1"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 class="top-table"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.name}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.units}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.money}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.startTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.endTime}}</p>
                            </template>
                        </a-table>
                    </div>
                </div>
                -->
                <div class="item_2">
                    <div class="top_table">
                        <span class="top_title">农村集体产权交易公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;">交易项目名称</a-col>
                            <a-col style="width: 150px;display:table-cell;">起拍价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="equityColumns"
                                 :dataSource="equityList"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.projectName}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.announcement}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.price}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.startTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.endTime}}</p>
                            </template>
                        </a-table>
                    </div>
                    <div class="top_table" style="margin-top: 15px">
                        <span class="top_title">农村集体产权成果公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">成果公告</a-col>
                            <a-col style="width: 600px;display:table-cell;border-right: 1px solid #ffffff;">产权所有人</a-col>
                            <a-col style="width: 150px;display:table-cell;">中标价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="equityColumns1"
                                 :dataSource="equityList1"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 class="top-table"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.announcement}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.owner}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.price}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.startTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.endTime}}</p>
                            </template>
                        </a-table>
                    </div>
                </div>
                <div class="item_3">
                    <div class="top_table">
                        <span class="top_title">小额工程招标公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;">招标单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">预算价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="halfColumns"
                                 :dataSource="halfList"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.projectName}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.tenderUnit}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.budgtaryPrice}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.bidTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.publishEndTime}}</p>
                            </template>
                        </a-table>
                    </div>
                    <div class="top_table" style="margin-top: 15px">
                        <span class="top_title">小额工程中标公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;border-right: 1px solid #ffffff;">中标单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">中标价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="halfColumns1"
                                 :dataSource="halfList1"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 class="top-table"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.name}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.units}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.money}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.startTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.endTime}}</p>
                            </template>
                        </a-table>
                    </div>
                </div>
                <div class="item_4">
                    <div class="top_table">
                        <span class="top_title">建筑工程招标公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">项目名称</a-col>
                            <a-col style="width: 600px;display:table-cell;">建设单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">预算价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="buildColumns"
                                 :dataSource="buildList"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.name}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.tendererName}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.thisBudget}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.openBidTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.publishEndTime}}</p>
                            </template>
                        </a-table>
                    </div>
                    <div class="top_table" style="margin-top: 15px">
                        <span class="top_title">建筑工程中标公告</span>
                        <a-row class="header_1">
                            <a-col style="display:table-cell;border-right: 1px solid #ffffff;text-align: right;padding-right: 30px">项目名称</a-col>
                            <a-col style="width: 200px;display:table-cell;">项目负责人</a-col>
                            <a-col style="width: 400px;display:table-cell;border-right: 1px solid #ffffff;">中标单位</a-col>
                            <a-col style="width: 150px;display:table-cell;">中标价(万)</a-col>
                            <a-col style="width: 200px;border-right: 1px solid #ffffff;display:table-cell;">开始时间</a-col>
                            <a-col style="width: 200px;display:table-cell;">结束时间</a-col>
                        </a-row>
                        <a-table :columns="buildColumns1"
                                 :dataSource="buildList1"
                                 :pagination="false"
                                 :showHeader="false"
                                 size="middle"
                                 class="top-table"
                                 :rowKey="record => String(record.id)">
                            <template slot="name" slot-scope="text, record">
                                <p class="textP">{{record.tenderName}}</p>
                            </template>
                            <template slot="user" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.personnels}}</p>
                            </template>
                            <template slot="units" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.enterpriseName}}</p>
                            </template>
                            <template slot="money" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.winPrice}}</p>
                            </template>
                            <template slot="startTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.publishStartTime}}</p>
                            </template>
                            <template slot="endTime" slot-scope="text, record">
                                <p class="textP" style="text-align: center">{{record.publishEndTime}}</p>
                            </template>
                        </a-table>
                    </div>
                </div>
            </a-carousel>
        </div>
        <div class="table-bottom">
            <a-row>
                <a-col :span="12">
                    <p class="table_title">曝光台</p>
                    <a-row class="header">
                        <a-col style="width: 100px;display:table-cell;">类别</a-col>
                        <a-col style="display:table-cell;">标题</a-col>
                        <a-col style="width: 250px;border-right: 1px solid #ffffff;display:table-cell;">处罚信息</a-col>
                        <a-col style="width: 150px;display:table-cell;">时间</a-col>
                    </a-row>
                    <!--<a-table :columns="exposureColumns"
                             :dataSource="exposureList"
                             :pagination="false"
                             size="middle"
                             :showHeader="false"
                             :rowClassName="(record,index) => String('table-row')"
                             :rowKey="record => String(record.id)">
                        &lt;!&ndash;<template slot="type1" slot-scope="text, record">
                            <p class="textE">{{record.type}}</p>
                        </template>&ndash;&gt;
                        <template slot="title" slot-scope="text, record">
                            <p class="textE">{{record.title}}</p>
                        </template>
                        <template slot="message" slot-scope="text, record">
                            <p class="textE">{{record.message}}</p>
                        </template>
                        <template slot="time" slot-scope="text, record">
                            <p class="textE">{{record.time}}</p>
                        </template>
                    </a-table>-->
                    <a-table :columns="exposureColumns"
                             :dataSource="exposureList"
                             :pagination="false"
                             size="middle"
                             :showHeader="false"
                             :rowClassName="(record,index) => String('table-row')"
                             :rowKey="record => String(record.id)">
                        <template slot="type1" slot-scope="text, record">
                            <p class="textE">{{record.classValue}}</p>
                        </template>
                        <template slot="title1" slot-scope="text, record">
                            <p class="textE">{{record.title}}</p>
                        </template>
                        <template slot="message1" slot-scope="text, record">
                            <p class="textE">{{record.message}}</p>
                        </template>
                        <template slot="time" slot-scope="text, record">
                            <p class="textE" style="text-align: center">{{record.publishStartTime ? record.publishStartTime.slice(0, 10) : ''}}</p>
                        </template>
                    </a-table>
                </a-col>
                <a-col :span="1"></a-col>
                <a-col :span="11">
                    <p class="table_title">公示栏</p>
                    <a-row class="header">
                        <a-col style="width: 300px;display:table-cell;border-right: 1px solid #ffffff;">公司名称</a-col>
                        <a-col style="display:table-cell;">编码</a-col>
                        <a-col style="width: 150px;display:table-cell;">时间</a-col>
                    </a-row>
                    <a-table :columns="noticeColumns"
                             :dataSource="noticeList"
                             :pagination="false"
                             size="middle"
                             :showHeader="false"
                             :rowClassName="(record,index) => String('table-row')"
                             :rowKey="record => String(record.id)">
                        <template slot="name" slot-scope="text, record">
                            <ul style="padding-left: 10px;">
                                <li style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;">{{record.enterpriseName}}</li>
                            </ul>
                        </template>
                        <template slot="code" slot-scope="text, record">
                            <p style="text-align: center">{{record.enterpriseCode}}</p>
                        </template>
                        <template slot="time" slot-scope="text, record">
                            <p style="text-align: center">{{record.publishTime.slice(0, 10)}}</p>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </div>
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
    Progress,
    Carousel
  } from 'ant-design-vue';
  import index from "../../store";
  import {
    getNoticeBoardList, getLighthouseList,
    getSmallProjectResult, getBuildWindList,
    getSmallProjectTrans, getBuildCallList,
    getTradingCenterList, getTradingResultList,
  } from '@/remote/screen3';

  import { autoDoFn } from "../../utils/util";

  const exposureColumns = [
    {title: '类别', key: 'classValue', scopedSlots: {customRender: 'type1'}, width: 100},
    {title: '标题', key: 'title', scopedSlots: {customRender: 'title1'}},
    {title: '处罚信息', key: 'message1', scopedSlots: {customRender: 'message1'}, width: 250},
    {title: '时间', key: 'publishStartTime', scopedSlots: {customRender: 'time'}, width: 150}
  ];
  const noticeColumns = [
    {title: '公司名称', width: 300, key: 'enterpriseName', scopedSlots: {customRender: 'name'}},
    {title: '编号', key: 'enterpriseCode', scopedSlots: {customRender: 'code'}},
    {title: '时间', key: 'publishTime', scopedSlots: {customRender: 'time'}, width: 150}
  ];
  const purchaseColumns = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '招标单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '保证金', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const purchaseColumns1 = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '中标单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '采购价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const equityColumns = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '交易项目名称', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '起拍价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const equityColumns1 = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '产权所有人', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '中标价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const halfColumns = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '招标单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '预算价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const halfColumns1 = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '中标单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '中标价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const buildColumns = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '建设单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 600},
    {title: '预算价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  const buildColumns1 = [
    {title: '项目名称', key: 'name', scopedSlots: {customRender: 'name'}},
    {title: '项目负责人', key: 'user', scopedSlots: {customRender: 'user'}, width: 200},
    {title: '中标单位', key: 'units', scopedSlots: {customRender: 'units'}, width: 400},
    {title: '中标价', key: 'money', scopedSlots: {customRender: 'money'}, width: 150},
    {title: '开始时间', key: 'startTime', scopedSlots: {customRender: 'startTime'}, width: 200},
    {title: '结束时间', key: 'endTime', scopedSlots: {customRender: 'endTime'}, width: 200},
  ];
  export default {
    name: 'screen1',
    components: {
      AInput: Input,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      ATable: Table,
      AForm: Form,
      ASelect: Select,
      ASelectOption: Option,
      ADatePicker: DatePicker,
      AUpload: Upload,
      AIcon: Icon,
      ADivider: Divider,
      APopconfirm: Popconfirm,
      AProgress: Progress,
      ACarousel: Carousel
    },
    data() {
      return {
        //曝光台
        exposureColumns,
        exposureList: [],
        //公示栏
        noticeColumns,
        noticeList: [],
        //政府采购
        purchaseColumns,
        purchaseList: [],
        purchaseColumns1,
        purchaseList1: [],
        //农村集体产权
        equityColumns,
        equityList: [],
        equityColumns1,
        equityList1: [],
        //小额工程
        halfColumns,
        halfList: [],
        halfColumns1,
        halfList1: [],
        //建筑工程
        buildColumns,
        buildList: [],
        buildColumns1,
        buildList1: [],
      };
    },
    created() {
      // 公示栏
      this.getNoticeBoardList();
      // 曝光台
      this.getLighthouseList();
      // 小额工程中标
      this.getSmallProjectResult();
      // 小额工程交易公告
      this.getSmallProjectTrans();
      // 建筑工程中标
      this.getBuildWindList();
      // 建筑工程招标
      this.getBuildCallList();

      this.getTradingCenterList();
      this.getTradingResultList();
    },
    methods: {
      getNoticeBoardList() {
        autoDoFn(async () => {
          const res = await getNoticeBoardList();
          if(res && res.data){
            this.noticeList = res.data.list;
          }
        })
      },
      getLighthouseList() {
        autoDoFn(async () => {
          const res = await getLighthouseList();
          if(res && res.data){
            this.exposureList = res.data.list;
          }
        })
      },
      getSmallProjectResult() {
        autoDoFn(async () => {
          const res = await getBuildWindList();
          if(res && res.data){
            this.halfList1 = res.data.list;
          }
        })
      },
      getSmallProjectTrans() {
        autoDoFn(async () => {
          const res = await getSmallProjectTrans();
          if(res && res.data){
            this.halfList = res.data.list;
          }
        })
      },
      getBuildWindList() {
        autoDoFn(async () => {
          const res = await getSmallProjectResult();
          if(res && res.data){
            this.buildList1 = res.data.list;
          }
        })
      },
      getBuildCallList() {
        autoDoFn(async () => {
          const res = await getBuildCallList();
          if(res && res.data){
            this.buildList = res.data.list;
          }
        })
      },
      getTradingCenterList() {
        autoDoFn(async () => {
          const res = await getTradingCenterList();
          if(res && res.data){
            this.equityList = res.data.list;
          }
        })
      },
      getTradingResultList() {
        autoDoFn(async () => {
          const res = await getTradingResultList();
          if(res && res.data){
            this.equityList1 = res.data.list;
          }
        })
      },
    },
  };
</script>

<style lang="less">
    .screen-wrap_3 {
        background-color: #fff;
        width: 100%;
        height: auto;
        padding: 20px;
        color: rgb(35, 93, 166);
        .title {
            width: 100%;
            height: auto;
            position: relative;
            img {
                width: 60px;
                height: auto;
            }
            .text_zh {
                font-size: 30px;
                font-family: "FZZZHONGJW";
                font-weight: bold;
                position: absolute;
                left: 68px;
            }
            .text_en {
                font-size: 14px;
                font-family: "FZZZHONGJW";
                font-weight: bold;
                position: absolute;
                left: 68px;
                top: 39px;
            }

        }
        .table-top {
            margin: 20px 0;
            .textP {
                font-family: "Microsoft YaHei";
                color: rgb(35, 93, 166);
                font-size: 16px;
                width: 100%;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .top_table {
                position: relative;
                height: auto;
                width: 100%;
                .top_title {
                    position: absolute;
                    font-size: 18px;
                    font-family: "FZZZHONGJW";
                    color: #fda803;
                    font-weight: bold;
                    z-index: 100;
                    line-height: 38px;
                    margin-left: 20px;
                }
            }
            .header_1 {
                width: 100%;
                height: 40px;
                background-color: rgb(35, 93, 166);
                font-size: 18px;
                font-family: "Microsoft YaHei";
                color: rgb(255, 255, 255);
                padding: 0;
                display: table;
                > div {
                    text-align: center;
                    display: inline-block;
                    line-height: 38px;
                }
            }
        }
        .table-bottom {
            .table_title {
                font-size: 18px;
                font-family: "FZZZHONGJW";
                font-weight: bold;
            }
            .header {
                width: 100%;
                height: 30px;
                background-color: rgb(35, 93, 166);
                font-size: 16px;
                font-family: "Microsoft YaHei";
                color: rgb(255, 255, 255);
                padding: 0;
                display: table;
                > div {
                    text-align: center;
                    display: inline-block;
                    line-height: 28px;
                }
            }
            .textE {
                width: 100%;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
        table{
            table-layout: fixed;
        }
        ul,li{
            list-style: none;
        }
    }

</style>
