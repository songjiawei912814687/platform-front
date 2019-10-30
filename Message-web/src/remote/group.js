import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'messageGroup';

// 获取列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取不分页
export const getAll = data => request(`${apiVersion}/${moduleName}/findAll?${jsonToUrl(data)}`, {
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
// 获取所有员工接口
export const getEmployees = data => request(`${apiVersion}/${moduleName}/getEmployees?${jsonToUrl(data)}`, {
  method: 'get',
});


export const getOrgTree = data => request(`${apiVersion}/${moduleName}/getZtree?${jsonToUrl(data)}`, {
    method: 'get',
});


export const getTeam = data => request(`${apiVersion}/${moduleName}/getGroupEmployees?${jsonToUrl(data)}`,{
  method: 'get'
})

export const addMessageGroup = data => request(`${apiVersion}/${moduleName}/addMessageGroup?${jsonToUrl(data)}`,{
    method: 'get'
})


export const getDelTeam = data => request(`${apiVersion}/${moduleName}/deleteMessageGroup?${jsonToUrl(data)}`, {
    method: 'get',
});
