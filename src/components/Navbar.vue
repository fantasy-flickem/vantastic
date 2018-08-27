<template>
  <div>
    <button @click='goBack()'>Back</button>
    <ul>
      <li><router-link :to="{ name: 'Week', params: { week_number: currentlyViewedWeek } }">Week</router-link></li>
      <li><router-link :to="{ name: 'Leaderboard' }">Leaderboard</router-link></li>
      <li><router-link :to="{ name: 'Settings', params: { user_id: '123' } }">Settings</router-link></li>
      <!-- <li><router-link :to="{  }">Logout</router-link></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      currentlyViewedWeek: '2',
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>
