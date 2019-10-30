import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalTemplate';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 新增
export const formPost = (params, data) => request(`${apiVersion}/${moduleName}/formPost?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});

// 启用
export const getStart = data => request(`${apiVersion}/${moduleName}/start?${jsonToUrl(data)}`, {
  method: 'get',
});

// 停用
export const getStop = data => request(`${apiVersion}/${moduleName}/stop?${jsonToUrl(data)}`, {
  method: 'get',
});

// 组织列表
export const getAppraisalOrganizationNotInUse = data => request(`${apiVersion}/${moduleName}/getAppraisalOrganizationNotInUse?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getRolesNotInUse = data => request(`${apiVersion}/${moduleName}/getRolesNotInUse?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取规则接口
export const getIndexRuleInfoByEmplatetId = data => request(`${apiVersion}/${moduleName}/getIndexRuleInfoByEmplatetId?${jsonToUrl(data)}`, {
  method: 'get',
});

// 设置规则接口
export const savaIndexRuleInfoByEmplatetId = (params, data) => request(`${apiVersion}/${moduleName}/savaIndexRuleInfoByEmplatetId?${jsonToUrl(params)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 生成考核计划
export const createPlanAndPlanDetail = params => request(`${apiVersion}/${moduleName}/createPlanAndPlanDetail?${jsonToUrl(params)}`, {
  method: 'get',
});
