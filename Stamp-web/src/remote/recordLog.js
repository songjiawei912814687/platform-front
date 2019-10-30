import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalrecordlog';

// 获取列表
export const selectAll = data => request(`${apiVersion}/${moduleName}/selectAll?${jsonToUrl(data)}`, {
  method: 'get',
});

