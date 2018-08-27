<template>
  <div>
    <h1>WEEK</h1>
    <h3>Games</h3>
    <div v-for="game in games" :key='game.id'>
      <div>{{ game.name }}</div>
      <!-- <div>{{ game.awayTeam.name }}</div>
      <div>{{ game.homeTeam.name }}</div> -->
    </div>
    <!-- USE ONCE WE SET UP THE COMPUTED PROPERTY gameGroups -->
    <!-- <div v-for='gameGroup in gameGroups' :key='gameGroup.id'>
      <div v-for='game in gameGroup.games' :key='game.id'>
        <div>{{ game.name }}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Week',
  data () {
    return {
      games: [],
      weekNumber: this.$route.params.week_number
    }
  },
  methods: {
    getCurrentlyViewedWeeksGames (_currentlyViewedWeek) {
      // TODO: Store cache of all gotten week's games, and check if week's games exist before doing .get
      let ref = db.collection('games').where('week', '==', _currentlyViewedWeek)
      ref.get().then(snapshot => {
        this.games = []
        snapshot.forEach(doc => {
          let game = doc.data()
          game.id = doc.id
          this.games.push(game)
        })
      })
    },
    updateCurrentlyViewedWeek () {
      this.weekNumber = this.$route.params.week_number
      this.getCurrentlyViewedWeeksGames(this.weekNumber)
    }
  },
  created () {
    this.getCurrentlyViewedWeeksGames(this.weekNumber)
  },
  watch: {
    $route: 'updateCurrentlyViewedWeek'
  }
}
</script>

<style>
</style>
