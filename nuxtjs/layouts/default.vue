<template>
	<div>
		<el-container>
			<el-header>
				<el-menu mode="horizontal">
					<el-menu-item index="0">
						<img src="../static/icon-logo.png" alt="" />
					</el-menu-item>
					<el-menu-item>
						<nuxt-link to="/"></nuxt-link>
					</el-menu-item>
					<el-menu-item v-if="userInfo.id">
						<a>退出</a>
					</el-menu-item>
					<el-menu-item v-if="userInfo.id">
						<a>{{ userInfo.nickname }}</a>
					</el-menu-item>

					<el-menu-item v-if="userInfo.id">
						<nuxt-link to="/editor/new">写文章</nuxt-link>
					</el-menu-item>
					<el-menu-item v-if="!userInfo.id">
						<nuxt-link to="/register">注册</nuxt-link>
					</el-menu-item>
					<el-menu-item v-if="!userInfo.id">
						<nuxt-link to="/login">登录</nuxt-link>
					</el-menu-item>
				</el-menu>
			</el-header>
			<el-main>
				<nuxt />
			</el-main>
			<el-footer></el-footer>
		</el-container>
	</div>
</template>

<script>
export default {
	mounted() {
		this.getUserInfo()
	},
	computed: {
		userInfo() {
			return this.$store.state.user
		}
	},
	methods: {
		async getUserInfo() {
			const token = localStorage.getItem('token')
			if (token) {
				this.$store.dispatch('user/detail')
			}
		}
	}
}
</script>

<style lang="scss" scoped></style>
