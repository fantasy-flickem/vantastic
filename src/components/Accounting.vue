<template>
  <div v-if='user.isAdmin' class="l-content">
    <form @submit.prevent="submitScores" class="runner" style="padding-top:30px;">
      <div v-for='(emptyGame, index) in gamesArray' :key='index' class="game__input">
        <div class="input">
          <label for="emptyGame.homeTeamId">{{ emptyGame.awayTeamId }}</label>
          <input id="emptyGame.homeTeamId" type="text" v-model="emptyGame.awayTeamScore" />
        </div>
        <div class="input">
          <label for="emptyGame.homeTeamId">{{ emptyGame.homeTeamId }}</label>
          <input id="emptyGame.homeTeamId" type="text" v-model="emptyGame.homeTeamScore" />
        </div>
        <input type="checkbox" name="emptyGame.homeTeamId" class="input" v-model="emptyGame.isFinal" />
      </div>
      <div class="button__group button__group--vertical">
        <button class="button">Submit scores</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Accounting',
  props: [ 'user' ],
  data () {
    return {
      gamesArray: []
    }
  },
  methods: {
    getEmptyGames () {
      // TODO-multi-league: Can add leagueId as argument to limit scope
      let now = new Date()
      let gamesRef = db.collection('games').where('startTime', '<', now)
      let gamesArray = []
      gamesRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let game = doc.data()
          game.id = doc.id
          if (!game.isFinal) {
            gamesArray.push(game)
          }
        })
        this.gamesArray = gamesArray
      })
    },
    submitScores () {
      // TODO validate the inputs are serving up numbers
      let now = new Date()
      let gamesRef = db.collection('games').where('startTime', '<', now)
      this.gamesArray.forEach(game => {
        if (game.homeTeamScore && game.awayTeamScore && game.isFinal) {
          let isTie = game.homeTeamScore === game.awayTeamScore
          let result = null
          if (isTie) {
            result = 'TIE'
          } else {
            result = game.homeTeamScore > game.awayTeamScore ? game.homeTeamId : game.awayTeamId
          }
          gamesRef.doc(game.id).update({
            homeTeamScore: game.homeTeamScore,
            awayTeamScore: game.awayTeamScore,
            isFinal: game.isFinal,
            result: result
          })
        }
      })
    }
  },
  created () {
    this.getEmptyGames()
  }
}
</script>
