import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'attendanceData';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findAttendanceMonthReport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获得迟到、早退、未打卡详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/getUnusualDetail?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获得请假详情
export const getLeaveDetail = data => request(`${apiVersion}/leave_application/getLeaveDetail?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/attendanceMonthExport?${jsonToUrl(data)}`, {
  method: 'get',
});
