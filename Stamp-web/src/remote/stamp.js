import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'printInfo';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/selectPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});

// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/formPost?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: 'get',
});

// 刻章接受
export const CompanyDuration = data => request(`${apiVersion}/${moduleName}/countCompanyPushTimeDuration?${jsonToUrl(data)}`, {
    method: 'get',
});
// 公章送达
export const StampDuration = data => request(`${apiVersion}/${moduleName}/countStampDuration?${jsonToUrl(data)}`, {
    method: 'get',
});// 税务发票
export const TaxDuration = data => request(`${apiVersion}/${moduleName}/countTaxDuration?${jsonToUrl(data)}`, {
    method: 'get',
});// 银行开户
export const BankDuration = data => request(`${apiVersion}/${moduleName}/countBankDuration?${jsonToUrl(data)}`, {
    method: 'get',
});

// 总时长
export const AllDuration = data => request(`${apiVersion}/${moduleName}/countAllDuration?${jsonToUrl(data)}`, {
    method: 'get',
});




// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
    method: 'get',
});
