import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, apiVersion } from '../utils/util';


export const login = data => request('/users/login', {
  method: 'POST',
  headers: wHeaders,
  body: jsonToUrl(data),
});

export const logout = data => request(`${apiVersion}/logout`, {
  method: 'get',
});
