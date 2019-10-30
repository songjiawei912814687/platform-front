import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'organization';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/getListWithinAuthority?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
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

// 查看成员
export const getMembers = data => request(`${apiVersion}/${moduleName}/getTeam?${jsonToUrl(data)}`, {
  method: 'get',
});

//同步到取号叫号
export const syncQueue = data => request(`${apiVersion}/${moduleName}/updateSyncState?${jsonToUrl(data)}`,{
  method: 'post'
})

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});
