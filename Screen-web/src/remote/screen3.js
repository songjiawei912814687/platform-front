import request from '../utils/request';
import { jsonToUrl, jsonHeaders, wHeaders, mHeaders, apiVersion } from '../utils/util';

const moduleName = 'noticeBoard';

export const getNoticeBoardList = () => request(`${apiVersion}/noticeBoard/findPageList`, {
  method: 'get',
});

export const getLighthouseList = () => request(`${apiVersion}/lighthouse/findPageList`, {
  method: 'get',
});

export const getSmallProjectResult = () => request(`${apiVersion}/smallProjectResult/findPageList`, {
  method: 'get',
});

export const getSmallProjectTrans = () => request(`${apiVersion}/smallProjectTrans/findPageList`, {
  method: 'get',
});

export const getBuildWindList = () => request(`${apiVersion}/buildWind/findPageList`, {
  method: 'get',
});

export const getBuildCallList = () => request(`${apiVersion}/buildCall/findPageList`, {
  method: 'get',
});

export const getTradingCenterList = () => request(`${apiVersion}/tradingCenter/selectPage`, {
  method: 'get',
});

export const getTradingResultList = () => request(`${apiVersion}/tradingResult/selectPage`, {
  method: 'get',
});
