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
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="getTaskLogList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="never">
        <template>
          <vxe-toolbar>
            <template v-slot:buttons>
              <vxe-button @click="openExportEvent">高级导出</vxe-button>
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
            <vxe-table-column field="record_time" title="日期" width="160" />
            <vxe-table-column field="task_title" title="任务名称" min-width="160" />
            <vxe-table-column field="day" title="每X日" width="60" />
            <vxe-table-column field="task_time_start" title="开始时间" width="160" />
            <vxe-table-column field="task_time_end" title="截止时间" width="160" />
            <vxe-table-column field="task_group_name" title="所属组" width="160" />
            <vxe-table-column field="task_desc" title="任务详情" min-width="160" />
            <vxe-table-column field="person_name" title="所属人" width="160" />
            <vxe-table-column field="creator_name" title="创建人" width="160" />
            <vxe-table-column field="created_at" title="创建时间" width="160" />
            <vxe-table-column field="completed_by_name" title="完成人" width="160" />
            <vxe-table-column field="completed_time" title="完成时间" width="160" />
            <vxe-table-column field="audit_by_name" title="审核人" width="160" />
            <vxe-table-column field="audit_time" title="审核时间" width="160" />
            <vxe-table-column field="back_by_name" title="回溯人" width="160" />
            <vxe-table-column field="back_time" title="回溯时间" width="160" />
            <vxe-table-column field="bz" title="补交备注" min-width="160" />
            <vxe-table-column field="" title="操作" width="220">
              <template #default="{ row }">
                <el-button
                  v-if="row.completed_time.length<=0"
                  v-show="$store.state.user.resource.task_succ"
                  size="mini"
                  @click="handleSucc(1, row)"
                >完成
                </el-button>
                <el-button
                  v-if="row.completed_time && row.audit_time.length<=0"
                  v-show="$store.state.user.resource.task_audit"
                  size="mini"
                  @click="handleAdiut(1, row)"
                >审核
                </el-button>
                <el-button
                  v-if="row.audit_time.length>0 && row.back_time.length<=0"
                  v-show="$store.state.user.resource.task_back"
                  size="mini"
                  @click="handleAdiut2(1, row)"
                >回溯
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
      this.$prompt('备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '备注不能为空'
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
