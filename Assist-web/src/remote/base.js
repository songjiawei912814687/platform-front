import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

// 组织树列表
export const getOrgTree = data => request(`${apiVersion}/assist_decision/getOrganizationTree?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getEmployeesAll = data => request(`${apiVersion}/meetingapply/getEmployeesList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getWindowAll = data => request(`${apiVersion}/window/selectAll?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getRoleAll = data => request(`${apiVersion}/jobs/findPageList?${jsonToUrl({ row: 1000, page: 0 })}`, {
  method: 'get',
});

export const getMenuInit = data => request(`${apiVersion}/menu/getMenuInit?${jsonToUrl({ row: 1000, page: 0 })}`, {
    method: 'get',
});


export const getIsPerson = data => request(`${apiVersion}/meetingapply/getByUserType?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getAddress = data => request(`${apiVersion}/meetingapply/getAddressBookList?${jsonToUrl(data)}`, {
    method: 'get',
});
