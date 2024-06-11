import request from '@/utils/request'

export function reg_user(data) {
  return request({
    url: '/user/user_reg/',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/user_login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/get_user_info/',
    method: 'get',
    params: { token }
  })
}

export function getUserApi() {
  return request({
    url: '/user/get_user/',
    method: 'get'
  })
}

export function adminGetUserListApi(params) {
  return request({
    url: '/user/get_user_list/',
    method: 'get',
    params: params
  })
}
export function getResourceListApi(params) {
  return request({
    url: '/user/get_resource_list/',
    method: 'get',
    params: params
  })
}

export function adminResetPwdApi(data) {
  return request({
    url: '/user/admin_reset_pwd/',
    method: 'post',
    data
  })
}

export function saveUserApi(data) {
  return request({
    url: '/user/save_user/',
    method: 'post',
    data
  })
}
export function adminSaveUserApi(data) {
  return request({
    url: '/user/admin_save_user/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout/',
    method: 'post'
  })
}

export function adminAddGroupApi(data) {
  return request({
    url: '/user/admin_add_group/',
    method: 'post',
    data
  })
}

export function adminDelGroupApi(data) {
  return request({
    url: '/user/admin_del_group/',
    method: 'post',
    data
  })
}

export function getGroupListApi(data) {
  return request({
    url: '/user/get_group_list/',
    method: 'get',
    params: data
  })
}

export function getOverGroupListApi(data) {
  return request({
    url: '/user/get_over_group_list/',
    method: 'get',
    params: data
  })
}

export function adminAddRoleApi(data) {
  return request({
    url: '/user/admin_add_role/',
    method: 'post',
    data
  })
}

export function adminDelRoleApi(data) {
  return request({
    url: '/user/admin_del_cole/',
    method: 'post',
    data
  })
}

export function getRoleListApi(data) {
  return request({
    url: '/user/get_role_list/',
    method: 'get',
    params: data
  })
}

export function getOverUserListApi(data) {
  return request({
    url: '/user/get_over_user_list/',
    method: 'get',
    params: data
  })
}

export function getTaskListApi(data) {
  return request({
    url: '/task/get_task_list/',
    method: 'get',
    params: data
  })
}

export function addTaskApi(data) {
  return request({
    url: '/task/add_task/',
    method: 'post',
    data
  })
}

export function admin_del_user_api(data) {
  return request({
    url: '/user/admin_del_user/',
    method: 'post',
    data
  })
}

export function overTaskApi(data) {
  return request({
    url: '/task/over_task/',
    method: 'post',
    data
  })
}
export function overTaskBjApi(data) {
  return request({
    url: '/task/over_task_bj/',
    method: 'post',
    data
  })
}
export function delTaskApi(data) {
  return request({
    url: '/task/del_task/',
    method: 'post',
    data
  })
}

export function auditTaskApi(data) {
  return request({
    url: '/task/audit_task/',
    method: 'post',
    data
  })
}

export function auditTaskBjApi(data) {
  return request({
    url: '/task/audit_task_bj/',
    method: 'post',
    data
  })
}

export function getTaskLogListApi(data) {
  return request({
    url: '/task/get_task_log_list/',
    method: 'get',
    params: data
  })
}

export function getTaskRecordListApi(data) {
  return request({
    url: '/task/get_task_record_list/',
    method: 'get',
    params: data
  })
}
