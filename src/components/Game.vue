<template>
  <div class="game">
    <div class="button__group button__group--horizontal" style="width:100%;">
      <button class="button" :class='[ game.homeTeamIsPicked ? isPickedClass : isUnpickedClass, game.homeTeamIsCorrect ? correctPickClass : incorrectPickClass]' :disabled=gameStartTimeHasPassed @click="makeOrUpdatePick(game, game.homeTeamId)">{{ game.homeTeam.name }}</button>
      <button class="button" :class='[ game.awayTeamIsPicked ? isPickedClass : isUnpickedClass, game.awayTeamIsCorrect ? correctPickClass : incorrectPickClass]' :disabled=gameStartTimeHasPassed @click="makeOrUpdatePick(game, game.awayTeamId)">{{ game.awayTeam.name }}</button>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
export default {
  name: 'Game',
  props: [ 'currentlyViewedWeekNumber', 'game', 'gameGroupName', 'user' ],
  data () {
    return {
      isPickedClass: 'button--is-picked',
      isunPickedClass: 'button--is-unpicked',
      correctPickClass: 'button--correct-pick'
    }
  },
  computed: {
    gameStartTimeHasPassed () {
      let gameStartTime = moment(this.game.startTime.seconds * 1000)
      let now = moment()
      return gameStartTime.diff(now) < 0
    },
    incorrectPickClass () {
      if (this.game.hasPick) {
        return 'button--incorrect-pick'
      } else {
        return ''
      }
    },
    isUnpickedClass () {
      if (!this.game.hasPick) {
        return 'button--is-unpicked'
      } else {
        return ''
      }
    },
    homeTeamClass () {
      return 'text'
    }
  },
  methods: {
    makeOrUpdatePick (_game, _teamId) {
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
                this.switchPick(_game)
                db.collection('picks').doc(pick.id).update({
                  teamId: _teamId
                })
              }
            } else {
              this.makePick(_game, _teamId)
              db.collection('picks').add({
                gameId: _game.id,
                teamId: _teamId,
                uid: currentUserUid,
                isFavoriteTeamGame: isFavoriteTeamGame,
                isAccounted: false,
                isCorrect: false,
                week: Number(this.currentlyViewedWeekNumber)
              })
            }
          })
      }
    },
    makePick (_game, _teamId) {
      if (_teamId === _game.homeTeamId) { _game.homeTeamIsPicked = true }
      if (_teamId === _game.awayTeamId) { _game.awayTeamIsPicked = true }
    },
    switchPick (_game) {
      if (_game.homeTeamIsPicked) {
        _game.homeTeamIsPicked = false
        _game.awayTeamIsPicked = true
      } else {
        _game.homeTeamIsPicked = true
        _game.awayTeamIsPicked = false
      }
    }
  }
}
</script>
