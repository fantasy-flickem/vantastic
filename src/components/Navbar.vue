<template>
  <div>
    <button @click='goBack()'>Back</button>
    <ul>
      <li><router-link :to="{ name: 'Picks' }">Picks</router-link></li>
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
    return { }
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
