import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, wechatVersion ,LeaveVersion,apiVersion} from '../utils/util';

const moduleName = 'leave_application';

// 按部门
export const getPage = data => request(`${LeaveVersion}/${moduleName}/findPageList?${jsonToUrl(data)}`, {
    method: 'get',
});

// 详情
export const getDetail = data => request(`${LeaveVersion}/${moduleName}/selectById?${jsonToUrl(data)}`, {
    method: 'get',
});
// 新增
export const formPost = (id, data) => request(`${LeaveVersion}/${moduleName}/form?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 新增
export const formWechat = (id, data) => request(`${LeaveVersion}/${moduleName}/formWechat?${jsonToUrl({ id: id || '' })}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

// 删除
export const getDel = data => request(`${LeaveVersion}/${moduleName}/logicDelete?${jsonToUrl(data)}`, {
    method: 'get',
});

// 获取考勤规则，上班时间下班时间
export const getAttendanceRule = data => request(`${LeaveVersion}/attendanceRuleNew/selectInUseByuser?${jsonToUrl(data)}`, {
    method: 'get',
});

// 导出
export const exportExcel = data => request(`${LeaveVersion}/${moduleName}/export?${jsonToUrl(data)}`, {
    method: 'get',
});
