const defaultMenuList = [{
  path: 'index/classify',
  icon: 'home',
  code: 'M_ASSESSMENT_APPRAISALINDEX',
  isShow: false,
  label: '指标分类',
}, {
  path: 'index/rule',
  icon: 'user',
  code: 'M_ASSESSMENT_APPRAISALRULE',
  isShow: false,
  label: '考核规则',
}, {
  path: 'index/template',
  icon: 'solution',
  code: 'M_ASSESSMENT_APPRAISALTEMPLATE',
  isShow: false,
  label: '考核模版',
}, {
  path: 'index/departmentCheck',
  icon: 'solution',
  code: 'M_ASSESSMENT_DEPARTMENTPLAN',
  isShow: false,
  label: '部门考核计划',
}, {
  path: 'index/staffCheck',
  icon: 'solution',
  code: 'M_ASSESSMENT_EMPLOYEEPLAN',
  isShow: false,
  label: '员工考核计划',
}, {
  path: 'index/score',
  icon: 'scan',
  code: 'M_ASSESSMENT_APPRAISALEMPLOYEERECORD',
  isShow: false,
  label: '员工加减分',
}, {
  path: 'index/complain',
  icon: 'scan',
  code: 'M_ASSESSMENT_APPRAISALCOMPLAINT',
  isShow: false,
  label: '考核申诉',
}, {
  path: 'index/awardReport',
  icon: 'team',
  code: 'M_ASSESSMENT_ASSESSMENTAWARDREPORT',
  isShow: false,
  label: '考核奖报表',
}, {
  path: 'index/departmentReport',
  icon: 'team',
  code: 'M_ASSESSMENT_DEPARTMENTREPORT',
  isShow: false,
  label: '部门考核报表',
}, {
  path: 'index/staffReport',
  icon: 'team',
  code: 'M_ASSESSMENT_EMPLOYEEREPORT',
  isShow: false,
  label: '员工考核报表',
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
