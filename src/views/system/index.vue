<template>
  <div class="app-container">
    <el-row>
      <el-card shadow="never">
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="Please enter search criteria">
            <el-input v-model="queryForm.name" />
          </el-form-item>
          <el-form-item>
            <el-button @click="queryBtn">Query</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="catVisible=true;addForm = {}">Add</el-button>
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
              label="Username"
              prop="name"
              width="180"
            />
            <el-table-column
              label="Name"
              prop="user_name"
              width="180"
            />
            <el-table-column
              label="Category"
              prop="power_name"
              width="100"
            />
            <el-table-column
              label="Group"
              prop="task_group_name"
              width="140"
            />
            <el-table-column
              label="Role"
              prop="role_name"
              width="140"
            />
            <el-table-column
              label="Gender"
              prop="sex_name"
              width="80"
            />

            <el-table-column
              prop="phone"
              label="Extension"
              width="140"
            />
            <el-table-column label="Operation" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEditV1(scope.$index, scope.row)"
                >Edit
                </el-button>
                <el-button
                  size="mini"
                  @click="delBtn(scope.$index, scope.row)"
                >Delete
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
          :total="queryForm.count"
          @current-change="changePage"
        />
      </el-card>
    </el-row>
    <el-dialog
      title="Edit"
      :visible.sync="catVisible"
      width="50%"
      :before-close="$handleClose"
    >
      <span>
        <el-form label-width="140px" :model="addForm">
          <el-form-item label="Username">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="addForm.user_name" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="addForm.password" type="password" />
          </el-form-item>
          <el-form-item label="Group">
            <el-select v-model="addForm.task_group" placeholder="Please Select">
              <el-option
                v-for="item in taskGroupOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Role">
            <el-select v-model="addForm.role" placeholder="Please Select">
              <el-option
                v-for="item in roleOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Gender">
            <el-radio v-model="addForm.sex" :label="1">Male</el-radio>
            <el-radio v-model="addForm.sex" :label="2">Female</el-radio>
            <el-radio v-model="addForm.sex" :label="3">Prefer not to say</el-radio>
          </el-form-item>
          <el-form-item label="User_Category">
            <el-radio v-model="addForm.power" :label="1">Staff</el-radio>
            <el-radio v-model="addForm.power" :label="3">Administrator</el-radio>
          </el-form-item>
          <el-form-item label="Extension">
            <el-input v-model="addForm.phone" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" @click="saveBtn">Save</el-button>
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
  getOverGroupListApi, getRoleListApi
} from '@/api/user'

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
      roleOpts: []
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
      getRoleListApi({ limit: 9999 }).then(res => {
        this.roleOpts = res.data.data
      })
    },
    saveBtn() {
      adminSaveUserApi(this.addForm).then(res => {
        this.$message({ message: res.message })
        if (res.code === 20000) {
          this.catVisible = false
          this.getStaffList()
        }
      })
    },
    delBtn(index, row) {
      admin_del_user_api({ id: row.id }).then(res => {
        this.$message({ message: res.message })
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
      adminResetPwdApi({ pk: row.id }).then(res => {
        if (res.code === 20000) {
          this.$alert('New Password' + res.data, 'Reset Password', {
            confirmButtonText: 'Confirm'
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
