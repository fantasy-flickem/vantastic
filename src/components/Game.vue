<template>
  <div>
    <div>Here's a game</div>
    <button class="team" @click="makePick(game, game.homeTeamId, false)">{{ game.homeTeam.name }}</button>
    <button class="team" @click="makePick(game, game.awayTeamId, false)">{{ game.awayTeam.name }}</button>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'Game',
  props: ['game'],
  data () {
    return {
    }
  },
  methods: {
    makePick (_game, _teamId, _isFavoriteTeamGamePick) {
      let gameTeamIds = [
        _game.homeTeamId,
        _game.awayTeamId
      ]
      if (gameTeamIds.indexOf(_teamId) >= 0) {
        let currentUserUid = firebase.auth().currentUser.uid
        let ref = db.collection('picks').where('gameId', '==', _game.id).where('uid', '==', currentUserUid)
        ref.get()
          .then(snapshot => {
            let pick = null
            snapshot.forEach(doc => {
              pick = doc.data()
              pick.id = doc.id
            })
            return pick
          })
          .then(_pick => {
            if (_pick) {
              if (_pick.teamId !== _teamId) {
                db.collection('picks').doc(_pick.id).update({
                  teamId: _teamId
                })
              }
            } else {
              db.collection('picks').add({
                gameId: _game.id,
                teamId: _teamId,
                uid: currentUserUid
              })
            }
          })
      }
    }
  }
}
</script>

<style>
</style>
