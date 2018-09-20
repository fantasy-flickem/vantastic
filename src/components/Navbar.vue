<template>
  <div v-if='authUser' class="l-navbar">
    <div class="button__group button__group--horizontal" style="margin:0;">
      <!-- TODO Hamburger? -->
      <!-- <div class="text">{{ currentRouteName }}</div> -->
      <router-link :to="{ name: 'Picks', params: { week_number: currentWeekNumber } }" class="button button--center-center button--border-none">Picks</router-link>
      <router-link :to="{ name: 'Leaderboard' }" class="button button--center-center button--border-none">Leaderboard</router-link>
      <router-link :to="{ name: 'Settings', params: { uid: authUser.uid } }" class="button button--center-center button--border-none">Settings</router-link>
      <button @click='logout' class="button button--center-center button--border-none">Logout</button>
    </div>
  </div>
  <div v-else class="l-navbar">
    <div class="button__group button__group--horizontal" style="margin:0;">
      <router-link :to="{ name: 'Register' }" class="button button--center-center button--border-none">Register</router-link>
      <router-link :to="{ name: 'Signin' }" class="button button--center-center button--border-none">Sign in</router-link>
    </div>
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
        this.$router.push({ name: 'Signin' })
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
