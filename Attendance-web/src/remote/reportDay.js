import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'attendanceData';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findAttendanceDailyDate?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/attendanceDailyDateExport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 请假详情
export const getDetail = data => request(`${apiVersion}/leave_application/getLeaveDetailByEmployeeIdAndDate?${jsonToUrl(data)}`, {
    method: 'get',
});

//手动生成日报表的按钮
export const handleReportDay = data => request(`${apiVersion}/${moduleName}/createDailyReport?${jsonToUrl(data)}`, {
  method: 'post',
});
    //手动生成日报表的按钮
export const handleReportDays = data => request(`${apiVersion}/${moduleName}/createDailyReports?${jsonToUrl(data)}`, {
  method: 'post',
});

