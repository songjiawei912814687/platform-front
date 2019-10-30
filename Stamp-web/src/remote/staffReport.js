import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalreport';

// 获取分页的职务
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/getDetail?${jsonToUrl(data)}`, {
  method: 'get',
});

// 生成考核报告
export const createReport = params => request(`${apiVersion}/${moduleName}/createReport?${jsonToUrl(params)}`, {
  method: 'get',
});



