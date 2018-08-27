<template>
  <div v-if='isLoggedIn'>
    <button @click='goBack()'>Back</button>
    <ul>
      <li><router-link :to="{ name: 'Week', params: { week_number: currentlyViewedWeek } }">Week</router-link></li>
      <li><router-link :to="{ name: 'Leaderboard' }">Leaderboard</router-link></li>
      <li><router-link :to="{ name: 'Settings', params: { user_id: '123' } }">Settings</router-link></li>
    </ul>
    <button @click='logout()'>Logout</button>
  </div>
  <div v-else>
    <li><router-link :to="{ name: 'Register' }">Register</router-link></li>
    <li><router-link :to="{ name: 'Signin' }">Sign in</router-link></li>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Navbar',
  data () {
    return {
      currentWeek: '1',
      currentlyViewedWeek: '2',
      isLoggedIn: false
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Landing' })
      })
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) { this.isLoggedIn = true }
      else { this.isLoggedIn = false }
    })
  }
}
</script>

<style>
</style>
