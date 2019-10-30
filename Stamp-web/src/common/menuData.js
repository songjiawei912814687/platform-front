const defaultMenuList = [{
  path: 'index/myBench',
  icon: 'home',
  code: 'M_SYSTEM_MYHOME_MYHOME',
  isShow: false,
  label: '我的首页',
}, {
  key: 'staff',
  icon: 'mail',
  code: 'M_SYSTEM_MESSAGECENTER_MESSAGECENTER',
  isShow: false,
  label: '新闻中心',
  children: [
    {
      path: 'index/staff/myStaff',
      icon: 'check',
      code: 'M_SYSTEM_MESSAGECENTER_MYSTAFF',
      isShow: false,
      label: '我的发布'
    },
    {
      path: 'index/staff/staff',
      icon: 'check',
      code: 'M_SYSTEM_MESSAGECENTER_STAFF',
      isShow: false,
      label: '新闻中心'
    }
  ]
}, {
  path: 'index/window',
  icon: 'laptop',
  code: 'M_SYSTEM_MYAPPLICATION_MYAPPLICATION',
  isShow: false,
  label: '我的应用',
}, {
  path: 'index/download',
  icon: 'download',
  code: 'M_SYSTEM_DOWNLOADCENTER_DOWNLOADCENTER',
  isShow: false,
  label: '下载中心',
}, {
  key: 'review',
  icon: 'check',
  code: 'M_SYSTEM_AUDITCENTER_AUDITCENTER',
  isShow: false,
  label: '审批中心',
  children: [
    {
      path: 'index/review/approval',
      icon: 'check',
      code: 'M_SYSTEM_AUDITCENTER_MYAPPROVAL',
      isShow: false,
      label: '我审批的',
    }, {
      path: 'index/review/applicat',
      icon: 'check',
      code: 'M_SYSTEM_AUDITCENTER_MYAPPRLICTION',
      isShow: false,
      label: '我申请的',
    }

  ]
}, {
  key: 'system',
  icon: 'setting',
  code: 'M_SYSTEM_SYSTEMSETTINGS_SYSTEMSETTINGS',
  isShow: false,
  label: '系统设置',
  children: [{
    path: 'index/system/role',
    icon: 'tag-o',
    code: 'M_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT',
    isShow: false,
    label: '角色管理',
  }, {
    path: 'index/system/user',
    icon: 'user',
    code: 'M_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT',
    isShow: false,
    label: '用户管理',
  }, {
    path: 'index/system/reviewConfig',
    icon: 'user',
    code: 'M_SYSTEM_SYSTEMSETTINGS_AUDITCENTERCONFIG',
    isShow: false,
    label: '审批流配置',
  }, {
    path: 'index/system/config',
    icon: 'user',
    code: 'M_SYSTEM_SYSTEMSETTINGS_CONFIG',
    isShow: false,
    label: '系统参数配置',
  },
    {
      path: 'index/system/menu',
      icon: 'user',
      code: 'M_SYSTEM_SYSTEMSETTINGS_MENU',
      isShow: false,
      label: '菜单管理',
    }
  ],
}];
window.authorityMenuList = JSON.parse(localStorage.getItem('authorityMenuList'));
window.authorityActionList = JSON.parse(localStorage.getItem('authorityActionList'));

const getMenuList = (data) => {
  if (data && data.length && window.authorityMenuList) {
    return data.map(item => {
      item.isShow = window.authorityMenuList.indexOf(item.code) > -1;
      if (item.children && item.children.length) {
        getMenuList(item.children);
      }
      return item;
    });
  }
  return data;
};

console.log(getMenuList(defaultMenuList));

export default getMenuList(defaultMenuList);
