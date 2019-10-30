import request from '../utils/request';
import { jsonToUrl, apiVersion } from '../utils/util';

export const findAttendance = data => request(`${apiVersion}/assist_decision/findAttendance?${jsonToUrl(data)}`, {
  method: 'get',
});

export const departManager = data => request(`${apiVersion}/assist_decision/departManager?${jsonToUrl(data)}`, {
  method: 'get',
});

export const averageMinute = data => request(`${apiVersion}/assist_decision/averageMinute?${jsonToUrl(data)}`, {
  method: 'get',
});

export const business = data => request(`${apiVersion}/assist_decision/business?${jsonToUrl(data)}`, {
  method: 'get',
});

export const windowDo = data => request(`${apiVersion}/assist_decision/windowDo?${jsonToUrl(data)}`, {
  method: 'get',
});

export const doCount = data => request(`${apiVersion}/assist_decision/doCount?${jsonToUrl(data)}`, {
  method: 'get',
});

export const hotDo = data => request(`${apiVersion}/assist_decision/hotDo?${jsonToUrl(data)}`, {
  method: 'get',
});

export const satisAndComplete = data => request(`${apiVersion}/assist_decision/satisAndComplete?${jsonToUrl(data)}`, {
  method: 'get',
});

export const getCompThisMonth = data => request(`${apiVersion}/assist_decision/getCompThisMonth?${jsonToUrl(data)}`, {
  method: 'get',
});

export const getWorkerDetail = data => request(`${apiVersion}/assist_decision/getWorkerDetail?${jsonToUrl(data)}`, {
  method: 'get',
});






