import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'attendanceData';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});

//拉取落地式考勤机数据
export const getLDKDate = data => request(`${apiVersion}/${moduleName}/getLDKDate?${jsonToUrl(data)}`, {
    method: 'get',
});

//挂壁式考勤机
export const getHikAttendance = data => request(`${apiVersion}/${moduleName}/getHikAttendance?${jsonToUrl(data)}`, {
    method: 'get',
});
