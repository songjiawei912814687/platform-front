import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'employeesplanreport';

// 获取分页的职务
export const getPage = data => request(`${apiVersion}/${moduleName}/findEmployeesPlanReport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/employeesReportExport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/findRecord?${jsonToUrl(data)}`, {
  method: 'get',
});



