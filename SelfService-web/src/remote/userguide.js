import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'user_guide';

// 获取热门事项列表
export const findQlPageList = data => request(`${apiVersion}/${moduleName}/findHotList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 按部门
export const findOrganizationList = data => request(`${apiVersion}/${moduleName}/findOrganizationList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 按主题
export const findHangPageList = data => request(`${apiVersion}/${moduleName}/findHangList?${jsonToUrl(data)}`, {
  method: 'get',
});

// 搜索事项列表
export const findByHappenType = data => request(`${apiVersion}/${moduleName}/findByHappenType?${jsonToUrl(data)}`, {
  method: 'get',
});

// 加载事项列表
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

// 下载本页
export const downLoadMessage = data => request(`${apiVersion}/${moduleName}/downLoadMessage?${jsonToUrl(data)}`, {
  method: 'get',
});
