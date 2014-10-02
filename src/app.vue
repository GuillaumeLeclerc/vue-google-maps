<style lang="stylus">
font-stack = Helvetica, sans-serif
primary-color = #333
body
  font 100% font-stack
  color primary-color
</style>

<template lang="jade">
h1 This is the app
div(v-component="a")
div(v-component="b")
</template>

<script lang="coffee">
module.exports =
  components:
    a: require './components/a.vue'
    b: require './components/b.vue'
</script>