<template>
  <div>

    <Nuxt />

  </div>
</template>

<script>
export default {}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}
.bg-image {
  width: 100%;
  height: 100%;
  position: fixed;
  background-repeat: no-repeat;
  /* background-size: 100% 100%; */
  /* background-position: center; */
  background-size: cover;
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
}

.submit-item {
  text-align: center;
  margin-bottom: 22px;
}
.submit-item button{
  width: 200px;
}
</style>
