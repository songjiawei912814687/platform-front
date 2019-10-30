import request from "../utils/request";
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from "../utils/util";

const moduleName = "smsSend";

// 获取短信发送成功列表
export const getPageSuccess = data =>
  request(`${apiVersion}/${moduleName}/selectPage?${jsonToUrl(data)}`, {
    method: "get"
  });
// 获取短信发送失败列表
export const getPageError = data =>
  request(`${apiVersion}/${moduleName}/selectNotPage?${jsonToUrl(data)}`, {
    method: "get"
  });
// 新增
export const formPost = (id, data) =>
  request(`${apiVersion}/${moduleName}/form?${jsonToUrl({ id: id || "" })}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data)
  });
// 一键重发
export const reSendAll = data =>
  request(`${apiVersion}/${moduleName}/reSendAll?${jsonToUrl(data)}`, {
    method: "get"
  });
// 重发
export const reSend = data =>
  request(`${apiVersion}/${moduleName}/reSendMessage?${jsonToUrl(data)}`, {
    method: "get"
  });

// 删除
export const getDel = data =>
  request(`${apiVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: "get"
  });

// 获得所有的导入名单;
export const getImportLists = data =>
  request(`${apiVersion}/msg/selectAlls?${jsonToUrl(data)}`, {
    method: "post"
  });
