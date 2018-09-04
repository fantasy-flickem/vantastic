<template>
  <div>
    <Navbar />
  </div>
</template>

<style>
</style>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
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
    return {
      favoriteTeam: null,
      teams: null,
      user: null
    }
  },
  beforeCreate () {
    let userRef = db.collection('users').where('uid', '==', firebase.auth().currentUser.uid).limit(1)
    userRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let team = doc.data()
        team.id = doc.id
        teams.push(team)
      })
      this.teams = teams
    })
  }
}
</script>
