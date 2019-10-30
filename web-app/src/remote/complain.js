import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, wechatVersion } from '../utils/util';

const moduleName = 'wechatsug';

// 按部门
export const getOrgList = data => request(`${wechatVersion}/${moduleName}/getAllOrganizaion?${jsonToUrl(data)}`, {
  method: 'get',
});

// 按部门
export const getWindows = data => request(`${wechatVersion}/${moduleName}/getWindows?${jsonToUrl(data)}`, {
  method: 'get',
});

// 新增
export const addComplain = data => request(`${wechatVersion}/${moduleName}/add`, {
  method: 'post',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
