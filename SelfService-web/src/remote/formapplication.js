import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'form_application';

// 提交表单
export const add = (data) => request(`${apiVersion}/${moduleName}/add`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
// 提交表单
export const add2 = (data) => request(`${apiVersion}/${moduleName}/add2`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
// 提交表单
export const add3 = (data) => request(`${apiVersion}/${moduleName}/add3`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});
// 提交表单
export const add4 = (data) => request(`${apiVersion}/${moduleName}/add4`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});
