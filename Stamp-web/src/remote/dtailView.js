import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
const moduleName = 'detail';

// 查看
export const getEmployeeDetail = data => request(`${apiVersion}/${moduleName}/getEmployee?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getMeetingDetail = data => request(`${apiVersion}/${moduleName}/getMeeting?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getApplyDetail = data => request(`${apiVersion}/${moduleName}/getApply?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getJobChangeDetail = data => request(`${apiVersion}/${moduleName}/getJobChange?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getOvertimeDetail = data => request(`${apiVersion}/${moduleName}/getOvertime?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getAdjustDetail = data => request(`${apiVersion}/${moduleName}/getAdjust?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getDismissionDetail = data => request(`${apiVersion}/${moduleName}/getDismission?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getAppraisaleDetail = data => request(`${apiVersion}/${moduleName}/getAppraisale?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getAppraisalcomplaintDetail = data => request(`${apiVersion}/${moduleName}/getAppraisalcomplaint?${jsonToUrl(data)}`, {
    method: 'get',
});
