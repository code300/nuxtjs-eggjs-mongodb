<template>
	<div class="register bg-image">
		<div class="mask" />
		<div class="form-box">
			<el-form
				ref="registerForm"
				class="register-form"
				label-width="80px"
				:model="form"
				:rules="rules"
			>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" placeholder="请输入昵称" />
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱" />
				</el-form-item>

				<el-form-item
					label="验证码"
					prop="emailcode"
					class="emailcode-container"
				>
					<el-input v-model="form.emailcode" placeholder="请输入邮箱验证码" />
					<el-button
						type="primary"
						:disabled="send.timer > 0"
						@click="sendEmailCode"
					>
						{{ sendText }}
					</el-button>
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input
						v-model="form.password"
						type="password"
						show-password
						placeholder="请输入密码"
					/>
				</el-form-item>

				<el-form-item label="确认密码" prop="repassword">
					<el-input
						v-model="form.repassword"
						type="password"
						show-password
						placeholder="请再次输入密码"
					/>
				</el-form-item>

				<el-form-item label="验证码" prop="captcha">
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
					<el-button type="primary" @click.native.prevent="handleRegister">
						注册
					</el-button>
					<el-button @click.native.prevent="handleLogin"> 登录 </el-button>
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
			send: {
				timer: 0
			},
			form: {
				nickname: 'code300',
				email: '750737873@qq.com',
				emailcode: '',
				captcha: '',
				password: '123456',
				repassword: '123456'
			},
			rules: {
				nickname: [{ required: true, message: '请输入昵称' }],
				email: [
					{ required: true, message: '请输入邮箱' },
					{ type: 'email', message: '请输入正确的邮箱格式' }
				],
				emailcode: [{ required: true, message: '请输入邮箱验证码' }],
				captcha: [{ required: true, message: '请输入验证码' }],
				password: [
					{ required: true, message: '请输入密码' },
					{ pattern: /^[\w_-]{6,12}$/g, message: '请输入6-12位密码' }
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
						}
					}
				]
			},
			captchaUrl: '/api/captcha'
		}
	},
	computed: {
		sendText() {
			if (this.send.timer <= 0) {
				return '发送'
			} else {
				return `${this.send.timer}s后发送`
			}
		}
	},
	methods: {
		sendEmailCode() {
			this.$http.get('/sendcode?email=' + this.form.email).then(
				(this.send.timer = 10),
				(this.timer = setInterval(() => {
					this.send.timer -= 1
					if (this.send.timer == 0) {
						clearInterval(this.timer)
					}
				}, 1000))
			)
		},
		handleRegister() {
			this.$refs.registerForm.validate(async valid => {
				console.log(valid, 'valid=true')
				if (valid) {
					console.log('校验成功')
					const formParams = {
						email: this.form.email,
						nickname: this.form.nickname,
						emailcode: this.form.emailcode,
						password: md5(this.form.password),
						captcha: this.form.captcha
					}
					// console.log(formParams, 'formParams')
					// @todo 发送请求
					// data = await...
					console.log(formParams, 'formParams')
					await this.$http
						.post('/user/register', formParams)
						.then(res => {
							if (res.data.code === 0) {
								this.$message.success('注册成功')
								setTimeout(() => {
									this.$router.push('/login')
								}, 500)

								// this.$alert('注册成功', '成功', {
								// 	confirmButtonText: '去登录',
								// 	callback: () => {
								// 		this.$router.push('/login')
								// 	}
								// })
							}
						})
						.catch(err => {
							this.$message.error(err)
						})
				} else {
					console.log('校验失败')
				}
			})
		},
		handleLogin() {
			this.$router.push('/login')
		},
		updateCaptcha() {
			this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
		}
	}
}
</script>

<style lang="scss" scoped>
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

.register {
	background: url('../static/register.jpeg');
	// background: url('../static/login.jpeg');
	.emailcode-container {
		.el-input {
			width: 190px;
		}
		.el-button {
			width: 85px;
			height: 40px;
			padding: 12px 10px;
		}
	}
}
</style>
