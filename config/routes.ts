export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '首页' },
  { path: '/shortLink/create', access: 'canUser', icon: 'subnode', component: './ShortLink/ShortLinkCreate', name: '短链接生成' },
  { path: '/shortLink/check', access: 'canUser', icon: 'subnode', component: './ShortLink/ShortLinkCheck', name: '短链接检查',hideInMenu:true},
  { path: '/shortLink/publish', access: 'canUser', icon: 'subnode', component: './ShortLink/ShortLinkPublish', name: '短链接发布',hideInMenu:true},
  { path: '/shortLink/reduction', access: 'canUser', icon: 'redo', component: './ShortToLong/ShortLinkReduction', name: '短链还原' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
