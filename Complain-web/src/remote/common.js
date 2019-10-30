import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';

const moduleName = 'public';



// 获组织树
export const getOrganizationTree = data => request(`${apiVersion}/${moduleName}/getZtreeWithinAuthority?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获组织树
export const getOrganizationTree2 = data => request(`${apiVersion}/${moduleName}/getOrganizationTree?${jsonToUrl(data)}`, {
  method: 'get',
});

// 根据部门id获取窗口列表
export const getWindows = data => request(`${apiVersion}/${moduleName}/getWindows?${jsonToUrl(data)}`,{
  method:'get'
})

// 根据窗口id 获取人员列表
export const getEmployeesByWindowsId = data => request(`${apiVersion}/${moduleName}/getEmployeesByWindowsId?${jsonToUrl(data)}`,{
  method:'get'
})

export const getEmployeesAll = data => request(`${apiVersion}/${moduleName}/getEmployees?${jsonToUrl(data)}`,{
    method:'get'
})

export const selectAllAppraisalIndex = data => request(`${apiVersion}/${moduleName}/selectAllAppraisalIndex?${jsonToUrl(data)}`,{
    method:'get'
})

export const selectAllAppraisalRule = data => request(`${apiVersion}/${moduleName}/selectAllAppraisalRule?${jsonToUrl(data)}`,{
    method:'get'
})
export const getRuleByIndexId = data => request(`${apiVersion}/${moduleName}/getRuleByIndexId?${jsonToUrl(data)}`,{
    method:'get'
})

export const findDepartmentPlan = data => request(`${apiVersion}/${moduleName}/findDepartmentPlan?${jsonToUrl(data)}`,{
    method:'get'
})
