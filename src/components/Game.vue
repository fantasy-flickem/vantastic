<template>
  <div class="game">
    <div v-if='isFetchingData'>
    </div>
    <div v-else class="button__group button__group--horizontal button__group--justify-content-space-between" style="width:100%;">
      <Team :_team='_game.awayTeam' :_isHome=false :_isPicked='_game.awayTeamIsPicked' :_hasStarted='gameStartTimeHasPassed' :_isCorrect='_game.awayTeamIsPicked && _game.awayTeamScore >= _game.homeTeamScore' :_isIncorrect='_game.awayTeamIsPicked && _game.homeTeamScore > _game.awayTeamScore' :_score='_game.awayTeamScore'></Team>
      <button style="height:65px; background-color:#FCFEFF">
        <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="25" height="12.5" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#B1012F"></rect>
          <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">25%</text>
        </svg>
        <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="25" height="37.5" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#428FC1"></rect>
          <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">75%</text>
        </svg>
      </button>
      <Team :_team='_game.homeTeam' :_isHome=true :_isPicked='_game.homeTeamIsPicked' :_hasStarted='gameStartTimeHasPassed' :_isCorrect='_game.homeTeamIsPicked && _game.homeTeamScore >= _game.awayTeamScore' :_isIncorrect='_game.homeTeamIsPicked && _game.awayTeamScore > _game.homeTeamScore' :_score='_game.homeTeamScore'></Team>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
import Team from './Team'
export default {
  name: 'Game',
  components: { Team },
  props: [
    '_currentlyViewedWeekNumber',
    '_game',
    '_isFavoriteTeamGame',
    '_pick',
    '_user'
  ],
  data () {
    return {
      isFetchingData: true
    }
  },
  computed: {
    gameStartTimeHasPassed () {
      let gameStartTime = moment(this._game.startTime.seconds * 1000)
      let now = moment()
      return gameStartTime.diff(now) < 0
    }
  },
  methods: {
    makeOrUpdatePick (_game, _teamId) {
      let currentUserUid = firebase.auth().currentUser.uid
      let picksRef = db.collection('picks').where('gameId', '==', _game.id).where('uid', '==', currentUserUid)
      // this.isFavoriteTeamGame will always return false until it is added back to gameGroups
      if (this.isFavoriteTeamGame) {
        picksRef = picksRef.where('isFavoriteTeamGame', '==', true)
      }
      picksRef.get().then(snapshot => {
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
            isFavoriteTeamGame: this.isFavoriteTeamGame,
            isAccounted: false,
            isCorrect: false,
            week: Number(this.currentlyViewedWeekNumber)
          })
        }
      })
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
    },
    fetchData () {
      this.isFetchingData = true
      if (this._pick) {
        if (this._pick.teamId === this._game.homeTeam.id) {
          this._game.homeTeamIsPicked = true
          this._game.homeTeamIsCorrect = this._pick.isCorrect
        }
        if (this._pick.teamId === this._game.awayTeam.id) {
          this._game.awayTeamIsPicked = true
          this._game.awayTeamIsCorrect = this._pick.isCorrect
        }
      }
      this.isFetchingData = false
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
