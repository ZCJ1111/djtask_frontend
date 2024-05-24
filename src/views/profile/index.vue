<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10" :offset="6">
        <el-card shadow="never">
          <el-form label-width="140px" :model="userInfo">

            </el-form-item>
            <el-form-item label="用户名">
              <el-input disabled="true" v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userInfo.user_name"></el-input>
            </el-form-item>
            <el-form-item label="所属组">
              <el-input v-model="userInfo.task_group_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="userInfo.role_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="userInfo.sex" :label="1">男</el-radio>
              <el-radio v-model="userInfo.sex" :label="2">女</el-radio>
              <el-radio v-model="userInfo.sex" :label="3">未知</el-radio>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="userInfo.address"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" @click="saveBtn">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import {getUserApi, saveUserApi} from "@/api/user";

export default {
  name: 'Profile',
  data() {
    return {

      imageUrl: '',
      userInfo: {
        head: ''
      }
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.userInfo.head = res.data
    },
    handleSuccess(response, file, fieList) {
      this.userInfo.image = response.data
      this.imageUrl = URL.createObjectURL(file.raw);

    },
    saveBtn() {
      saveUserApi(this.userInfo).then(res => {
        this.$message({
          message: res.message
        })
      })
    },
    getUser() {
      getUserApi().then(res => {
        this.userInfo = res.data
        this.imageUrl = 'http://127.0.0.1:8000' + this.userInfo.image
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
