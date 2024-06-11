<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true">
          <el-form-item>
            <el-button @click="addView=true">ADD</el-button>
          </el-form-item>
        </el-form>
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
              min-width="140"
            />
            <el-table-column
              label="Role Name"
              prop="name"
              min-width="180"
            />
            <el-table-column
              label="Permission"
              prop="resource_name"
              min-width="180"
            />
            <el-table-column label="Operation" width="160" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >Edit
                </el-button>
                <el-button
                  size="mini"
                  @click="handleDel(scope.row)"
                >Del
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          style="margin-top: 20px;"
          background
          layout="prev, pager, next"
          :total="queryForm.count"
          @current-change="changePage"
        />
      </el-card>
    </el-row>
    <el-dialog
      title="Add/Edit"
      :visible.sync="addView"
      width="50%"
      :before-close="$handleClose"
    >
      <span>
        <el-form ref="addForm" :model="addForm">
          <el-form-item label="Role Name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="Role Permission">
            <el-select v-model="addForm.resource" multiple placeholder="Please Select">
              <el-option
                v-for="item in resourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addView = false">Cancel</el-button>
        <el-button type="primary" @click="addBtn()">Yes</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// import {
//   addStaffApi, admin_del_user_api,
//   admin_save_user_api, adminAddGroupApi, adminAddRoleApi, adminDelGroupApi, adminDelRoleApi,
//   adminGetUserListApi,
//   adminResetPwdApi,
//   delStaffApi, getGroupListApi, getResourceListApi, getRoleListApi,
//   getStaffListApi
// } from '@/api/user'

import {
  adminAddRoleApi, adminDelRoleApi, getResourceListApi, getRoleListApi
} from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      addView: false,
      addForm: {
        name: '',
        resource: []
      },
      queryForm: {
        page: 1,
        limit: 10
      },
      tableData: [],
      resourceList: []
    }
  },
  mounted() {
    this.getGroupList()
    this.getResourceList()
  },
  methods: {
    getResourceList() {
      getResourceListApi().then(res => {
        this.resourceList = res.data
      })
    },
    changePage(val) {
      this.queryForm.page = val
      this.getGroupList()
    },
    getGroupList() {
      getRoleListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
      })
      this.addForm = {}
    },
    addBtn() {
      adminAddRoleApi(this.addForm).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.addView = false
        this.getGroupList()
      })
    },
    handleEdit(index, row) {
      this.addForm = row
      this.addView = true
    },
    handleDel(row) {
      this.addForm = row
      this.$confirm('Do you want to continue?', '提示', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        adminDelRoleApi(this.addForm).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getGroupList()
        })
      }).catch(() => {

      })
    }

  }
}
</script>
