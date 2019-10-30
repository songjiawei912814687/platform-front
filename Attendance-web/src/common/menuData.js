const defaultMenuList =  [
  {
    key: 'attendance',
    icon: 'home',
    code: 'M_ATTENDANCE_ATTENDANCEMANAGEMENT',
    isShow: false,
    label: '考勤管理',
    children: [{
      path: 'index/attendance/data',
      icon: 'file-text',
      code: 'M_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE',
      isShow: false,
      label: '考勤数据管理',
    }, {
      path: 'index/attendance/rule',
      icon: 'safety',
      code: 'M_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCEDATA',
      isShow: false,
      label: '考勤规则设置',
    }],
  }, {
    key: 'leave',
    icon: 'user',
    code: 'M_ATTENDANCE_LEAVEMANAGEMENT',
    isShow: false,
    label: '请假管理',
    children: [{
      path: 'index/leave/apply',
      icon: 'select',
      code: 'M_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION',
      isShow: false,
      label: '请假申请',
    }, {
      path: 'index/leave/holiday',
      icon: 'environment',
      code: 'M_ATTENDANCE_LEAVEMANAGEMENT_HOLIDAY',
      isShow: false,
      label: '节假日管理',
    }, {
      path: 'index/leave/overtime',
      icon: 'coffee',
      code: 'M_ATTENDANCE_LEAVEMANAGEMENT_OVERTIMEAPPLICATION',
      isShow: false,
      label: '加班申请',
    }, {
      path: 'index/leave/adjust',
      icon: 'file',
      code: 'M_ATTENDANCE_LEAVEMANAGEMENT_OFFAPPLICATION',
      isShow: false,
      label: '调休申请',
    }, {
      path: 'index/leave/supply',
      icon: 'form',
      code: 'M_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATIONCOLLECTION',
      isShow: false,
      label: '请假补录',
    }],
  }, {
    key: 'report',
    icon: 'home',
    code: '',
    isShow: false,
    label: '统计报表',
    children: [{
      path: 'index/report/day',
      icon: 'calendar',
      code: 'M_ATTENDANCE_STATISTICALREPORTS_ATTENDANCEDAILYDATA',
      isShow: false,
      label: '考勤报表',
    }, {
      path: 'index/report/overtime',
      icon: 'table',
      code: 'M_ATTENDANCE_STATISTICALREPORTS_OVERTIMEREPORT',
      isShow: false,
      label: '加班报表',
    }],
  },
];
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
