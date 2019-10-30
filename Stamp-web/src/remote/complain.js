import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalcomplaint';

// 获取列表
export const getPage1 = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 新增
export const formPost = (data) => request(`${apiVersion}/${moduleName}/form?id=${data.id}`, {
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

// 获取单个详情
export const getApprovalDetail = data => request(`${apiVersion}/${moduleName}/getApprovalDetail?${jsonToUrl(data)}`, {
    method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});

  // 审批
export const approval = (data) => request(`${apiVersion}/${moduleName}/approval`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});
