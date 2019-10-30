import { Notify } from 'vant';
import fetch from 'isomorphic-fetch';
import { logout } from './util';


// 检测response数据，返回data
export const httpLoad = (res) => {
  if (res) {
    if (window.parseInt(res.code) === 200) {
      return res;
    } if (window.parseInt(res.code) === 403) {
      // token验证不通过，用户登出
      logout();
    } else {
      Notify({
        message: res.message,
        background: '#ff0000',
      });
    }
  } else {
    Notify({
      message: '网络错误，请刷新重试！',
      background: '#ff0000',
    });
  }
  return false;
};

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } if (response.status === 401) {
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
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => httpLoad(data))
    .catch((err) => {
      console.error(err);
      // window.location.href="http://localhost:8080";
      Notify({
        message: '网络错误，请刷新重试！',
        background: '#ff0000',
      });
    });
}
