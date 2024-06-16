<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true">
          <el-form-item>
            <el-button v-show="$store.state.user.resource.task_add" @click="addView=true">Add Task</el-button>
          </el-form-item>
          <el-form-item>
            <span shadow="never" style="color: red">
              Total：<span>{{ waitCount }}</span>
            </span>
          </el-form-item>
          <el-form-item>
            <span shadow="never" style="color: red">
              Incomplete:<span>{{ notCount }}</span>
            </span>
          </el-form-item>
          <el-form-item>
            <span shadow="never">
              Completed:<span>{{ overCount }}</span>
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

            :data="tableData"
            style="width: 100%"
          >
            <!--            <el-table-column-->
            <!--              label="创建人"-->
            <!--              prop="creator_name"-->
            <!--              min-width="140">-->
            <!--            </el-table-column>-->
            <el-table-column
              label="TaskTitle"
              prop="task_title"
              min-width="180"
            >
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
              label="Type"
              prop="day"
              width="60"
            />
            <el-table-column
              label="Cutoff Time"
              prop="task_time_end"
              width="120"
            />
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
              label="Status"
              width="80"
            >
              <template slot-scope="scope">
                <i v-if="scope.row.status" class="el-icon-success" style="color: #3a835d" />
                <i v-if="!scope.row.status" class="el-icon-error" style="color:red;" />
              </template>
            </el-table-column>
            <!--            <el-table-column-->
            <!--              prop="over_time"-->
            <!--              label="完成时间"-->
            <!--              width="120">-->
            <!--            </el-table-column>-->
            <el-table-column
              prop="over_person"
              label="Staff"
              width="120"
            />
            <el-table-column
              prop="audit_person"
              label="TL_Check"
              width="120"
            />
            <!--            <el-table-column-->
            <!--              prop="audit_tm"-->
            <!--              label="审核时间"-->
            <!--              width="120">-->
            <!--            </el-table-column>-->
            <el-table-column
              prop="back_person"
              label="R1.5_Check"
              width="120"
            />
            <!--            <el-table-column-->
            <!--              prop="back_tm"-->
            <!--              label="回溯时间"-->
            <!--              width="120">-->
            <!--            </el-table-column>-->
            <el-table-column label="Operation" width="160" fixed="right">
              <template slot-scope="scope" style="text-align: center">
                <el-button
                  v-show="$store.state.user.resource.task_del"
                  size="mini"
                  @click="handleDel(scope.$index, scope.row)"
                >DEL
                </el-button>
                <el-button
                  v-show="$store.state.user.resource.task_succ"
                  v-if="!scope.row.status & scope.row.person_name===$store.state.user.name"
                  size="mini"
                  @click="handleSucc(scope.$index, scope.row)"
                >DONE
                </el-button>
                <el-button
                  v-show="$store.state.user.resource.task_audit"
                  v-if="!scope.row.audit_person & scope.row.status"
                  size="mini"
                  @click="handleAdiut(scope.$index, scope.row)"
                >TL_Check
                </el-button>
                <el-button
                  v-show="$store.state.user.resource.task_back"
                  v-if="scope.row.audit_person.length>0 & scope.row.back_person.length===0 "
                  size="mini"
                  @click="handleAdiut2(scope.$index, scope.row)"
                >R1.5_Check
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
          @current-change="changePage"
        />
      </el-card>
    </el-row>

    <el-dialog
      title="Add Task"
      :visible.sync="addView"
      width="30%"
      :before-close="$handleClose"
    >
      <span>

        <el-form ref="addForm" :model="addForm" label-width="120px">
          <el-form-item label="Task Title">
            <el-input v-model="addForm.task_title" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input
              v-model="addForm.task_desc"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
          <el-form-item label="Type">
            <el-col :span="12"><el-input v-model="addForm.day" /></el-col>

          </el-form-item>
          <el-form-item label="Start Time">
            <el-time-picker
              v-model="addForm.task_time_start"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="Any Time"
            />
          </el-form-item>
          <el-form-item label="CutOff Time">
            <el-time-picker
              v-model="addForm.task_time_end"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="Any Time"
            />
          </el-form-item>
          <el-form-item label="Task Group">
            <el-select v-model="addForm.task_group" placeholder="Select" @change="getOverUserList">
              <el-option
                v-for="item in taskGroupOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Assign To">
            <el-select v-model="addForm.person" placeholder="Select">
              <el-option
                v-for="item in personOpts"
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
        <el-button type="primary" @click="saveBtn">Save</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Description"
      :visible.sync="taskDescView"
      width="30%"
      :before-close="$handleClose"
    >
      <span>
        <el-row>
          <el-input
            v-model="taskDesc"
            type="textarea"
            :rows="4"
            :disabled="true"
          />
        </el-row>

      </span>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>

// import {
//   addStaffApi, addTaskApi, admin_del_user_api,
//   admin_save_user_api,
//   adminGetUserListApi,
//   adminResetPwdApi, auditTaskApi,
//   delStaffApi, delTaskApi, getOverGroupListApi, getOverUserListApi,
//   getStaffListApi, getTaskListApi, overTaskApi
// } from '@/api/user'

import {
  addTaskApi, auditTaskApi,
  delTaskApi, getOverGroupListApi, getOverUserListApi, getTaskListApi, overTaskApi
} from '@/api/user'

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
      waitCount: 0,
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
      getOverUserListApi({ task_group_id: task_group_id }).then(res => {
        this.personOpts = res.data
        this.addForm.person = ''
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
        this.waitCount = this.tableData.length
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].back_person) {
            this.overCount += 1
          } else {
            this.notCount += 1
          }
        }
      })
    },
    saveBtn() {
      addTaskApi(this.addForm).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        if (res.code === 20000) {
          this.getTaskList()
          this.addView = false
        }
      })
    },
    handleDel(index, row) {
      delTaskApi({ id: row.id }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskList()
      })
    },
    handleSucc(index, row) {
      overTaskApi({ id: row.id }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskList()
      })
    },
    handleAdiut(index, row) {
      auditTaskApi({ id: row.id, status: 1 }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskList()
      })
    },
    handleAdiut2(index, row) {
      auditTaskApi({ id: row.id, status: 2 }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskList()
      })
    },
    tableRowClassName({ row, rowIndex }) {
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
  background: #D3D3D3;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
