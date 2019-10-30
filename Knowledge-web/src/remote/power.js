import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'qlt_qlsx';

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
// 获取单个详情
export const getDetail = data => request(`${apiVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
  method: 'get',
});
// 查询总数
export const selectCount = data => request(`${apiVersion}/${moduleName}/select_count?${jsonToUrl(data)}`, {
  method: 'get',
});
// 导出
export const download = data => request(`${apiVersion}/${moduleName}/exportExcel?${jsonToUrl(data)}`, {
  method: 'get',
});
// 热门事项
export const setHot = data => request(`${apiVersion}/${moduleName}/update_hot_state?${jsonToUrl(data)}`, {
  method: 'get',
});

// 是否置顶
export const setParticles = data => request(`${apiVersion}/${moduleName}/update_particles_state?${jsonToUrl(data)}`, {
  method: 'get',
});
// 是否置顶
export const setData = data => request(`${apiVersion}/${moduleName}/find_materialInfo?${jsonToUrl(data)}`, {
    method: 'get',
});

//查询所有受理机构
export const findAccInsutudion = data=> request(`${apiVersion}/${moduleName}/findAllAcceptInstitution?${jsonToUrl(data)}`,{
  method: 'get',
})
