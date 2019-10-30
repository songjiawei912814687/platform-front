import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'jobs';

// 获取分页的职务
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

//  录入
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});
