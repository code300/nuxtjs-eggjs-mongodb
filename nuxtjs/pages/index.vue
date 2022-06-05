<template>
	<!-- <Tutorial/> -->
	<div class="home">
		<div class="container">
			<VirtualList :list-data="articles" />
			<div v-for="(item, index) in articles" :key="index">
				{{ item.title }}
			</div>
		</div>
	</div>
</template>

<script>
import VirtualList from '~/components/VirtualList'

export default {
	name: 'IndexPage',
	components: {
		VirtualList
	},
	data() {
		return {
			articles: []
		}
	},
	mounted() {
		this.getArticles()
	},
	methods: {
		async getArticles() {
			const res = await this.$http.get('/article')
			if (res.code == 0) {
				this.articles = res.data
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.home {
	.title {
		font-family: 'Quicksand', 'Source Sans Pro', -apple-system,
			BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		display: block;
		font-weight: 300;
		font-size: 100px;
		color: #35495e;
		letter-spacing: 1px;
	}
	.subtitle {
		font-weight: 300;
		font-size: 42px;
		color: #526488;
		word-spacing: 5px;
		padding-bottom: 15px;
	}
	.links {
		padding-top: 15px;
	}
	html {
		height: 100%;
	}
	body {
		height: 100%;
		margin: 0;
	}
}
</style>
