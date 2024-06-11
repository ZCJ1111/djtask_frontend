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
              label="Created Time"
              prop="created_at"
              width="160"
            />
            <el-table-column
              label="Permission"
              prop="name"
              width="120"
            />
            <el-table-column
              label="Function"
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
