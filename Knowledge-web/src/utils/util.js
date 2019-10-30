// 序列化数据
export function jsonToUrl(jsonData) {
  let html = '';
  for (const i in jsonData) {
    const data = (!jsonData[i] && jsonData[i] !== 0) ? '' : (typeof jsonData[i] === 'string' ? jsonData[i].trim() : jsonData[i]);
    html += `&${i}=${encodeURIComponent(data)}`;
  }
  return html.slice(1);
}

// 获取url参数
export function getParameterByName(name, url) {
  const newUrl = url || window.location.href;
  const newName = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${newName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(newUrl);

  if (!results) return '';
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 延迟
export const delay = time => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});

// 自动执行方法
export const autoDoFn = (fn) => {
  fn();
};

// 将树的值转换为字符串
export const transformTree = (data) => {
  if (data && data.length) {
    return data.map(item => ({
      ...item,
      value: String(item.value),
      key: String(item.key),
      children: transformTree(item.children),
    }));
  }
};

export const transformTree3 = (data) => {
    if (data && data.length) {
        return data.map(item => ({
            ...item,
            key: String(item.key),
            children: transformTree(item.children),
        }));
    }
};
export const transformTree2 = (data) => {
  if (data && data.length) {
    return data.map(item => ({
      ...item,
      label: String(item.happeningType),
      value: String(item.id),
      key: String(item.id),
      qlsxId: String(item.qlsxId),
      children: transformTree2(item.children),
    }));
  }
};

export const transformTree1 = (data, defaultCheckedKeys, halfCheckedKeys) => {
  if (data && data.length) {
    return data.map((item) => {
      if (String(item.checkState) === 'true') {
        if (item.hasChild) {
          halfCheckedKeys.push(`${String(item.id)}_${String(item.type)}_${String(item.parentId)}`);
        } else {
          defaultCheckedKeys.push(`${String(item.id)}_${String(item.type)}_${String(item.parentId)}`);
        }
      }
      return {
        ...item,
        title: item.name,
        value: `${String(item.id)}_${String(item.type)}_${String(item.parentId)}`,
        key: `${String(item.id)}_${String(item.type)}_${String(item.parentId)}`,
        children: transformTree1(item.children, defaultCheckedKeys, halfCheckedKeys),
      };
    });
  }
  return [];
};

// 格式化时间
export const formatTime = (time) => {
  const h = Math.floor(time / (60 * 60 * 1000));


  const m = Math.floor((time / 60000) % 60);


  const s = Math.floor((time / 1000) % 60);


  const tc = [];

  if (h > 0) {
    tc.push(h);
  }

  tc.push((m < 10 && h > 0 ? `0${m}` : m));
  tc.push((s < 10 ? `0${s}` : s));

  return h > 0 ? `${h}小时` : `${m}` > 0 ? `${m}分钟` : '';
};

export function logout() {
  console.log(1111);
}

export const jsonHeaders = new Headers({
  'Content-Type': 'application/json',
});

export const wHeaders = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
});

export const apiVersion = '/api-knowledge';
