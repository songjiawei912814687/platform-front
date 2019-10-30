import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'sms_receive';

// 获取列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});
// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
  method: 'get',
});
// 获取单个详情
export const getDelete = data => request(`${apiVersion}/${moduleName}/logicDelete?idList=${data.id}`, {
  method: 'get',
});
// 导出Excel
export const exportExcel = data => request(`${apiVersion}/${moduleName}//exportExcel?${jsonToUrl(data)}`, {
  method: 'get',
});
