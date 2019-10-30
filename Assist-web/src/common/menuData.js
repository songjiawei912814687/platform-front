const defaultMenuList = [{
  path: 'index/room',
  icon: 'home',
  code: 'M_MEETING_MEETINGROOM',
  isShow: false,
  label: '会议室管理',
}, {
  path: 'index/appointment',
  icon: 'edit',
  code: 'M_MEETING_MEETINGAPPLY',
  isShow: false,
  label: '会议预约',
}, {
  path: 'index/pit',
  icon: 'edit',
  code: 'M_MEETING_PIT',
  isShow: false,
  label: '开评标室管理',
}, {
  path: 'index/pitapply',
  icon: 'edit',
  code: 'M_MEETING_PITAPPLY',
  isShow: false,
  label: '开评标室预约',
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


