import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'organization';

// token
export const getToken = data => request(`/getToken?${jsonToUrl(data)}`, {
  method: 'get',
});

// count
export const getCount = data => request(`${apiVersion}/mapCenter/selectCount?${jsonToUrl(data)}`, {
  method: 'get',
});

// total
export const getTotal = data => request(`${apiVersion}/total/selectCount?${jsonToUrl(data)}`, {
  method: 'get',
});

// 移动办事之城
export const getMobileService = data => request(`${apiVersion}/screenConfig/getMobileService?${jsonToUrl(data)}`, {
  method: 'get',
});

// 服务承诺
export const getPledgeData = data => request(`${apiVersion}/screenConfig/getPledgeData?${jsonToUrl(data)}`, {
  method: 'get',
});

// 大数据调用量
export const getBigDataInvoke = data => request(`${apiVersion}/bigData/find_bigDataInvoke?${jsonToUrl(data)}`, {
  method: 'get',
});

// 办件趋势
export const getTrend = data => request(`${apiVersion}/bigData_trend/find_do_trend?${jsonToUrl(data)}`, {
  method: 'get',
});

// 办件趋势
export const getPerformance = data => request(`${apiVersion}/departmentResult/performanceIndex?${jsonToUrl(data)}`, {
  method: 'get',
});


