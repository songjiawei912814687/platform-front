import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'attendance';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/attendanceDailyDateExport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 采集数据
export const obtainData = data => request(`${apiVersion}/${moduleName}/updateAttendancedate?${jsonToUrl(data)}`, {
  method: 'get',
});



