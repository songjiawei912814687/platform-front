import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion, apiSystemVersion } from '../utils/util';

// 组织树列表
export const getOrgTree = data => request(`${apiVersion}/organization/getZtreeWithinAuthority?${jsonToUrl(data)}`, {
  method: 'get',
});

// 组织树列表
export const getOrgTreeWithOutAuthority = data => request(`${apiVersion}/organization/getZtree?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getEmployeesAll = data => request(`${apiVersion}/employees/findList?${jsonToUrl({ row: 1000, page: 0 })}`, {
  method: 'get',
});

// 人员列表
export const getWindowAll = data => request(`${apiVersion}/window/selectAll?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getRoleAll = data => request(`${apiVersion}/jobs/selectAll?${jsonToUrl({ row: 1000, page: 0 })}`, {
  method: 'get',
});


export const getMenuInit = data => request(`${apiVersion}/menu/getMenuInit`, {
    method: 'get',
});


export const getToken = () => request(`${apiSystemVersion}/config/getToken`, {
    method: 'get',
});

// 人员列表
export const getRuleAll = data => request(`${apiVersion}/attendanceRuleConfig/getRuleConfig?${jsonToUrl({ row: 1000, page: 0 })}`, {
    method: 'get',
});