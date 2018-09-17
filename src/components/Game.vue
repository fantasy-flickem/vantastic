<template>
  <div class="game">
    <div class="button__group button__group--horizontal button__group--justify-content-space-between" style="width:100%;">
      <Team :_team='_game.awayTeam' :_game='_game' :_pick='pick' :_user='_user' :_score='_game.awayTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
      <!-- <button style="height:65px; background-color:#FCFEFF">
        <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="25" height="12.5" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#B1012F"></rect>
          <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">25%</text>
        </svg>
        <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="25" height="37.5" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#428FC1"></rect>
          <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">75%</text>
        </svg>
      </button> -->
      <Team :_team='_game.homeTeam' :_game='_game' :_pick='pick' :_user='_user' :_score='_game.homeTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
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
      pick: this._pick
    }
  },
  methods: {
    makeOrUpdatePick (_teamId) {
      let currentUserUid = firebase.auth().currentUser.uid
      let picksRef = db.collection('picks').where('gameId', '==', this._game.id).where('uid', '==', currentUserUid)
      // this.isFavoriteTeamGame will always return false until it is added back to gameGroups
      // TODO Add favoriteTeamGame selection back in
      if (this.isFavoriteTeamGame) {
        picksRef = picksRef.where('isFavoriteTeamGame', '==', true)
      } else {
        this.isFavoriteTeamGame = false
      }
      picksRef.get().then(snapshot => {
        let pick = null
        snapshot.forEach(doc => {
          pick = doc.data()
          pick.id = doc.id
        })
        if (pick) {
          if (pick.teamId !== _teamId) {
            this.pick.teamId = _teamId
            db.collection('picks').doc(pick.id).update({
              teamId: _teamId
            })
          }
        } else {
          let newPick = {
            gameId: this._game.id,
            teamId: _teamId,
            uid: currentUserUid,
            tribeId: this._user.tribeId,
            isFavoriteTeamGame: this.isFavoriteTeamGame,
            isAccounted: false,
            isCorrect: false,
            week: Number(this._currentlyViewedWeekNumber)
          }
          this.pick = newPick
          db.collection('picks').add(newPick)
        }
      })
    }
  }
}
</script>
