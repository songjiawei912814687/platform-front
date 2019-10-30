import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
// token
export const getToken = data => request(`/getToken?${jsonToUrl(data)}`, {
  method: 'get',
});

// 最多跑一次满意率和实现率
export const findSatisfaction = data => request(`${apiVersion}/Satisfaction/findSatisfaction?${jsonToUrl(data)}`, {
  method: 'get',
});
// 满意情况
export const getEvaluation = data => request(`${apiVersion}/Satisfaction/getEvaluation?${jsonToUrl(data)}`, {
    method: 'get',
});
//当前大厅等待人数
export const waitingNumber = data => request(`${apiVersion}/waitingNumber/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

//来访人数
export const visitorsNumber = data => request(`${apiVersion}/visitorsNumber/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});
//办件情形
export const condition = data => request(`${apiVersion}/do_condition/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

//热门事项办件量
export const getHot = data => request(`${apiVersion}/hot/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取部门接口
export const getOrganization = data => request(`${apiVersion}/center/getOrganization?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取负责人接口（传入organizationId组织机构id int）
export const getPerson = data => request(`${apiVersion}/center/getprincipal?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取服务窗口数接口（传入organizationId组织机构id int）
export const getWindowCount = data => request(`${apiVersion}/center/getWindowCount?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取当前开放窗口数接口（传入organizationId组织机构id int）
export const getWindowOpenCount = data => request(`${apiVersion}/center/getWindowOpenCount?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取可办理窗口接口（传入organizationId组织机构id int）
export const getOpenWindow = data => request(`${apiVersion}/center/getOpenWindow?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取平均等待时长接口（传入organizationId组织机构id int）
export const getAverageaitingime = data => request(`${apiVersion}/center/getAverageaitingime?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取当前等待人数接口（传入organizationId组织机构id int）
export const getCurrentWaitingNumber = data => request(`${apiVersion}/center/getCurrentWaitingNumber?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取网上预约人数接口（传入organizationId组织机构id int）
export const getBookingOnLine = data => request(`${apiVersion}/center/getBookingOnLine?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取上岗情况接口（传入organizationId组织机构id int）
export const getBoardingSituation = data => request(`${apiVersion}/center/getBoardingSituation?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取未上岗情况接口（传入organizationId组织机构id int）
export const getAbsenceOfPosts = data => request(`${apiVersion}/center/getAbsenceOfPosts?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取满意度接口（传入organizationId组织机构id int）
export const getSituation = data => request(`${apiVersion}/center/getSatisfaction?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取不满意情况接口（传入organizationId组织机构id int）
export const getDissatisfaction = data => request(`${apiVersion}/center/getDissatisfaction?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取今日办件量接口（传入organizationId组织机构id int）
export const getTodayVolume = data => request(`${apiVersion}/center/getTodayVolume?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取各窗口办件量接口（传入organizationId组织机构id int）
export const getWindowTodayVolume = data => request(`${apiVersion}/center/getWindowTodayVolume?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取窗口人员列表接口（传入organizationId组织机构id int）
export const getEmployeeList = data => request(`${apiVersion}/center/getEmployeeList?${jsonToUrl(data)}`, {
    method: 'get',
});
