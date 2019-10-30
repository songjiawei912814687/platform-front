import request from '../utils/request';
import { jsonToUrl, jsonHeaders,apiVersion, wHeaders} from '../utils/util';

const moduleName = 'userRole';
export const saveByRoleId = (id, data) => request(`${apiVersion}/${moduleName}/saveByRoleId?${jsonToUrl({})}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});

export const updatePassword = ( data) => request(`${apiVersion}/${moduleName}/updatePassWord?${jsonToUrl({})}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});
