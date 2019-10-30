import request from '../utils/request';
import { jsonToUrl, jsonHeaders,apiVersion, wHeaders} from '../utils/util';

const moduleName = 'users';
// 获取分页的用户
export const getPage = data => request(`${apiVersion}/${moduleName}/selectPageList?${jsonToUrl(data)}`, {
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

//获取用户的角色
export const getByRoleId = data => request(`${apiVersion}/role/getByUserId?${jsonToUrl(data)}`, {
  method: 'get',
});

// 保存选中的角色
export const saveByRoleId = (data) => request(`${apiVersion}/userRole/saveByUserId`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 删除选中的角色
export const getUsersDel = (data) => request(`${apiVersion}/userRole/deleteByUserId?${jsonToUrl(data)}`, {
  method: 'get',
});


//获取指定角色用户接口
export const getRoleListByRoleId = data => request(`${apiVersion}/role/getByUserId?${jsonToUrl(data)}`, {
  method: 'get',
});

//获取指定用户没有的角色接口
export const getByRoleIdNotIn = data => request(`${apiVersion}/role/getByUserIdNotIn?${jsonToUrl(data)}`, {
  method: 'get',
});

export const updatePwd = data => request(`${apiVersion}/${moduleName}/updatePwd?${jsonToUrl(data)}`, {
    method: 'get',
});

