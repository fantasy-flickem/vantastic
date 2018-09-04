<template>
  <div>
    <h1>LEADERBOARD</h1>
    <router-link :to="{ name: 'Week', params: { week_number: '1' } }">Go to picks</router-link>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  data () {
    return { }
  }
}
</script>

<style>
</style>
