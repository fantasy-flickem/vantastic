<template>
  <div>
    <h1>WEEK</h1>
    <h3>Games</h3>
    <div v-for='(gameGroup, index) in gameGroups' :key='index'>
      <div v-if='gameGroup.games'>{{ gameGroup.name }}</div>
      <div v-for='game in gameGroup.games' :key='game.id'>
        <div>{{ game.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
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
  computed: {
    gameGroups () {
      let createGameGroupObject = (_gameGroupName, _gamesArray) => {
        let gameGroupObject = { name: _gameGroupName + ' games' }
        _gamesArray.length > 0 ? gameGroupObject.games = _gamesArray : gameGroupObject.games = null
        return gameGroupObject
      }
      let thursdayGames = []
      let saturdayGames = []
      let sundayEarlyGames = []
      let sundayLateGames = []
      let mondayGames = []
      // TODO How often does the computed property run (and do a forEach on all games for the day)?
      this.games.forEach(game => {
        let startTime = game.startTime.seconds * 1000
        let gameDay = moment(startTime).format('dddd')
        switch (gameDay) {
          case 'Thursday':
            thursdayGames.push(game)
            break
          case 'Saturday':
            saturdayGames.push(game)
            break
          case 'Sunday':
            if (Number(moment(startTime).format('kk')) < 14) {
              sundayEarlyGames.push(game)
            } else {
              sundayLateGames.push(game)
            }
            break
          case 'Monday':
            mondayGames.push(game)
            break
          default:
            break
        }
      })
      let gameGroups = []
      gameGroups.push(createGameGroupObject('Thursday', thursdayGames))
      gameGroups.push(createGameGroupObject('Saturday', saturdayGames))
      gameGroups.push(createGameGroupObject('Sunday early', sundayEarlyGames))
      gameGroups.push(createGameGroupObject('Sunday late', sundayLateGames))
      gameGroups.push(createGameGroupObject('Monday', mondayGames))
      return gameGroups
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
