import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalplan';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findDepartmentPlan?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/appraisalplanitem/findByPlanId?${jsonToUrl(data)}`, {
  method: 'get',
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/delete?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/appraisalplanitem/departmentPlanItemExport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 考核计划明细编辑
export const detailEdit = (params, data) => request(`${apiVersion}/appraisalplanitem/form?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
