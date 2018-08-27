<template>
  <div>
    <h1>SETTINGS for {{ userId }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      userId: this.$route.params.user_id
    }
  },
  methods: {
    updateId () {
      this.userId = this.$route.params.user_id
    }
  },
  watch: {
    $route: 'updateId'
  }
}
</script>

<style>
</style>
