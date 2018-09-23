<template>
  <div class="game">
    <div class="button__group button__group--horizontal button__group--justify-content-space-between" style="position:relative; width:100%;">
      <Team :_team='_game.awayTeam' :_game='_game' :_myPick='myPick' :_score='_game.awayTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
      <Picksplit v-if='!_game.isFavoriteTeamGame' :_gameId='_game.id' :_tribePicks='tribePicks' :_userNameDictionary='_userNameDictionary' :_user='_user'></Picksplit>
      <Team :_team='_game.homeTeam' :_game='_game' :_myPick='myPick' :_score='_game.homeTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Picksplit from './Picksplit'
import Team from './Team'
export default {
  name: 'Game',
  components: { Picksplit, Team },
  props: [
    '_adminOverrideObject',
    '_currentlyViewedWeekNumber',
    '_game',
    '_myPick',
    '_tribePicks',
    '_user',
    '_userNameDictionary'
  ],
  data () {
    return {
      myPick: this._myPick,
      tribePicks: {home: [], away: []}
    }
  },
  methods: {
    makeOrUpdatePick (_teamId) {
      let selectedUserUid = firebase.auth().currentUser.uid
      let selectedTribeId = this._user.tribeId
      let isAdminOverriding = false
      if (this._adminOverrideObject.uid && this._adminOverrideObject.tribeId) {
        selectedUserUid = this._adminOverrideObject.uid
        selectedTribeId = this._adminOverrideObject.tribeId
        isAdminOverriding = true
      }
      let picksRef = db.collection('picks').where('gameId', '==', this._game.id).where('uid', '==', selectedUserUid)
      if (this._game.isFavoriteTeamGame) {
        picksRef = picksRef.where('isFavoriteTeamGame', '==', true)
      } else {
        picksRef = picksRef.where('isFavoriteTeamGame', '==', false)
      }
      picksRef.get().then(snapshot => {
        let pick = null
        snapshot.forEach(doc => {
          pick = doc.data()
          pick.id = doc.id
        })
        if (pick) {
          if (pick.teamId !== _teamId) {
            if (!isAdminOverriding) { this.myPick.teamId = _teamId }
            db.collection('picks').doc(pick.id).update({
              teamId: _teamId
            })
          }
        } else {
          let newPick = {
            gameId: this._game.id,
            teamId: _teamId,
            uid: selectedUserUid,
            tribeId: selectedTribeId,
            isFavoriteTeamGame: this._game.isFavoriteTeamGame,
            isAccounted: false,
            isCorrect: false,
            week: Number(this._currentlyViewedWeekNumber)
          }
          if (!isAdminOverriding) { this.myPick = newPick }
          db.collection('picks').add(newPick)
        }
      })
    }
  },
  created () {
    this._tribePicks.forEach(tribePick => {
      if (tribePick.teamId === this._game.awayTeamId) {
        this.tribePicks.away.push(tribePick)
      } else {
        this.tribePicks.home.push(tribePick)
      }
    })
  }
}
</script>
