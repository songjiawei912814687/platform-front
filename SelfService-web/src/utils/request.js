import { message } from 'ant-design-vue';
import fetch from 'isomorphic-fetch';
import { logout } from './util';


// 检测response数据，返回data
export const httpLoad = (res) => {
  if (res) {
    if (window.parseInt(res.code) === 200) {
      return res;
    } else if (window.parseInt(res.code) === 403) {
      // token验证不通过，用户登出
      logout();
    } else {
      message.error(res.message);
    }
  } else {
    message.error('网络错误，请刷新重试！');
  }
  return false;
};

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 401) {
    // token验证不通过，用户登出
    logout();
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const commonHeader = {
    Account: sessionStorage.getItem('Account') || '',
    UserId: sessionStorage.getItem('UserId') || '',
    PartyOrganizationId: sessionStorage.getItem('PartyOrganizationId') || '',
    access_token: sessionStorage.getItem('access_token') || '',
  };
  const currentOptions = {
    ...options,
  };
  if (currentOptions.headers) {
    const headersObj = {};
    for (const key of options.headers.keys()) {
      headersObj[key] = options.headers.get(key);
    }
    currentOptions.headers = new Headers({
      ...headersObj,
      ...commonHeader,
    });
  } else {
    currentOptions.headers = new Headers(commonHeader);
  }

  // 所有请求加上时间戳，禁止防止浏览器缓存请求
  const currentUrl = url.indexOf('?') > -1 && url.indexOf('?') !== url.length ? (`${url}&t=${Date.now()}`)
    : (`${url}?t=${Date.now()}`);

  return fetch(currentUrl, currentOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => httpLoad(data))
    .catch((err) => {
      console.error(err);
      // window.location.href="http://localhost:8080";
      message.error('网络错误，请刷新重试！');
    });
}
