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
      let unaccountedPicksRef = db.collection('picks').where('isAccounted', '==', false)
      unaccountedPicksRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let pick = doc.data()
          pick.id = doc.id
          unaccountedPicksArray.push(pick)
        })
        let unaccountedPastPicksArray = unaccountedPicksArray.filter(pick => pick.week < this.currentWeekNumber)
        // [ { pick.uid: uid }, ... ]
        return unaccountedPastPicksArray
      }).then(_unaccountedPicksArray => {
        let usersWithPicksArray = []
        // I _think_ this.tribeUsersArray will always exist when requested here
        this.tribeUsersArray.forEach(tribeUser => {
          let userWithPicksObject = {
            user: tribeUser,
            picksArray: []
          }
          let picksArray = _unaccountedPicksArray.filter(pick => pick.uid === tribeUser.uid)
          userWithPicksObject.picksArray = picksArray
          usersWithPicksArray.push(userWithPicksObject)
        })
        // [ {
        //   user: { user },
        //   picksArray: [ { pick.id: id, pick.gameId: gameId }, ... ]
        // }, ... ]
        return usersWithPicksArray
      }).then(_usersWithPicksArray => {
        let gamesRef = db.collection('games')
        // let picksRef = db.collection('picks')
        // TODO-scoring Remove the userWithPicksObject iterator?
        var promises = []
        _usersWithPicksArray.forEach(_userWithPicksObject => {
          _userWithPicksObject.picksArray.forEach(_pick => {
            let game = null
            promises.push(
              gamesRef.doc(_pick.gameId).get().then(doc => {
                game = doc.data()
                game.id = doc.id

                if (game.isFinal) {
                  if (game.result === 'TIE' || game.result === _pick.teamId) {
                    // picksRef.doc(_pick.id).update({ isAccounted: true, isCorrect: true })
                    let correctValue = [ _userWithPicksObject.user.id, true ]
                    return correctValue
                  } else {
                    // picksRef.doc(_pick.id).update({ isAccounted: true, isCorrect: false })
                    return null
                  }
                }
              })
            )
          })
        })
        Promise.all(promises).then(values => {
          // Find out how many points each user gets
          // Get each user
          // let userScore = null
          // let usersRef = db.collection('users').doc(userWithPicksObject.id)
          // usersRef.get().then(doc => {
          //   userScore = doc.data().score
          // })
          // .update?
          // Update each user's score to be user.score + totalPoints
          // userWithPicksObject.userScore = userScore + Number(isCorrect)
          values.forEach(value => { })
          this.isFetchingData = false
        })
      })
    }
  }
}
</script>
