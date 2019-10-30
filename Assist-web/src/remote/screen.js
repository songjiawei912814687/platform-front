import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, mHeaders, apiVersion } from '../utils/util';

// token
export const getToken = data => request(`/getToken?${jsonToUrl(data)}`, {
  method: 'get',
});

// 办件趋势
export const getPerformance = data => request(`${apiVersion}/departmentResult/performanceIndex?${jsonToUrl(data)}`, {
  method: 'get',
});

// 最多跑一次满意率和实现率
export const findSatisfaction = data => request(`${apiVersion}/Satisfaction/findSatisfaction?${jsonToUrl(data)}`, {
  method: 'get',
});

//办件情形
export const condition = data => request(`${apiVersion}/do_condition/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 办件趋势
export const getTrend = data => request(`${apiVersion}/bigData_trend/find_do_trend?${jsonToUrl(data)}`, {
  method: 'get',
});

