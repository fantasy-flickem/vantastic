<template>
  <div>
    <Navbar />
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<style>
</style>

<script>
import Landing from './components/Landing'
import Leaderboard from './components/Leaderboard'
import Navbar from './components/Navbar'
import Picks from './components/Picks'
import Settings from './components/Settings'
import Signin from './components/Signin'
import Signup from './components/Signup'
export default {
  name: 'vantastic',
  components: {
    Landing, Leaderboard, Navbar, Picks, Settings, Signin, Signup
  },
  data () {
    return { }
  }
}
</script>
