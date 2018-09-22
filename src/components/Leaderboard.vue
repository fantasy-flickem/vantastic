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
        <button class="button button--center-center" @click='updateScores'>Update scores</button>
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
      currentDbUser: null,
      isFetchingData: true,
      tribeUsersArray: []
    }
  },
  created () {
    this.isFetchingData = true
    if (!this.user) {
      let userRef = db.collection('users').where('uid', '==', firebase.auth().currentUser.uid)
      userRef.get().then(snapshot => {
        let profile = null
        snapshot.forEach(doc => {
          profile = doc.data()
          profile.id = doc.id
        })
        this.currentDbUser = profile
        this.fetchData(profile)
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
    updateScores () {
      this.isFetchingData = true
      let unaccountedPicksArray = []
      let unaccountedPicksRef = db.collection('picks').where('isAccounted', '==', false).where('tribeId', '==', this.user.tribeId)
      unaccountedPicksRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let pick = doc.data()
          pick.id = doc.id
          unaccountedPicksArray.push(pick)
        })
        let unaccountedPastPicksArray = unaccountedPicksArray.filter(pick => pick.week < this.currentWeekNumber)
        let usersWithPicksArray = []
        // I _think_ this.tribeUsersArray will always exist when requested here
        this.tribeUsersArray.forEach(tribeUser => {
          let userWithPicksObject = {
            user: tribeUser,
            picksArray: []
          }
          let picksArray = unaccountedPastPicksArray.filter(pick => pick.uid === tribeUser.uid)
          userWithPicksObject.picksArray = picksArray
          usersWithPicksArray.push(userWithPicksObject)
        })
        return usersWithPicksArray
      }).then(_usersWithPicksArray => {
        let gamesRef = db.collection('games')
        let promises = []
        let userScoreObjectArray = []
        _usersWithPicksArray.forEach(_userWithPicksObject => {
          let userScoreObject = {
            dbid: _userWithPicksObject.user.id,
            score: _userWithPicksObject.user.score
          }
          userScoreObjectArray.push(userScoreObject)
          _userWithPicksObject.picksArray.forEach(_pick => {
            let game = null
            promises.push(
              gamesRef.doc(_pick.gameId).get().then(doc => {
                game = doc.data()
                game.id = doc.id
                if (game.isFinal) {
                  if (game.result === 'TIE' || game.result === _pick.teamId) {
                    _pick.isCorrect = true
                  } else {
                    _pick.isCorrect = false
                  }
                  _pick.dbid = _userWithPicksObject.user.id
                  return _pick
                }
              }).then(_pick => {
                let picksRef = db.collection('picks').doc(_pick.id)
                if (_pick.isCorrect) {
                  picksRef.update({
                    isAccounted: true,
                    isCorrect: true
                  })
                  return _pick.dbid
                } else {
                  picksRef.update({
                    isAccounted: true,
                    isCorrect: false
                  })
                  return null
                }
              })
            )
          })
        })
        this.userScoreObjectArray = userScoreObjectArray
        Promise.all(promises).then(values => {
          // Update each user's score in 'users'
          this.tribeUsersArray.forEach(tribeUser => {
            let userScoreObject = this.userScoreObjectArray.find(obj => { return obj.dbid === tribeUser.id })
            userScoreObject.score = tribeUser.score + values.filter(dbid => dbid === tribeUser.id).length
            tribeUser.score = tribeUser.score + values.filter(dbid => dbid === tribeUser.id).length
          })
          let userRef = db.collection('users')
          let promises = []
          this.userScoreObjectArray.forEach(user => {
            promises.push(
              userRef.doc(user.dbid).update({
                score: user.score
              })
            )
          })
          Promise.all(promises).then(values => {
            this.isFetchingData = false
          })
        })
      })
    }
  }
}
</script>
