<template>
  <div>

    <Nuxt />

  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  .bg-image {
    width: 100%;
    height: 100%;
    position: fixed;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover !important;
    .mask {
      width: 100%;
      height: 100%;
      opacity: 0.6;
      background: #fff;
    }
    .form-box {
      position: absolute;
      width: 360px;
      padding: 22px 22px 0 22px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 5px;
      .captcha {
        width: 280px;
        height: 40px;
        margin-bottom: 22px;
        display: flex;
        margin-left: 80px;
      }
      .submit-item {
        text-align: center;
        margin-bottom: 22px;
        .el-button {
          width: 200px;
        }
      }
    }
  }
}
</style>
