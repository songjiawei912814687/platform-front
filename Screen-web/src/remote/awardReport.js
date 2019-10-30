import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'appraisalAwardReport';

// 获取分页的职务
export const getPage = data => request(`${apiVersion}/${moduleName}/findAppraisalAward?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/appraisalAwardReportExport?${jsonToUrl(data)}`, {
  method: 'get',
});
