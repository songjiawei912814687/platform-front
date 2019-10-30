import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'pitapply';

// 列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 列表
export const getMyPage = data => request(`${apiVersion}/${moduleName}/findMyMeetingApply?${jsonToUrl(data)}`, {
  method: 'get',
});

// 详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});

// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});


export const getOrgTree = data => request(`${apiVersion}/${moduleName}/getZtree?${jsonToUrl(data)}`, {
    method: 'get',
});
