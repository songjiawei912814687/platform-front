import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalIndex';

// 获取列表
export const getPage1 = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});
// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
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

// 启用
export const getStart = data => request(`${apiVersion}/${moduleName}/start?${jsonToUrl(data)}`, {
  method: 'get',
});

// 停用
export const getStop = data => request(`${apiVersion}/${moduleName}/stop?${jsonToUrl(data)}`, {
  method: 'get',
});
// 员工加减分记录查找考核指标接口
export const selectAll = data => request(`${apiVersion}/${moduleName}/selectAll?${jsonToUrl(data)}`, {
  method: 'get',
});
