import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
const moduleName = 'auditNew';

export const getPage = data => request(`${apiVersion}/${moduleName}/auditList?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getProcess = data => request(`${apiVersion}/${moduleName}/getProcessNew?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getAudit = (data) => request(`${apiVersion}/${moduleName}/auditNew`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

export const getApplicatPage = data => request(`${apiVersion}/${moduleName}/applicatList?${jsonToUrl(data)}`, {
    method: 'get',
});


export const getExcel = data => request(`${apiVersion}/excelPort/export?${jsonToUrl(data)}`, {
    method: 'get',
});