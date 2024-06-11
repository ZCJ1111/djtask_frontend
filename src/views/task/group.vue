<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true">
          <el-form-item>
            <el-button v-show="$store.state.user.resource.task_group_add" @click="addView=true">添加</el-button>
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
              label="创建时间"
              prop="created_at"
              min-width="140"
            />
            <el-table-column
              label="组名称"
              prop="name"
              min-width="180"
            />
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-show="$store.state.user.resource.task_group_edit"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑
                </el-button>
                <el-button
                  v-show="$store.state.user.resource.task_group_del"
                  size="mini"
                  @click="handleDel(scope.row)"
                >删除
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
      title="添加/编辑"
      :visible.sync="addView"
      width="50%"
      :before-close="$handleClose"
    >
      <span>
        <el-form ref="addForm" :model="addForm">
          <el-form-item label="组名称">
            <el-input v-model="addForm.name" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addView = false">取 消</el-button>
        <el-button type="primary" @click="addBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// import {
//   addStaffApi, admin_del_user_api,
//   admin_save_user_api, adminAddGroupApi, adminDelGroupApi,
//   adminGetUserListApi,
//   adminResetPwdApi,
//   delStaffApi, getGroupListApi,
//   getStaffListApi
// } from '@/api/user'

import { adminAddGroupApi, adminDelGroupApi, getGroupListApi } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      addView: false,
      addForm: {},
      queryForm: {
        page: 1,
        limit: 10
      },
      tableData: []
    }
  },
  mounted() {
    this.getGroupList()
  },
  methods: {
    changePage(val) {
      this.queryForm.page = val
      this.getGroupList()
    },
    getGroupList() {
      getGroupListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
      })
      this.addForm = {}
    },
    addBtn() {
      adminAddGroupApi(this.addForm).then(res => {
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
      console.log('1111')
      this.addForm = row
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adminDelGroupApi(this.addForm).then(res => {
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
