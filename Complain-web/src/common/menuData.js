const defaultMenuList = [
  {
    path: 'index/feedback',
    icon: 'rollback',
    code: 'M_ASSESSMENT_FEEDBACK',
    isShow: true,
    label: '反馈信息',
  },
  {
    path: 'index/advice',
    icon: 'customer-service',
    code: 'M_ASSESSMENT_ADVICE',
    isShow: true,
    label: '投诉建议',
  },
  {
    path: 'index/overdue',
    icon: 'exception',
    code: 'M_ASSESSMENT_OVERDUE',
    isShow: true,
    label: '逾期未处理',
  },
  {
    path: 'index/departsatis',
    icon: 'home',
    code: 'M_ASSESSMENT_DEPARTSATIS',
    isShow: true,
    label: '部门满意度统计',
  },
  {
    path: 'index/staffsatis',
    icon: 'smile-o',
    code: 'M_ASSESSMENT_STAFFSATIS',
    isShow: true,
    label: '人员满意度统计',
  },
];
window.authorityMenuList = JSON.parse(localStorage.getItem('authorityMenuList'));
window.authorityActionList = JSON.parse(localStorage.getItem('authorityActionList'));

const getMenuList = (data) => {
  if(data && data.length && window.authorityMenuList){
    return data.map(item => {
      // item.isShow = window.authorityMenuList.indexOf(item.code) > -1;
      if(item.children && item.children.length){
        getMenuList(item.children);
      }
      return item;
    });
  }
  return data;
};

export default getMenuList(defaultMenuList);
