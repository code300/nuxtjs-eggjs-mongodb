<template>
  <div>
    <h1>用户中心</h1>
  </div>
</template>

<script>
export default {
  async mounted() {
    // await this.$http.get('/user/info').then((res, err) => {
    //   console.log(res,'res')
    //   console.log(err,'err')
    // })
    const res = await this.$http.get('/user/info')
    console.log(res, 'res')
  },
}
</script>

<style lang="scss" scoped>
</style>