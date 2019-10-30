import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'deptSatisfaction';

// 获取分页的反馈信息
export const getPage = data => request(`${apiVersion}/${moduleName}/findDeptSatisfaction?${jsonToUrl(data)}`, {
    method: 'get',
  });

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/deptSatisfactionReportExport?${jsonToUrl(data)}`, {
    method: 'get',
  });

//获取不满意或者跑多次详情
export const selectUnstatisOrRunMany = data => request(`${apiVersion}/${moduleName}/selectUnstatis?${jsonToUrl(data)}`, {
    method: 'get',
});

