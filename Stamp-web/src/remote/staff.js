import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'employees';


export const getPage = data => request(`${apiVersion}/${moduleName}/findList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});

export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});


export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getReportPage = data => request(`${apiVersion}/${moduleName}/getEmployeesReport?${jsonToUrl(data)}`, {
    method: 'get',
});

// 导出
export const exportReportExcel = data => request(`${apiVersion}/${moduleName}/employeesReportExport?${jsonToUrl(data)}`, {
    method: 'get',
});

// 同步数据
export const synchronize = data => request(`${apiVersion}/${moduleName}/updatePerson?${jsonToUrl(data)}`, {
    method: 'get',
});


