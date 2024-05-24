import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/task/task',
    hidden: true,
    children: [
      {
        path: 'task',
        component: () => import('@/views/task/task'),
        name: 'task',
        meta: {title: '任务列表', icon: 'icon', noCache: true}
      },
      // {
      //   path: 'dashboard',
      //   component: () => import('@/views/dashboard/index'),
      //   name: 'Dashboard',
      //   meta: {title: 'dashboard', icon: 'dashboard', affix: true}
      // }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {title: 'profile', icon: 'user', noCache: true}
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/task',
    component: Layout,
    redirect: '/task/task',
    meta: {roles: ['admin', 'user'], title: '任务管理', icon: 'icon',},
    children: [
      {
        path: 'task',
        component: () => import('@/views/task/task'),
        name: 'task',
        meta: {title: '任务列表', icon: 'icon', noCache: true}
      },
      {
        path: 'task-record',
        component: () => import('@/views/task/task-record'),
        name: 'task-record',
        meta: {title: '任务记录', icon: 'icon', noCache: true}
      },
      {
        path: 'task-log',
        component: () => import('@/views/task/task-log'),
        name: 'task-log',
        meta: {title: '任务日志', icon: 'icon', noCache: true}
      },
      {
        path: 'group',
        component: () => import('@/views/task/group'),
        name: 'group',
        meta: {title: '任务组管理', icon: 'icon', noCache: true, roles: ['admin']}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {roles: ['admin'], title: '系统管理', icon: 'icon',},
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/index'),
        name: 'user',
        meta: {title: '用户管理', icon: 'icon', noCache: true}
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: {title: '角色管理', icon: 'icon', noCache: true}
      },
      {
        path: 'resource',
        component: () => import('@/views/system/resource'),
        name: 'resource',
        meta: {title: '资源管理', icon: 'icon', noCache: true}
      },
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
