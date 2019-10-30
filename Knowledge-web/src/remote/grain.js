import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'minimum_particle';

// 获取带组织id列表
export const getParList = data => request(`${apiVersion}/${moduleName}/getParList?${jsonToUrl(data)}`, {
    method: 'get',
});
// 获取列表
export const getPage = data => request(`${apiVersion}/${moduleName}/getList?${jsonToUrl(data)}`, {
  method: 'get',
});
// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});
// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});

// 发布或未发布
export const publish = data => request(`${apiVersion}/${moduleName}/publish?${jsonToUrl(data)}`, {
  method: 'get',
});
// 批量上传
export const addMaterialInBatch = data => request(`${apiVersion}/material_list/addMaterialInBatch?${jsonToUrl(data)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: '',
});

