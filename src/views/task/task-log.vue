<template>
  <div class="app-container">
    <el-row />
    <el-row>
      <el-card shadow="never">
        <template>
          <el-table
            :row-class-name="tableRowClassName"
            border
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              label="Operator"
              prop="person_name"
              min-width="140"
            />
            <el-table-column
              label="Operation Time"
              prop="created_at"
              width="180"
            />
            <el-table-column
              label="Action"
              prop="action"
              width="120"
            />
            <el-table-column
              prop="content"
              label="Content"
              min-width="480"
            />
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
  </div>
</template>

<script>

import { getTaskLogListApi } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [],
      queryForm: {
        limit: 10,
        page: 1
      }
    }
  },
  mounted() {
    this.getTaskLogList()
  },
  methods: {
    getTaskLogList() {
      getTaskLogListApi(this.queryForm).then(res => {
        this.tableData = res.data.data
        this.queryForm.count = res.data.count
      })
    },
    changePage(val) {
      this.queryForm.page = val
      this.getTaskLogList()
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
