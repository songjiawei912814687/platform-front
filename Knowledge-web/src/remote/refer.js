import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'question';

// 获取列表
export const getPage = data => request(`${apiVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
  method: 'get',
});
// 新增
export const formPost = (id, data) => request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});


export const answerQuestion = (id, data) => request(`${apiVersion}/${moduleName}/answerQuestion?${jsonToUrl({ id: id || '' })}`, {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify(data),
});
// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/get?${jsonToUrl(data)}`, {
  method: 'get',
});
// 删除
export const getDel = data => request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
  method: 'get',
});
// 是否公开
export const setOpen = data => request(`${apiVersion}/${moduleName}/isOpen?${jsonToUrl(data)}`, {
  method: 'get',
});

// 是否置顶
export const setTop = data => request(`${apiVersion}/${moduleName}/isTop?${jsonToUrl(data)}`, {
  method: 'get',
});

export const setRelese = data => request(`${apiVersion}/${moduleName}/issued?${jsonToUrl(data)}`, {
  method: 'get',
});

export const getQuestionType = data => request(`${apiVersion}/${moduleName}/getTypeList?${jsonToUrl(data)}`, {
  method: 'get',
});


export const exportExcel = data => request(`${apiVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
    method: 'get',
});

// 发送答案
export const sendAnswer = data => request(`${apiVersion}/${moduleName}/sendAnswer?${jsonToUrl(data)}`, {
  method: 'get',
});
