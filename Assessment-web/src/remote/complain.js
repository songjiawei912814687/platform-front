import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalcomplaint';

// 获取列表
export const getPage1 = data => request(`${apiVersion}/${moduleName}/findassessmentRepresentation?${jsonToUrl(data)}`, {
    method: 'get',
});

// 新增
export const formPost = (data) => request(`${apiVersion}/${moduleName}/assessmentRepresentation?planId=${data.id}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 编辑
export const formEditPost = (id,data) => request(`${apiVersion}/${moduleName}/representationAdjustment?${jsonToUrl({ complaintId: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: 'get',
});

// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
    method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});
