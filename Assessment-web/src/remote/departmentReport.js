import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'assessment_depart_Report';

const moduleName1 = 'appraisalplanitem';

// 获取分页的职务
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/excel?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导出
export const banjianexportExcel = data => request(`${apiVersion}/${moduleName1}/banjianExport?${jsonToUrl(data)}`, {
  method: 'get',
});
// 导出
export const liangbanexportExcel = data => request(`${apiVersion}/${moduleName1}/liangbanExport?${jsonToUrl(data)}`, {
  method: 'get',
});
// 导出
export const shixianexportExcel = data => request(`${apiVersion}/${moduleName1}/wubanshixianExport?${jsonToUrl(data)}`, {
  method: 'get',
});
