<template>
  <div v-if='authUser'>
    <button @click='goBack()'>Back</button>
    <ul>
      <li><router-link :to="{ name: 'Week', params: { week_number: currentWeekNumber } }">Week</router-link></li>
      <li><router-link :to="{ name: 'Leaderboard' }">Leaderboard</router-link></li>
      <li><router-link :to="{ name: 'Settings', params: { uid: authUser.uid } }">Settings</router-link></li>
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
      currentWeekNumber: '2',
      authUser: null
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    logout () {
      firebase.auth().signOut().then(() => {
        this.$emit('log-user-out')
        this.$router.push({ name: 'Landing' })
      })
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        this.authUser = authUser
      } else {
        this.authUser = null
      }
    })
  }
}
</script>

<style>
</style>
