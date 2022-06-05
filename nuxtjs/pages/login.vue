<template>
	<div class="login bg-image">
		<div class="mask" />
		<div class="form-box">
			<el-form
				ref="loginForm"
				class="login-form"
				label-width="80px"
				:model="form"
				:rules="rules"
			>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱" />
				</el-form-item>
				<el-form-item label="密码:" prop="password">
					<el-input
						v-model="form.password"
						placeholder="请输入密码"
						show-password
					/>
				</el-form-item>
				<el-form-item label="验证码:" prop="captcha">
					<el-input v-model="form.captcha" placeholder="请输入验证码" />
				</el-form-item>
				<div class="captcha">
					<img
						:src="captchaUrl ? captchaUrl : ''"
						alt=""
						@click="updateCaptcha"
					/>
				</div>

				<el-form-item>
					<el-button type="primary" @click.native.prevent="handleLogin">
						登录
					</el-button>
					<el-button @click.native.prevent="handleRegister"> 注册 </el-button>
				</el-form-item>
				<!-- <div class="submit-item"></div> -->
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
				email: '750737873@qq.com',
				captcha: '',
				password: '123456'
			},
			rules: {
				email: [
					{ required: true, message: '请输入邮箱' },
					{ type: 'email', message: '请输入正确的邮箱格式' }
				],
				captcha: [{ required: true, message: '请输入验证码' }],
				password: [
					{ required: true, message: '请输入密码' },
					{ pattern: /^[\w_-]{6,12}$/g, message: '请输入6-12位密码' }
				]
			},
			captchaUrl: '/api/captcha'
		}
	},
	methods: {
		updateCaptcha() {
			this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
		},
		handleLogin() {
			this.$refs.loginForm.validate(async valid => {
				if (valid) {
					const formParams = {
						email: this.form.email,
						password: md5(this.form.password),
						captcha: this.form.captcha
					}
					// @todo 发送请求
					// data = await...
					console.log(formParams, 'formParams')
					await this.$http.post('/user/login', formParams).then(res => {
						console.log(res, '999')
						// res.code == 0 登录成功
						if (res.code == 0) {
							// 登录成功返回token
							this.$message.success('登录成功')
							localStorage.setItem('KKB_USER_TOKEN', res.data.token)
							setTimeout(() => {
								this.$router.push('/')
							}, 500)
						} else {
							this.$message.error(res.message)
						}
					})
					// .catch((err) => {
					//   this.$message.error(err)
					// })
				} else {
					console.log('校验失败')
				}
			})
		},
		handleRegister() {
			this.$router.push('/register')
		}
	}
}
</script>

<style lang="scss">
/* login背景图 */
/* form的父元素 */
/* form表单 */
/* .login {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('../static/bg.jpeg');
  background-size: cover;
}

.form-box {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.login-form {
  background-color: #ddd;
  width: 360px;
  padding: 22px 22px 0 22px;
  border-radius: 5px;
} */

.login {
	background: url('../static/login.jpeg');
}
</style>
