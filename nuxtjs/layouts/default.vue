<template>
	<el-container>
		<el-header>
			<el-menu
				class="el-menu-demo"
				mode="horizontal"
				background-color="#FF7D24"
				text-color="#fff"
				active-text-color="#FF571B"
				:default-active="'1'"
			>
				<el-menu-item index="0">
					<div class="logo">
						<img class="logo" src="../static/icon-logo.png" alt="" />
					</div>
				</el-menu-item>

				<el-menu-item index="1">
					<nuxt-link to="/"> 首页 </nuxt-link>
				</el-menu-item>

				<el-menu-item v-if="userinfo.id" index="2">
					<nuxt-link to="/editor/new"> 写文章 </nuxt-link>
				</el-menu-item>

				<el-menu-item v-if="userinfo.id" index="3">
					<nuxt-link to="/upload"> 上传 </nuxt-link>
				</el-menu-item>

				<el-menu-item v-if="userinfo.id" index="4" class="pull-right">
					<a @click="logout">退出</a>
				</el-menu-item>

				<el-menu-item v-if="userinfo.id" index="5" class="pull-right">
					<UserDisplay :user="userinfo" />
				</el-menu-item>

				<el-menu-item v-if="!userinfo.id" index="2" class="pull-right">
					<nuxt-link to="/register"> 注册 </nuxt-link>
				</el-menu-item>

				<el-menu-item v-if="!userinfo.id" index="3" class="pull-right">
					<nuxt-link to="/login"> 登录 </nuxt-link>
				</el-menu-item>
			</el-menu>
		</el-header>

		<el-main>
			<nuxt />
		</el-main>

		<!-- <el-footer> 底部信息 </el-footer> -->
	</el-container>
</template>
<script>
import UserDisplay from '~/components/UserDisplay.vue'
export default {
	components: { UserDisplay },
	computed: {
		userinfo() {
			return this.$store.state.user
		}
	},
	mounted() {
		this.getUserInfo()
	},
	methods: {
		logout() {
			localStorage.removeItem('KKB_USER_TOKEN')
			this.$store.commit('user/LOGOUT')
		},
		getUserInfo() {
			// 获取用户个人信息，如果有登录状态
			const token = localStorage.getItem('KKB_USER_TOKEN')
			if (token) {
				console.log(token, 'token')
				this.$store.dispatch('user/detail')
			}
		}
	}
}
</script>
<style lang="scss" scoped>
html {
	font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
		Roboto, 'Helvetica Neue', Arial, sans-serif;
	font-size: 16px;
	word-spacing: 1px;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	box-sizing: border-box;
	background: #eee;
}
.el-container {
	::v-deep .el-header {
		background-color: #ff7d24;
		.el-menu-item {
			.logo {
				line-height: 60px;
				height: 60px;
				img {
					height: 40px;
				}
			}
		}
	}
	.el-main {
		background-color: #eee;
		height: calc(100vh - 62px);
		overflow: auto;
	}
}

.pull-right {
	float: right !important;
}
*,
*:before,
*:after {
	// box-sizing: border-box;
	margin: 0;
}

a {
	text-decoration: none;
}
.el-menu--horizontal > .el-menu-item.is-active {
	border: none;
}
</style>
