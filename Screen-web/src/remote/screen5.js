import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, mHeaders, apiVersion } from '../utils/util';

const moduleName = 'meeting';


// 获取会议室接口
export const getMeetingRoom = data => request(`${apiVersion}/${moduleName}/meetingRoom?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取当前会议接口
export const getMeeting = data => request(`${apiVersion}/${moduleName}/meeting?${jsonToUrl(data)}`, {
  method: 'get',
});

// 获取当前会议接口
export const getMeetingList = data => request(`${apiVersion}/${moduleName}/nextMeeting?${jsonToUrl(data)}`, {
  method: 'get',
});
