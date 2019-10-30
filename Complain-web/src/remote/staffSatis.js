import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'windowSatisfactionStatistics';

// 获取分页的反馈信息
export const getPage = data => request(`${apiVersion}/${moduleName}/findWindowSatisfactionStatistics?${jsonToUrl(data)}`, {
    method: 'get',
  });

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/windowSatisfactionStatisticsExport?${jsonToUrl(data)}`, {
    method: 'get',
  });