import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appointmentNumber';

// 获取部门列表
export const getDepts = () => request(`${apiVersion}/${moduleName}/getDepts`, {
  method: 'get',
});

// 获取业务列表
export const getBookableGroups = data => request(`${apiVersion}/${moduleName}/getBookableGroups?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取可预约日期
export const getBookableDateByDept = data => request(`${apiVersion}/${moduleName}/getBookableDateByDept?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取预约的情况
export const getAppointmentSummary = data => request(`${apiVersion}/${moduleName}/getAppointmentSummary?${jsonToUrl(data)}`, {
  method: 'get',
});

// 预约提交
export const appointment = data => request(`${apiVersion}/${moduleName}/appointment`, {
  method: 'post',
  body: JSON.stringify(data),
  headers: jsonHeaders,
});

// 查询预约列表
export const getAppointmentList = data => request(`${apiVersion}/${moduleName}/getAppointmentList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 取消预约
export const cancelAppointment = data => request(`${apiVersion}/${moduleName}/cancelAppointment?${jsonToUrl(data)}`, {
  method: 'get',
});
