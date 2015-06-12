<style lang="stylus">
font-stack = Helvetica, sans-serif
primary-color = #999
body
  font 100% font-stack
  color primary-color
</style>

<template lang="jade">
h1 This is the app
  comp-a
  comp-b
</template>

<script lang="coffee">
module.exports =
  components: {
    'comp-a': require './components/a.vue'
    'comp-b': require './components/b.vue'
  }
</script>
