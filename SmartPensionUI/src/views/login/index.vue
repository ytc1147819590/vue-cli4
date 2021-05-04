<template>
  <div>
    {{name}}
    <button @click="setText">改变</button>
  </div>
</template>

<script>
export default {
  data() {
    return{
      name: '登录'
    }
  },
  methods: {
    setText() {
      this.name = '登录成功'
    }
  },
  mounted() {
    console.log(this)
  }
}
</script>