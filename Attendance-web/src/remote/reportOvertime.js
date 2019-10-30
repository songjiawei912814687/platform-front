import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'overTimeReport';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/getReportByCondition?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/exportExcel?${jsonToUrl(data)}`, {
  method: 'get',
});

// 加班次数
export const getOverTimePage = data => request(`${apiVersion}/${moduleName}/getOverTimeReport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 调休次数
export const getAdjustPage = data => request(`${apiVersion}/${moduleName}/getOffTimeReport?${jsonToUrl(data)}`, {
  method: 'get',
});
