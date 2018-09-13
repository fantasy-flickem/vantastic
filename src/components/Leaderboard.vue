<template>
  <div class="l-content">
    <div v-if='isFetchingData'>
    </div>
    <div v-else class="runner runner--with-bottom-border" style="position:relative; min-height:60vh;">
      <div class="text text--fs-large text--fw-bold text--align-center" style="margin-top:10px">Week {{ currentWeekNumber }} leaders</div>
      <div v-for='(tribeUser, index) in tribeUsersArray' :key='index' class="text__row text__row--spaced-padding-1" style="margin-right:20px; margin-left:20px;">
        <div class="text">{{ tribeUser.displayName }}</div>
        <div class="text">{{ tribeUser.score }}</div>
      </div>
      <div v-if='user.isAdmin' class="button__group button__group--vertical" style="position:absolute; bottom:0; width:100%;">
        <button class="button" @click='updateScores()'>Update scores</button>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'Leaderboard',
  props: [ 'currentWeekNumber', 'user' ],
  data () {
    return {
      isFetchingData: true,
      tribeUsersArray: [],
      tribeUsersUnaccountedPicksArray: []
    }
  },
  created () {
    this.isFetchingData = true
    if (!this.user) {
      let userRef = db.collection('users').where('uid', '==', firebase.auth().currentUser.uid)
      userRef.get().then(snapshot => {
        return this.getDbUser(snapshot)
      }).then(_profile => {
        this.fetchData(_profile)
      })
    } else {
      this.fetchData(this.user)
    }
  },
  methods: {
    fetchData (_profile) {
      this.isFetchingData = true
      let tribeUsersRef = db.collection('users').where('tribeId', '==', _profile.tribeId).orderBy('score', 'desc')
      tribeUsersRef.get().then(snapshot => {
        let tribeUsersArray = []
        snapshot.forEach(doc => {
          let tribeUser = doc.data()
          tribeUser.id = doc.id
          tribeUsersArray.push(tribeUser)
        })
        this.tribeUsersArray = tribeUsersArray
        this.isFetchingData = false
      })
    },
    getDbUser (_snapshot) {
      let profile = null
      _snapshot.forEach(doc => {
        profile = doc.data()
        profile.id = doc.id
      })
      return profile
    },
    updateScores () {
      let unaccountedPicksArray = []
      let unaccountedPastPicksRef = db.collection('picks').where('isAccounted', '==', false)
      unaccountedPastPicksRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let pick = doc.data()
          pick.id = doc.id
          if (pick.week <= this.currentWeekNumber) {
            unaccountedPicksArray.push(pick)
          }
        })
        // [ {pick}, {pick}, {pick}, {pick}, {pick} ]
        return unaccountedPicksArray
      }).then(_unaccountedPicksArray => {
        let usersWithPicksArray = []
        this.tribeUsersArray.forEach(tribeUser => {
          let userWithPicksObject = {
            uid: tribeUser.uid,
            userDbId: tribeUser.id,
            userScore: tribeUser.score,
            picksArray: []
          }
          let picksArray = _unaccountedPicksArray.filter(pick => pick.uid === tribeUser.uid)
          userWithPicksObject.picksArray = picksArray
          // TODO picksArray is coming up totally empty 100% of the time
          usersWithPicksArray.push(userWithPicksObject)
        })
        return usersWithPicksArray
      }).then(_usersWithPicksArray => {
        let gamesRef = db.collection('games')
        let picksRef = db.collection('picks')
        let usersRef = db.collection('users')
        // Don't need to have the uid next to the pick in a special object
        // since the pick has the picker's uid
        _usersWithPicksArray.forEach(userObject => {
          userObject.picksArray.forEach(pick => {
            let game = null
            gamesRef.doc(pick.gameId).get().then(doc => {
              game = doc.data()
              game.id = doc.id
            }).then(() => {
              let isCorrect = false
              if (game && game.isFinal) {
                isCorrect = game.result === 'TIE' || game.result === pick.teamId
                if (isCorrect) {
                  picksRef.doc(pick.id).update({
                    isAccounted: true,
                    isCorrect: true
                  }).then(() => {
                    usersRef.doc(userObject.userDbId).update({
                      score: userObject.userScore + 1
                    })
                  })
                } else {
                  picksRef.doc(pick.id).update({
                    isAccounted: true,
                    isCorrect: false
                  })
                }
              }
            })
          })
        })
      })
    }
  }
}
</script>
