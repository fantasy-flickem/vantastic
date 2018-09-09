<template>
  <div class="l-content">
    <div v-if='tribeUsersArray.length > 0' class="runner runner--with-bottom-border" style="min-height:60vh">
      <div class="text text--fs-large text--fw-bold text--align-center" style="margin-top:10px">Week {{ currentWeekNumber }} leaders</div>
      <Competitor v-for='(tribeUser, index) in tribeUsersArray' :key='index' :competitor=tribeUser></Competitor>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Competitor from './Competitor'
export default {
  name: 'Leaderboard',
  components: { Competitor },
  props: [ 'currentWeekNumber', 'user' ],
  data () {
    return {
      currentDbUser: null,
      tribeUsersArray: []
    }
  },
  created () {
    console.log('Hi there. I\'ve got some information I\'d like to share with you:')
    if (!this.user) {
      console.log('It looks like you\'ve just refreshed the Leaderboard')
      console.log('There is no this.user yet')
      let userRef = db.collection('users').where('uid', '==', firebase.auth().currentUser.uid)
      userRef.get().then(snapshot => {
        let profile = null
        snapshot.forEach(doc => {
          profile = doc.data()
          profile.id = doc.id
        })
        this.currentDbUser = profile
        console.log('this.user has now been set to', profile)
        return profile
      }).then(_profile => {
        let tribeUsersRef = db.collection('users').where('tribeId', '==', this.currentDbUser.tribeId).orderBy('score', 'desc')
        tribeUsersRef.get().then(snapshot => {
          let tribeUsersArray = []
          snapshot.forEach(doc => {
            let tribeUser = doc.data()
            tribeUser.id = doc.id
            tribeUsersArray.push(tribeUser)
          })
          console.log('passing along tribeUsersArray', tribeUsersArray)
          return tribeUsersArray
        }).then((_tribeUsersArray) => {
          let usersCorrectPicksRef = db.collection('picks').where('isCorrect', '==', true)
          _tribeUsersArray.forEach(_user => {
            usersCorrectPicksRef.where('uid', '==', _user.uid).get().then(snapshot => {
              _user.currentScore = snapshot.size
            })
          })
          console.log('this.tribeUsersArray has just been set to', _tribeUsersArray)
          this.tribeUsersArray = _tribeUsersArray
        })
      })
    } else {
      console.log('It looks like you\'ve arrived here via in-app navigation')
      console.log('this.user is currently set to', this.user)
      let tribeUsersRef = db.collection('users').where('tribeId', '==', this.user.tribeId).orderBy('score', 'desc')
      tribeUsersRef.get().then(snapshot => {
        let tribeUsersArray = []
        snapshot.forEach(doc => {
          let tribeUser = doc.data()
          tribeUser.id = doc.id
          tribeUsersArray.push(tribeUser)
        })
        console.log('passing along tribeUsersArray', this.tribeUsersArray)
        return tribeUsersArray
      }).then((_tribeUsersArray) => {
        let usersCorrectPicksRef = db.collection('picks').where('isCorrect', '==', true)
        _tribeUsersArray.forEach(_user => {
          usersCorrectPicksRef.where('uid', '==', _user.uid).get().then(snapshot => {
            _user.currentScore = snapshot.size
          })
        })
        console.log('this.tribeUsersArray has just been set to', _tribeUsersArray)
        this.tribeUsersArray = _tribeUsersArray
      })
    }
  }
}
</script>
