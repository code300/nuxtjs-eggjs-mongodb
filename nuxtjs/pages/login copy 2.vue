<template>
  <div class="login">
    <div class="form-box">
      <el-form
        class="login-form"
        label-width="auto"
      >
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login'
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  position: fixed;
  /* background-color: coral; */
  background: url('../static/login.jpeg');
  background-size: cover;
}
.form-box {
  position: absolute;
  width: 360px;
  height: 126px;
  padding: 22px 22px 0 22px;
  background-color: coral;
  border-radius: 5px;
  left: calc(50% - 180px);
  top: calc(50% - 63px);
}
</style>
