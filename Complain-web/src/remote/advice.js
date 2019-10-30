import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, mHeaders, apiVersion } from '../utils/util';

const moduleName = 'suggesstions';


// 获取分页的反馈信息
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 导入
export const importExcel = data => request(`${apiVersion}/${moduleName}/import?${jsonToUrl(data)}`,{
  method:'post'
})

// 导出
export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});



export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 发布
export const publish = data => request(`${apiVersion}/${moduleName}/publish?${jsonToUrl(data)}`,{
    method:'post'
})

// 无效
export const setInvalid = data => request(`${apiVersion}/${moduleName}/setInvalid?${jsonToUrl(data)}`,{
  method:'get'
})

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: 'get',
});


// 获取单个处理结果
export const getDealResult = data => request(`${apiVersion}/${moduleName}/getDealResult?${jsonToUrl(data)}`,{
    method:'get'
})

// 新增、编辑 处理结果
export const formDealPost = (id, data) => request(`${apiVersion}/${moduleName}/formDealResult?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });

//员工扣分
export const formEmployeeRecordWithNoAppraisal = (id, data) => request(`${apiVersion}/${moduleName}/formEmployeeRecordWithNoAppraisal?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

//部门扣分
export const formOrgScore = (id, data) => request(`${apiVersion}/${moduleName}/formOrgScore?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

export const descrptionEdit = data => request(`${apiVersion}/${moduleName}/descrptionEdit?${jsonToUrl(data)}`,{
    method:'get'
})

export const getApprialItemDetail = data => request(`${apiVersion}/${moduleName}/getDetail?${jsonToUrl(data)}`,{
    method:'get'
})

// 保存附件
export const saveAddtition = (id, data) => request(`${apiVersion}/${moduleName}/saveAppraisalPlanItemAttachment?${jsonToUrl({ planItemId: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 获得考核计划明细的附件
export const getAddition = data => request(`${apiVersion}/${moduleName}/getAppraisalPlanItemAttachment?${jsonToUrl(data)}`, {
    method: 'get',
});
