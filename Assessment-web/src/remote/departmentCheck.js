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

// 获取单个详情
export const getOne = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
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

// 考核计划评分说明编辑
export const descrptionEdit = (params) => request(`${apiVersion}/appraisalplanitem/formDescrption?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
});

// 考核计划状态更新
export const updateState = (params) => request(`${apiVersion}/appraisalplanitem/updateState?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
});

// 考核计划修改最终得分
export const changeFinalScore = (params, data) => request(`${apiVersion}/${moduleName}/changeFinalScore?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 保存附件
export const saveAddtition = (id, data) => request(`${apiVersion}/appraisalplanitem/saveAddtition?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 获得考核计划明细的附件
export const getAddition = data => request(`${apiVersion}/appraisalplanitem/getAdditionById?${jsonToUrl(data)}`, {
  method: 'get',
});
