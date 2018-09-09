<template>
  <div>
    <button class="team" :disabled=gameStartTimeHasPassed @click="makePick(game, game.homeTeamId, gameGroupName)">{{ game.homeTeam.name }}</button>
    <button class="team" :disabled=gameStartTimeHasPassed @click="makePick(game, game.awayTeamId, gameGroupName)">{{ game.awayTeam.name }}</button>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
export default {
  name: 'Game',
  props: [ 'game', 'gameGroupName', 'user' ],
  data () {
    return { }
  },
  computed: {
    gameStartTimeHasPassed () {
      let gameStartTime = moment(this.game.startTime.seconds * 1000)
      let now = moment()
      return gameStartTime.diff(now) < 0
    }
  },
  methods: {
    makePick (_game, _teamId) {
      let isFavoriteTeamGame = this.gameGroupName === 'Favorite team game'
      if (!this.gameStartTimeHasPassed) {
        let currentUserUid = firebase.auth().currentUser.uid
        let picksRef = db.collection('picks').where('gameId', '==', _game.id).where('uid', '==', currentUserUid)
        if (isFavoriteTeamGame) {
          picksRef = picksRef.where('isFavoriteTeamGame', '==', true)
        }
        picksRef.get()
          .then(snapshot => {
            let pick = null
            snapshot.forEach(doc => {
              pick = doc.data()
              pick.id = doc.id
            })
            if (pick) {
              if (pick.teamId !== _teamId) {
                db.collection('picks').doc(pick.id).update({
                  teamId: _teamId
                })
              }
            } else {
              db.collection('picks').add({
                gameId: _game.id,
                teamId: _teamId,
                uid: currentUserUid,
                isFavoriteTeamGame: isFavoriteTeamGame
              })
            }
          })
      }
    }
  }
}
</script>
