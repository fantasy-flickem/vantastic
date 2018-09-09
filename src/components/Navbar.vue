<template>
  <div v-if='authUser' class="l-navbar">
    <div class="text">{{ currentRouteName }}</div>
    <ul>
      <li><router-link :to="{ name: 'Picks', params: { week_number: currentWeekNumber } }">Picks</router-link></li>
      <li><router-link :to="{ name: 'Leaderboard' }">Leaderboard</router-link></li>
      <li><router-link :to="{ name: 'Settings', params: { uid: authUser.uid } }">Settings</router-link></li>
    </ul>
    <button @click='logout()'>Logout</button>
  </div>
  <div v-else class="l-navbar">
    <div class="text">{{ currentRouteName }}</div>
    <ul>
      <li><router-link :to="{ name: 'Register' }">Register</router-link></li>
      <li><router-link :to="{ name: 'Signin' }">Sign in</router-link></li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Navbar',
  props: [ 'currentWeekNumber' ],
  data () {
    return {
      authUser: null,
      currentRouteName: this.$router.history.current.name
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
    },
    updateCurrentRouteName () {
      this.currentRouteName = this.$router.history.current.name
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
  },
  watch: {
    $route: 'updateCurrentRouteName'
  }
}
</script>
