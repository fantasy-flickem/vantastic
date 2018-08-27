<template>
  <div v-if='user'>
    <button @click='goBack()'>Back</button>
    <ul>
      <li><router-link :to="{ name: 'Week', params: { week_number: currentlyViewedWeek } }">Week</router-link></li>
      <li><router-link :to="{ name: 'Leaderboard' }">Leaderboard</router-link></li>
      <li><router-link :to="{ name: 'Settings', params: { uid: user.uid } }">Settings</router-link></li>
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
      user: null
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
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  }
}
</script>

<style>
</style>
