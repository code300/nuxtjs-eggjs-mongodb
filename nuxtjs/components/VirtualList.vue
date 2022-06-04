<template>
	<div class="virtual-list">
		<div
			ref="virtual-list-container"
			class="virtual-list-container"
			@scroll="scrollEvent($event)"
		>
			<div class="virtual-list" :style="{ height: listHeight + 'px' }"></div>
			<div class="list" :style="{ top: getTop + 'px' }">
				<ArticleItem
					class="list-item"
					v-for="item in visibleData"
					:key="item._id"
					:article="item"
					style="
						 {
							height: size + 'px';
						}
					"
				></ArticleItem>
			</div>
		</div>
	</div>
</template>

<script>
import ArticleItem from '~/components/ArticleItem.vue'
export default {
	name: 'VirtualList',
	props: {
		listData: {
			type: Array,
			default: () => []
		},
		size: {
			type: Number,
			default: 200
		}
	},
	components: {
		ArticleItem
	},
	mounted() {
		this.end = this.start + this.visibleCount
	},
	computed: {
		listHeight() {
			return this.listData.length * this.size
		},
		getTop() {
			return this.startOffset
		},
		visibleCount() {
			return Math.ceil(this.screenHeight / this.size)
		},
		visibleData() {
			return this.listData.slice(
				this.start,
				Math.min(this.end, this.listData.length)
			)
		}
	},
	data() {
		return {
			screenHeight: 800,
			startOffset: 0,
			start: 0, //开始的索引
			end: 4 //结束的索引
		}
	},
	methods: {
		scrollEvent() {
			let scrollTop = this.$refs.list.scrollTop
			this.start = Math.floor(scrollTop / this.size)
			this.end = this.start + this.visibleCount
			this.startOffset = scrollTop - (scrollTop % this.size)
		}
	}
}
</script>

<style lang="scss" scoped>
.virtual-list {
	.virtual-list-container {
		height: 100%;
		overflow: auto;
		position: relative;
		.virtual-list {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			z-index: -1;
		}
		.list {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			.list-item {
				padding: 10px;
				color: #555;
				border-bottom: 1px solid #999;
			}
		}
	}
}
</style>
