const defaultMenuList = [{
  path: 'index/org',
  icon: 'home',
  code: 'M_PERSONNEL_ORGANIZATION',
  isShow: false,
  label: '组织机构管理',
}, {
  path: 'index/staff',
  icon: 'user',
  code: 'M_PERSONNEL_EMPLOYEES',
  isShow: false,
  label: '人员管理',
}, {
  path: 'index/window',
  icon: 'scan',
  code: 'M_PERSONNEL_WINDOW',
  isShow: false,
  label: '窗口管理',
}, {
  path: 'index/role',
  icon: 'solution',
  code: 'M_PERSONNEL_JOBS',
  isShow: false,
  label: '职务管理',
}, {
  path: 'index/post',
  icon: 'team',
  code: 'M_PERSONNEL_JOBCHANGE',
  isShow: false,
  label: '人员岗位变动',
}];
window.authorityMenuList = JSON.parse(localStorage.getItem('authorityMenuList'));
window.authorityActionList = JSON.parse(localStorage.getItem('authorityActionList'));

const getMenuList = (data) => {
  if(data && data.length && window.authorityMenuList){
    return data.map(item => {
      item.isShow = window.authorityMenuList.indexOf(item.code) > -1;
      if(item.children && item.children.length){
        getMenuList(item.children);
      }
      return item;
    });
  }
  return data;
};

export default getMenuList(defaultMenuList);
