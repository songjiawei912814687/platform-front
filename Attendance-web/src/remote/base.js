import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

// 组织树列表
export const getOrgTree = data => request(`${apiVersion}/leave_application/organization/getTree?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getStaffPage = data => request(`${apiVersion}/leave_application/getEmployees?${jsonToUrl(data)}`, {
  method: 'get',
});


export const getMenuInit = data => request(`${apiVersion}/menu/getMenuInit?`, {
    method: 'get',
});

export const getIsPerson = data => request(`${apiVersion}/menu/getByUserTypeAndLevel?`, {
    method: 'get',
});
