import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, mHeaders, noHeaders, apiVersion } from '../utils/util';

const moduleName = 'feedback_info';


// 获取分页的反馈信息
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导入
export const importExcel = data => request(`${apiVersion}/${moduleName}/import`,{
  method: 'post',
  body: data,
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取单个详情
export const modify = data => request(`${apiVersion}/${moduleName}/update_feedback?${jsonToUrl(data)}`, {
  method: 'post',
});
