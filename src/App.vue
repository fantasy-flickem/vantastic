<template>
  <div>
    <Navbar />
    <router-view/>
  </div>
</template>

<style>
</style>

<script>
import Landing from './components/Landing'
import Leaderboard from './components/Leaderboard'
import Navbar from './components/Navbar'
import Register from './components/auth/Register'
import Settings from './components/Settings'
import Signin from './components/auth/Signin'
import Week from './components/Week'
export default {
  name: 'vantastic',
  components: {
    Landing, Leaderboard, Navbar, Register, Settings, Signin, Week
  },
  data () {
    return { }
  }
}
</script>
