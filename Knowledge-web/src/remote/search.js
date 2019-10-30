import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';
const moduleName = 'slor';
export const search = data => request(`${apiVersion}/${moduleName}/query?${jsonToUrl(data)}`, {
    method: 'get',
});
