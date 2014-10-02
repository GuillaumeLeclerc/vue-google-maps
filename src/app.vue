<style>
  html, body {
    color: #666;
    font-family: Helvetica, Arial, sans-serif;
  }
</style>

<template>
  <h1>This is the app</h1>
  <div v-component="a"></div>
  <div v-component="b"></div>
</template>

<script>
  module.exports = {
    components: {
      a: require('./components/a.vue'),
      b: require('./components/b.vue')
    }
  }
</script>