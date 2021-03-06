import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

// 组织树列表
export const getOrgTree = data => request(`${apiVersion}/StampOrgan/getAll?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获得末级组织
export const getLastStageOrganization = data => request(`${apiVersion}/organization/getLastStageOrganization?${jsonToUrl(data)}`, {
    method: 'get',
  });

// 人员列表
export const getStaffPage = data => request(`${apiVersion}/employees/findList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 人员列表
export const getEmployee = data => request(`${apiVersion}/approvalConfigNew/getSearchEmployees?${jsonToUrl(data)}`, {
  method: 'get',
});

// 人员列表
export const getJobAll = data => request(`${apiVersion}/approvalConfigNew/getJobs?${jsonToUrl({ row: 1000, page: 0 })}`, {
    method: 'get',
});

export const getRoleAll = data => request(`${apiVersion}/role/selectAll?${jsonToUrl({ row: 1000, page: 0 })}`, {
    method: 'get',
});

export const getLevelAll = data => request(`${apiVersion}/approvalConfigNew/getLevel?${jsonToUrl(data,{ row: 1000, page: 0 })}`, {
    method: 'get',
});

export const getToken = () => request(`${apiVersion}/get/cookie`, {
    method: 'get',
});
