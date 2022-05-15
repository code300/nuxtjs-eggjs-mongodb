<template>
  <div class="register bg-image">
    <div class="form-box">
      <el-form
        class="register-form"
        label-width="80px"
        :model="form"
        :rules="rules"
        ref="registerForm"
      >

        <el-form-item
          label="昵称"
          prop="nickname"
        >
          <el-input
            v-model="form.nickname"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            show-password
            v-model="form.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="repassword"
        >
          <el-input
            type="password"
            show-password
            v-model="form.repassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="captcha"
          class="captcha-container"
        >
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <div class="captcha">
          <img
            :src="captchaUrl ? captchaUrl : ''"
            @click="updateCaptcha"
            alt=""
          >
        </div>
        <div class="submit-item">
          <!-- <button @click.prevent="handleRegister">注册</button> -->
          <el-button
            type="primary"
            @click.native.prevent="handleRegister"
          >注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      form: {
        nickname: 'code300',
        email: '750737873@qq.com',
        captcha: '',
        password: '123456',
        repassword: '123456',
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称' }],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' },
        ],
        captcha: [{ required: true, message: '请输入验证码' }],
        password: [
          { required: true, message: '请输入密码' },
          { pattern: /^[\w_-]{6,12}$/g, message: '请输入6-12位密码' },
        ],
        repassword: [
          { required: true, message: '请再次输入密码' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次密码不一致'))
              } else {
                // 必须要写callback,不然不执行this.$refs.registerForm.validate(）
                callback()
              }
            },
          },
        ],
      },
      captchaUrl: '/api/captcha',
    }
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        console.log(valid, 'valid=true')
        if (valid) {
          console.log('校验成功')
          let formParams = {
            email: this.form.email,
            nickname: this.form.nickname,
            password: md5(this.form.password),
            captcha: this.form.captcha,
          }
          // console.log(formParams, 'formParams')
          // @todo 发送请求
          // data = await...
          console.log(formParams, 'formParams')
          await this.$http
            .post('/user/register', formParams)
            .then((res) => {
              // res.code == 0 注册成功
              if (res.data.code == 0) {
                this.$alert('注册成功', '成功', {
                  confirmButtonText: '去登录',
                  callback: () => {
                    this.$router.push('/login')
                  },
                })
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        } else {
          console.log('校验失败')
        }
      })
    },
    updateCaptcha() {
      this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
    },
  },
}
</script>

<style>
/* .login {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('../static/bg.jpeg');
  background-size: cover;
}
.form-box {
  position: absolute;
  width: 360px;
  padding: 22px 22px 0 22px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ddd;
  border-radius: 5px;
} */

.bg-image {
  background: url('../static/register.jpeg');
}
.captcha {
  width: 280px;
  height: 40px;
  margin-bottom: 22px;
  display: flex;
  margin-left: 80px;
}
</style>
