import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
const moduleName = 'dimission';

// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});


export const getIsTrue = data => request(`${apiVersion}/${moduleName}/getByEmployeeId?${jsonToUrl(data)}`, {
    method: 'get',
});
