import request from '../utils/request';
import { jsonToUrl, jsonHeaders,apiVersion, wHeaders} from '../utils/util';

const moduleName = 'roleOrgan';
export const savePermissions = (data) => request(`${apiVersion}/${moduleName}/savePermissions`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(data),
});
export const getPermissions = data => request(`${apiVersion}/${moduleName}/getOrganByRole?${jsonToUrl(data)}`, {
    method: 'get',
});
