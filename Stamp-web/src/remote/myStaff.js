import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'messageCenter';


export const getPage = data => request(`${apiVersion}/${moduleName}/selectCurrentList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});



//  录入
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

export const uploadImg = (data) => request(`/upload`, {
    method: 'POST',
    body: JSON.stringify(data),
    withCredentials: true
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/delete?${jsonToUrl(data)}`, {
    method: 'get',
});


export const getRelease = data => request(`${apiVersion}/${moduleName}/release?${jsonToUrl(data)}`,{
    method: 'get'
})

export const getTop = data => request(`${apiVersion}/${moduleName}/top?${jsonToUrl(data)}`,{
    method: 'get'
})
