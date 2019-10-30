const defaultMenuList = [{
  path: 'index/power',
  icon: 'home',
  code: '',
  isShow: false,
  label: '权力事项管理',
}, {
  path: 'index/grain',
  icon: 'user',
  code: '',
  isShow: false,
  label: '最小颗粒管理',
}, {
  path: 'index/refer',
  icon: 'solution',
  code: '',
  isShow: false,
  label: '问题解答',
}];
window.authorityMenuList = JSON.parse(localStorage.getItem('authorityMenuList'));
window.authorityActionList = JSON.parse(localStorage.getItem('authorityActionList'));

const getMenuList = (data) => {
  if (data && data.length && window.authorityMenuList) {
    return data.map((item) => {
      item.isShow = window.authorityMenuList.indexOf(item.code) > -1;
      if (item.children && item.children.length) {
        getMenuList(item.children);
      }
      return item;
    });
  }
  return data;
};

export default getMenuList(defaultMenuList);

