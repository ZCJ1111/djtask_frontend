<template>
  <div class="app-container">
    <el-row>
      <el-card shadow="never">
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="请输入查询条件">
            <el-input v-model="queryForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="queryBtn">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="catVisible=true;addForm = {}">添加</el-button>
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
            style="width: 100%">
            <el-table-column
              label="用户名"
              prop="name"
              width="180">
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="user_name"
              width="180">
            </el-table-column>
            <el-table-column
              label="用户类别"
              prop="power_name"
              width="100">
            </el-table-column>
            <el-table-column
              label="所属任务组"
              prop="task_group_name"
              width="140">
            </el-table-column>
            <el-table-column
              label="角色"
              prop="role_name"
              width="140">
            </el-table-column>
            <el-table-column
              label="性别"
              prop="sex_name"
              width="80">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              min-width="160">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              width="140">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEditV1(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  @click="delBtn(scope.$index, scope.row)">删除
                </el-button>
                <!--                <el-button-->
                <!--                  v-if="false"-->
                <!--                    size="mini"-->
                <!--                    @click="handleCan(scope.$index, scope.row)">查看-->
                <!--                </el-button>-->
                <!--                <el-button-->
                <!--                    size="mini"-->
                <!--                    @click="handleEdit(scope.$index, scope.row)">重置密码-->
                <!--                </el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          style="margin-top: 20px;"
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :total="queryForm.count">
        </el-pagination>
      </el-card>
    </el-row>
    <el-dialog
      title="编辑"
      :visible.sync="catVisible"
      width="50%"
      :before-close="$handleClose">
      <span>
        <el-form label-width="140px" :model="addForm">
        <el-form-item label="用户名">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
          <el-form-item label="姓名">
          <el-input v-model="addForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="所属任务组">
          <el-select v-model="addForm.task_group" placeholder="请选择">
    <el-option
      v-for="item in taskGroupOpts"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择">
    <el-option
      v-for="item in roleOpts"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio v-model="addForm.sex" :label="1">男</el-radio>
  <el-radio v-model="addForm.sex" :label="2">女</el-radio>
  <el-radio v-model="addForm.sex" :label="3">未知</el-radio>
        </el-form-item>
        <el-form-item label="用户类别">
            <el-radio v-model="addForm.power" :label="1">普通用户</el-radio>
  <el-radio v-model="addForm.power" :label="3">管理员</el-radio>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%;" @click="saveBtn">保存</el-button>
        </el-form-item>
      </el-form>
  </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  admin_del_user_api,
  adminGetUserListApi,
  adminResetPwdApi, adminSaveUserApi,
   getOverGroupListApi, getRoleListApi,
} from "@/api/user";

export default {
  name: 'Dashboard',
  data() {
    return {
      imageUrl: '',
      addVisible: false,
      catVisible: false,
      addForm: {},
      queryForm: {
        name: '',
        count: 0,
        page: 1
      },
      tableData: [],
      taskGroupOpts: [],
      roleOpts: [],
    }
  },
  mounted() {
    this.getStaffList()
    this.getGroupList()
    this.getRoleList()
  },
  methods: {
    getGroupList() {
      getOverGroupListApi().then(res => {
        this.taskGroupOpts = res.data
      })
    },
    getRoleList() {
      getRoleListApi({limit: 9999}).then(res => {
        this.roleOpts = res.data.data
      })
    },
    saveBtn() {

      adminSaveUserApi(this.addForm).then(res => {
        this.$message({message: res.message})
        if (res.code === 20000) {
          this.catVisible = false
          this.getStaffList()
        }
      })
    },
    delBtn(index, row) {
      admin_del_user_api({id: row.id}).then(res => {
        this.$message({message: res.message})
        if (res.code === 20000) {
          this.getStaffList()
        }
      })
    },
    handleSuccess(response, file, fieList) {
      this.addForm.image = response.data
      this.imageUrl = URL.createObjectURL(file.raw)

    },
    handleEdit(index, row) {
      adminResetPwdApi({pk: row.id}).then(res => {
        if (res.code === 20000) {
          this.$alert('新密码：' + res.data, '重置密码', {
            confirmButtonText: '确定',
          })
        }
      })
    },
    handleCan(index, row) {
      this.addForm = row
      this.catVisible = true
      this.imageUrl = 'http://127.0.0.1:8000' + row.image
    },
    handleEditV1(index, row) {
      this.addForm = row
      this.catVisible = true
      this.imageUrl = 'http://127.0.0.1:8000' + row.image
    },
    changePage(val) {
      this.queryForm.page = val
      this.getStaffList()
    },
    queryBtn() {
      this.getStaffList()
    },
    getStaffList() {
      adminGetUserListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
      })
    }
  }
}
</script>
