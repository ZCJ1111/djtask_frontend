<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true">
          <el-form-item>
            <el-button @click="addView=true" v-show="$store.state.user.resource.task_add">添加</el-button>
          </el-form-item>
          <el-form-item>
            <span shadow="never" style="color: red">
                未完成：<span>{{ notCount }}</span>
            </span>
          </el-form-item>
          <el-form-item>
            <span shadow="never">
                已完成：<span>{{ overCount }}</span>
            </span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="never">
        <template>
          <el-table
            :row-class-name="tableRowClassName"
            border
            :data="tableData"
            style="width: 100%">
<!--            <el-table-column-->
<!--              label="创建人"-->
<!--              prop="creator_name"-->
<!--              min-width="140">-->
<!--            </el-table-column>-->
            <el-table-column
              label="任务名称"
              prop="task_title"
              min-width="180">
              <template slot-scope="scope">
                <a href="javascript:;" @click="showDesc(scope.row)">{{ scope.row.task_title }}</a>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              label="开始时间"-->
<!--              prop="task_time_start"-->
<!--              width="120">-->
<!--            </el-table-column>-->
            <el-table-column
              label="每X日"
              prop="day"
              width="60">
            </el-table-column>
            <el-table-column
              label="截止时间"
              prop="task_time_end"
              width="120">
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="task_group_name"-->
<!--              label="所属组"-->
<!--              width="120">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="person_name"-->
<!--              label="所属人"-->
<!--              width="140">-->
<!--            </el-table-column>-->
            <el-table-column
              prop="status"
              label="完成状态"
              width="80">
              <template slot-scope="scope">
                <i class="el-icon-success" style="color: #3a835d" v-if="scope.row.status"></i>
                <i class="el-icon-error" style="color:red;" v-if="!scope.row.status"></i>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="over_time"-->
<!--              label="完成时间"-->
<!--              width="120">-->
<!--            </el-table-column>-->
            <el-table-column
              prop="over_person"
              label="完成人"
              width="120">
            </el-table-column>
            <el-table-column
              prop="audit_person"
              label="审核人"
              width="120">
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="audit_tm"-->
<!--              label="审核时间"-->
<!--              width="120">-->
<!--            </el-table-column>-->
            <el-table-column
              prop="back_person"
              label="回溯人"
              width="120">
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="back_tm"-->
<!--              label="回溯时间"-->
<!--              width="120">-->
<!--            </el-table-column>-->
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope" style="text-align: center">
                <el-button
                  size="mini"
                  v-show="$store.state.user.resource.task_del"
                  @click="handleDel(scope.$index, scope.row)">删除
                </el-button>
                <el-button
                  size="mini"
                  v-show="$store.state.user.resource.task_succ"
                  v-if="!scope.row.status & scope.row.person_name===$store.state.user.name"
                  @click="handleSucc(scope.$index, scope.row)">完成
                </el-button>
                <el-button
                  size="mini"
                  v-show="$store.state.user.resource.task_audit"
                  v-if="!scope.row.audit_person & scope.row.status"
                  @click="handleAdiut(scope.$index, scope.row)">审核
                </el-button>
                <el-button
                  size="mini"
                  v-show="$store.state.user.resource.task_back"
                  v-if="scope.row.audit_person.length>0 & scope.row.back_person.length===0 "
                  @click="handleAdiut2(scope.$index, scope.row)">回溯
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          style="margin-top: 20px;"
          background
          layout="total, prev, pager, next "
          :total="queryForm.count"
          @current-change="changePage">
        </el-pagination>
      </el-card>
    </el-row>

    <el-dialog
      title="添加/编辑任务"
      :visible.sync="addView"
      width="30%"
      :before-close="$handleClose">
      <span>

        <el-form :model="addForm" ref="addForm" label-width="120px">
          <el-form-item label="任务名称">
            <el-input v-model="addForm.task_title"></el-input>
          </el-form-item>
          <el-form-item label="任务详情">
            <el-input v-model="addForm.task_desc"
                      type="textarea"
                      :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="每X天">
            <el-col :span="12"><el-input v-model="addForm.day"></el-input></el-col>

          </el-form-item>
          <el-form-item label="开始时间">
            <el-time-picker
              v-model="addForm.task_time_start"
              value-format="HH:mm:ss"
              :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
              placeholder="任意时间点">
  </el-time-picker>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-time-picker
              v-model="addForm.task_time_end"
              value-format="HH:mm:ss"
              :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
              placeholder="任意时间点">
  </el-time-picker>
          </el-form-item>
          <el-form-item label="所属组">
                <el-select v-model="addForm.task_group" placeholder="请选择" @change="getOverUserList">
        <el-option
          v-for="item in taskGroupOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
          </el-form-item>
          <el-form-item label="所属人">
            <el-select v-model="addForm.person" placeholder="请选择">
        <el-option
          v-for="item in personOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addView = false">取 消</el-button>
    <el-button type="primary" @click="saveBtn">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="任务详情"
      :visible.sync="taskDescView"
      width="30%"
      :before-close="$handleClose">
  <span>
    <el-row>
      <el-input v-model="taskDesc"
                type="textarea"
                :rows="4" :disabled="true"></el-input>
    </el-row>

  </span>
      <span slot="footer" class="dialog-footer">

  </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  addStaffApi, addTaskApi, admin_del_user_api,
  admin_save_user_api,
  adminGetUserListApi,
  adminResetPwdApi, auditTaskApi,
  delStaffApi, delTaskApi, getOverGroupListApi, getOverUserListApi,
  getStaffListApi, getTaskListApi, overTaskApi
} from "@/api/user";

export default {
  name: 'Dashboard',
  data() {
    return {
      taskDescView: false,
      addView: false,
      queryForm: {
        limit: 10,
        page: 1
      },
      addForm: {
        person: '',
        day: 1
      },
      tableData: [],
      taskGroupOpts: [],
      personOpts: [],
      taskDesc: '',
      overCount: 0,
      notCount: 0
    }
  },
  mounted() {
    this.getGroupList()
    this.getTaskList()
  },
  methods: {
    showDesc(row) {
      this.taskDesc = row.task_desc
      this.taskDescView = true
    },
    changePage(val) {
      this.queryForm.page = val
      this.getTaskList()
    },
    getOverUserList(task_group_id) {
      getOverUserListApi({task_group_id: task_group_id}).then(res => {
        this.personOpts = res.data
        this.addForm.person = ""
      })
    },

    getGroupList() {
      getOverGroupListApi().then(res => {
        this.taskGroupOpts = res.data
      })
    },
    getTaskList() {
      getTaskListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
        this.overCount = 0
        this.notCount = 0
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].status){
            this.overCount += 1
          }else{
            this.notCount += 1
          }
        }
      })
    },
    saveBtn() {
      addTaskApi(this.addForm).then(res => {
        this.$message({
          type: "success",
          message: res.message
        })
        if (res.code === 20000) {
          this.getTaskList()
          this.addView = false
        }
      })
    },
    handleDel(index, row) {
      delTaskApi({id: row.id}).then(res => {
        this.$message({type: "success", message: res.message})
        this.getTaskList()
      })
    },
    handleSucc(index, row) {
      overTaskApi({id: row.id}).then(res => {
        this.$message({type: "success", message: res.message})
        this.getTaskList()
      })

    },
    handleAdiut(index, row) {
      auditTaskApi({id: row.id, status: 1}).then(res => {
        this.$message({type: "success", message: res.message})
        this.getTaskList()
      })
    },
    handleAdiut2(index, row) {
      auditTaskApi({id: row.id, status: 2}).then(res => {
        this.$message({type: "success", message: res.message})
        this.getTaskList()
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status === false) {
        return 'warning-row'
      } else if (row.status === true) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: #f3ff4c;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
