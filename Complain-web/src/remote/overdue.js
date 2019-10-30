import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'suggesstions';

// 获取分页的反馈信息
export const getPage = data => request(`${apiVersion}/${moduleName}/findOutOfDatePageList?${jsonToUrl(data)}`, {
    method: 'get',
  });

// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/getOutSuggesstionDetail?${jsonToUrl(data)}`, {
    method: 'get',
  });

// 提醒
export const remind = data => request(`${apiVersion}/${moduleName}/remind?${jsonToUrl(data)}`,{
    method:'post'
})

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/outOfDatePageListExport?${jsonToUrl(data)}`, {
    method: 'get',
  });