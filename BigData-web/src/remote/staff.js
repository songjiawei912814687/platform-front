import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'messageCenter';


export const getStaffPage = data => request(`${apiVersion}/${moduleName}/selectPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 查看
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});
