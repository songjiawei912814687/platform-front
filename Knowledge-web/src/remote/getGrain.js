import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'qlt_qlsx';

// 获取列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findMinPageList?${jsonToUrl(data)}`, {
  method: 'get',
});
