import request from '../utils/request';
import { jsonToUrl, jsonHeaders,apiVersion, wHeaders} from '../utils/util';

const moduleName = 'role';
// 获取分页的用户
export const getPage = data => request(`${apiVersion}/${moduleName}/selectPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getAll = data => request(`${apiVersion}/${moduleName}/selectAll?${jsonToUrl(data)}`, {
  method: 'get',
});
//  录入
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/delete?${jsonToUrl(data)}`, {
    method: 'get',
});
//获取指定角色下用户
export const getByRoleId = data => request(`${apiVersion}/users/getByRoleId?${jsonToUrl(data)}`, {
    method: 'get',
});

//获取指定角色下用户
export const getByRoleIdNotIn = data => request(`${apiVersion}/users/getByRoleIdNotIn?${jsonToUrl(data)}`, {
    method: 'get',
});

//角色授权给人
export const saveByRoleId = data => request(`${apiVersion}/userRole/saveByRoleId?${jsonToUrl(data)}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 删除
export const getUsersDel = data => request(`${apiVersion}/userRole/deleteByRoleId?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取角色权限
export const getPermissionsByRoleId = data => request(`${apiVersion}/roleAction/getPermissions?${jsonToUrl(data)}`, {
  method: 'get',
});


