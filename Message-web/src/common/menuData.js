const defaultMenuList = [{
  path: 'index/stencil',
  icon: 'home',
  code: '',
  isShow: false,
  label: '短信模板',
}, {
  path: 'index/group',
  icon: 'user',
  code: '',
  isShow: false,
  label: '短信小组',
}, {
  path: 'index/send',
  icon: 'solution',
  code: 'M_ASSESSMENT_APPRAISALTEMPLATE',
  isShow: false,
  label: '发短信',
}, {
  path: 'index/wait',
  icon: 'solution',
  code: 'M_ASSESSMENT_DEPARTMENTPLAN',
  isShow: false,
  label: '待发件箱',
}, {
  path: 'index/finish',
  icon: 'solution',
  code: 'M_ASSESSMENT_EMPLOYEEPLAN',
  isShow: false,
  label: '已发件箱',
}, {
  path: 'index/receive',
  icon: 'scan',
  code: 'M_ASSESSMENT_APPRAISALEMPLOYEERECORD',
  isShow: false,
  label: '收件箱',
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
