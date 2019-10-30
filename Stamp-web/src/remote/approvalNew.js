import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
const moduleName = 'approvalNew';

export const getPage = data => request(`${apiVersion}/${moduleName}/selectPageList?${jsonToUrl(data)}`, {
    method: 'get',
});


export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});

export const getDel = data => request(`${apiVersion}/${moduleName}/delete?${jsonToUrl(data)}`, {
    method: 'get',
});



