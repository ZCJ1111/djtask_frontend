<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="queryForm.query_date"
              :picker-options="pickerOptions"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="to"
              start-placeholder="Start Date"
              end-placeholder="End Date"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="getTaskLogList">Query</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="never">
        <template>
          <vxe-toolbar>
            <template v-slot:buttons>
              <vxe-button @click="openExportEvent">Export</vxe-button>
            </template>
          </vxe-toolbar>

          <vxe-table
            ref="xTable1"
            highlight-hover-row
            border="inner"
            height="650"
            :export-config="{}"
            :data="tableData"
          >
            <vxe-table-column field="record_time" title="Date" width="160" />
            <vxe-table-column field="task_title" title="Task_Title" min-width="160" />
            <vxe-table-column field="day" title="Period" width="60" />
            <vxe-table-column field="task_time_start" title="Start_Time" width="160" />
            <vxe-table-column field="task_time_end" title="Cutoff_Time" width="160" />
            <vxe-table-column field="task_group_name" title="Group" width="160" />
            <vxe-table-column field="task_desc" title="Task Description" min-width="160" />
            <vxe-table-column field="person_name" title="Assigned To" width="160" />
            <vxe-table-column field="creator_name" title="Creator" width="160" />
            <vxe-table-column field="created_at" title="Created Time" width="160" />
            <vxe-table-column field="completed_by_name" title="Submitter" width="160" />
            <vxe-table-column field="completed_time" title="Completed Time" width="160" />
            <vxe-table-column field="audit_by_name" title="Team Leader" width="160" />
            <vxe-table-column field="audit_time" title="Check Time" width="160" />
            <vxe-table-column field="back_by_name" title="R1.5 Reviewer" width="160" />
            <vxe-table-column field="back_time" title="R1.5 Review Time" width="160" />
            <vxe-table-column field="bz" title="Memo" min-width="160" />
            <vxe-table-column field="" title="Operation" width="220">
              <template #default="{ row }">
                <el-button
                  v-if="row.completed_time.length<=0"
                  v-show="$store.state.user.resource.task_succ"
                  size="mini"
                  @click="handleSucc(1, row)"
                >DONE
                </el-button>
                <el-button
                  v-if="row.completed_time && row.audit_time.length<=0"
                  v-show="$store.state.user.resource.task_audit"
                  size="mini"
                  @click="handleAdiut(1, row)"
                >TL_Check
                </el-button>
                <el-button
                  v-if="row.audit_time.length>0 && row.back_time.length<=0"
                  v-show="$store.state.user.resource.task_back"
                  size="mini"
                  @click="handleAdiut2(1, row)"
                >R1.5Check
                </el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </template>
        <!--        <el-pagination-->
        <!--          style="margin-top: 20px;"-->
        <!--          background-->
        <!--          layout="total, prev, pager, next "-->
        <!--          :total="queryForm.count"-->
        <!--          @current-change="changePage">-->
        <!--        </el-pagination>-->
      </el-card>
    </el-row>
  </div>
</template>

<script>

// import { auditTaskApi, auditTaskBjApi, getTaskRecordListApi, overTaskApi, overTaskBjApi } from '@/api/user'
// import fa from 'element-ui/src/locale/lang/fa'
import { auditTaskBjApi, getTaskRecordListApi, overTaskBjApi } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      showOverflow1: false,
      tableData: [],
      queryForm: {
        limit: 10,
        page: 1,
        query_date: []
      }
    }
  },
  mounted() {
  },
  methods: {
    pickerOptions: {
      disabledDate(time) {
        const today = new Date()
        // 如果选择的日期在今天之后，则禁用
        return time.getTime() > today.getTime()
      }
    },
    getTaskLogList() {
      getTaskRecordListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
      })
    },
    changePage(val) {
      this.queryForm.page = val
      this.getTaskLogList()
    },
    exportDataEvent() {
      this.$refs.xTable1.exportData({ type: 'csv' })
    },
    exportSelectEvent() {
      this.$refs.xTable1.exportData({
        data: this.$refs.xTable1.getCheckboxRecords()
      })
    },
    openExportEvent() {
      this.$refs.xTable1.openExport()
    },
    handleSucc(index, row) {
      this.$prompt('Memo', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /.+/,
        inputErrorMessage: 'Memo cannot be empty'
      }).then(({ value }) => {
        console.log(index, row)
        overTaskBjApi({ id: row.task_id, bj_dt: row.record_time, bz: value }).then(res => {
          this.$message({ type: 'success', message: res.message })
          this.getTaskLogList()
        })
      }).catch(() => {

      })
    },
    handleAdiut(index, row) {
      auditTaskBjApi({ record_id: row.record_id, status: 1 }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskLogList()
      })
    },
    handleAdiut2(index, row) {
      auditTaskBjApi({ record_id: row.record_id, status: 2 }).then(res => {
        this.$message({ type: 'success', message: res.message })
        this.getTaskLogList()
      })
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
