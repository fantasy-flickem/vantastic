<template>
  <div>
    <Navbar v-on:log-user-out="emptyUser" />
    <router-view :favoriteTeam=this.favoriteTeam :teams=this.teams :user=this.user v-on:log-user-in="fillUser" />
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
  methods: {
    emptyUser () {
      console.log('emptying user')
      this.user = null
    },
    fillUser (_uid) {
      console.log('filling user', _uid)
      let userRef = db.collection('users').where('uid', '==', _uid).limit(1)
      userRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let profile = doc.data()
          profile.id = doc.id
          this.user = profile
        })
      }).then(() => {
        let favoriteTeamRef = db.collection('teams').doc(this.user.favoriteTeamId)
        favoriteTeamRef.get().then(doc => {
          let favoriteTeam = doc.data()
          favoriteTeam.id = doc.id
          this.favoriteTeam = favoriteTeam
        })
        console.log('user successfully filled')
      })
    }
  },
  created () {
    let teamsRef = db.collection('teams')
    let teams = []
    teamsRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let team = doc.data()
        team.id = doc.id
        teams.push(team)
      })
      this.teams = teams
    })
  },
  beforeUpdate () {
    console.log('beforeUpdate is firing')
    if (this.user) {
    } else {
      // If the app is created when the user is not logged in
      if (firebase.auth().currentUser) {
        // This will spit an error
        // Somehow, fillUser is firing before currentUser.uid exists?
        let uid = firebase.auth().currentUser.uid
        console.log('firebase.auth().currentUser.uid', firebase.auth().currentUser.uid)
        if (uid) {
          this.fillUser(uid)
        }
      }
    }
  }
}
</script>
