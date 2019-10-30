import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders,assementVersion } from '../utils/util';

const moduleName = 'appraisalemployeerecord';

// 获取列表
export const selectPage = data => request(`${assementVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});
// 新增
export const formPost = (id, data) => request(`${assementVersion}/${moduleName}/formEmployeeRecordWithNoAppraisal?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
// 删除
export const getDel = data => request(`${assementVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});



// 获取单个详情
export const getDetail = data => request(`${assementVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 下载
export const downloadFile = data => request(`${assementVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
  method: 'get',
});

//设置有效无效
export const setvalid = data => request(`${assementVersion}/${moduleName}/updateIsUse?${jsonToUrl(data)}`, {
    method: 'get',
});
