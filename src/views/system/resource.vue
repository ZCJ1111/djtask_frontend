<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true" />
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="never">
        <template>
          <el-table
            border
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              label="创建时间"
              prop="created_at"
              width="160"
            />
            <el-table-column
              label="资源名称"
              prop="name"
              width="120"
            />
            <el-table-column
              label="资源代号"
              prop="action"
              min-width="180"
            />
          </el-table>
        </template>
      </el-card>
    </el-row>
  </div>
</template>

<script>

// import {
//   addStaffApi, admin_del_user_api,
//   admin_save_user_api,
//   adminGetUserListApi,
//   adminResetPwdApi,
//   delStaffApi, getResourceListApi,
//   getStaffListApi
// } from '@/api/user'

import { getResourceListApi } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [
      ]
    }
  },
  mounted() {
    this.getResourceList()
  },
  methods: {
    getResourceList() {
      getResourceListApi().then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>
