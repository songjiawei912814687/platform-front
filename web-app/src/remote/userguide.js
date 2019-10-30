import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'user_guide';

// 按部门
export const findOrganizationList = data => request(`${apiVersion}/${moduleName}/findOrganizationList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 按主题
export const findHangPageList = data => request(`${apiVersion}/${moduleName}/findHangList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 加载事项列表  findMiniPageList
export const findMiniPageList = data => request(`${apiVersion}/${moduleName}/findMiniList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 查看更多  findMiniPageList
export const findMore = data => request(`${apiVersion}/${moduleName}/findMore?${jsonToUrl(data)}`, {
  method: 'get',
});

// 点击办事指南  findShiXList?qlFullId=010044600000250650714330183
export const findShiXList = data => request(`${apiVersion}/${moduleName}/getMessage?${jsonToUrl(data)}`, {
  method: 'get',
});

// 打印资料  download?qlFullId=010044600000250650714330183
export const download = data => request(`${apiVersion}/${moduleName}/getMaterialListById?${jsonToUrl(data)}`, {
  method: 'get',
});
