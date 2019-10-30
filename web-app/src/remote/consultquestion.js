import request from "../utils/request";
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from "../utils/util";

const moduleName = "openquestion";

// 列表  findPageList
export const findPageList = data =>
  request(`/${moduleName}/findPageList?${jsonToUrl(data)}`, {
    method: "get"
  });

// 问题部门列表  
export const getOrganizations = data =>
  request(`/${moduleName}/getQustionOrganizations?${jsonToUrl(data)}`, {
    method: "get"
  });

// 获取单个咨询问题接口
export const get = data =>
  request(`/${moduleName}/get?${jsonToUrl(data)}`, {
    method: "get"
  });
