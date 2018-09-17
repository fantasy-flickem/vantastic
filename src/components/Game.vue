<template>
  <div class="game">
    <div class="button__group button__group--horizontal button__group--justify-content-space-between" style="width:100%;">
      <Team :_team='_game.awayTeam' :_game='_game' :_pick='pick' :_score='_game.awayTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
      <Picksplit :_tribePicks='tribePicks' :_userNameDictionary='_userNameDictionary'></Picksplit>
      <Team :_team='_game.homeTeam' :_game='_game' :_pick='pick' :_score='_game.homeTeamScore' @send-selection='makeOrUpdatePick($event)'></Team>
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
    '_currentlyViewedWeekNumber',
    '_game',
    '_isFavoriteTeamGame',
    '_pick',
    '_user',
    '_userNameDictionary'
  ],
  data () {
    return {
      pick: this._pick,
      tribePicks: { away: [], home: [] }
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
  },
  created () {
    let picksRef = db.collection('picks').where('tribeId', '==', this._user.tribeId).where('gameId', '==', this._game.id)
    picksRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let pick = doc.data()
        pick.id = doc.id
        if (pick.teamId === this._game.awayTeamId) {
          this.tribePicks.away.push(pick)
        } else {
          this.tribePicks.home.push(pick)
        }
      })
    })
  }
}
</script>
