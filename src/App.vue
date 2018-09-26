<template>
  <div id="vantastic" style="display:flex; flex-direction:column;">
    <Navbar :currentWeekNumber=this.currentWeekNumber />
    <router-view :user=this.user :currentWeekNumber=this.currentWeekNumber />
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
import Accounting from './components/Accounting'
import Landing from './components/Landing'
import Leaderboard from './components/Leaderboard'
import Navbar from './components/Navbar'
import Register from './components/auth/Register'
import Settings from './components/Settings'
import Signin from './components/auth/Signin'
import Picks from './components/Picks'
export default {
  name: 'vantastic',
  components: {
    Accounting, Landing, Leaderboard, Navbar, Register, Settings, Signin, Picks
  },
  data () {
    return {
      currentWeekNumber: null,
      user: null
    }
  },
  methods: {
    getCurrentDbUser () {
      if (firebase.auth().currentUser) {
        let userRef = db.collection('users').where('uid', '==', firebase.auth().currentUser.uid).limit(1)
        userRef.get().then(snapshot => {
          snapshot.forEach(doc => {
            let profile = doc.data()
            profile.id = doc.id
            this.user = profile
          })
        })
      }
    }
  },
  created () {
    this.getCurrentDbUser()
    this.currentWeekNumber = moment().diff(moment('2018-09-04'), 'weeks') + 1
  },
  updated () {
    this.getCurrentDbUser()
  }
}
</script>

<style lang="scss">
  @import 'src/assets/stylesheets/_variables.scss';
  @import 'src/assets/stylesheets/lib/_normalize.scss';
  @import 'src/assets/stylesheets/lib/_base.scss';
  @import 'src/assets/stylesheets/_layout.scss';
  @import 'src/assets/stylesheets/button.scss';
  @import 'src/assets/stylesheets/callout.scss';
  @import 'src/assets/stylesheets/dot.scss';
  @import 'src/assets/stylesheets/game.scss';
  @import 'src/assets/stylesheets/input.scss';
  @import 'src/assets/stylesheets/runner.scss';
  @import 'src/assets/stylesheets/team.scss';
  @import 'src/assets/stylesheets/text.scss';
</style>
