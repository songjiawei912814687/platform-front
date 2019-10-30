import request from '../utils/request';
import { jsonToUrl, apiVersion } from '../utils/util';

//部门月度统计
export const getDepartStatic = data => request(`${apiVersion}/organizationReport/OrganizationMonthReport?${jsonToUrl(data)}`, {
  method: 'get',
});


// 月度统计
export const getTotalStatic = data => request(`${apiVersion}/organizationReport/MonthReport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 规则统计
export const getRuleStatic = data => request(`${apiVersion}/organizationReport/ruleReport?${jsonToUrl(data)}`, {
  method: 'get',
});

// 部门统计
export const getPersonStatic = data => request(`${apiVersion}/organizationReport/OrganizationReportList?${jsonToUrl(data)}`, {
  method: 'get',
});
