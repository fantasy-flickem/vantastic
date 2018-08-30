<template>
  <div v-if='teams'>
    <div class="stripe">
      <div class="l-header">
        <h1>WEEK {{ weekNumber }}</h1>
        <h3>Games</h3>
      </div>
    </div>
    <div class="stripe">
      <div class="l-content" v-for='(gameGroup, index) in gameGroups' :key='index'>
        <div v-if='gameGroup.games'>{{ gameGroup.name }}</div>
        <div v-for='(game, index) in gameGroup.games' :key='index'>
          <div>{{ game.homeTeam.name }}</div>
          <div>{{ game.awayTeam.name }}</div>
        </div>
        <!-- <div v-for='team in teams' :key='team.logoUrl'>
          {{ team.name }}
        </div> -->
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
      teams: [],
      games: [],
      weekNumber: Number(this.$route.params.week_number)
    }
  },
  methods: {
    getAllTeams () {
      let ref = db.collection('teams')
      ref.get().then(snapshot => {
        snapshot.forEach(doc => {
          let team = doc.data()
          team.id = doc.id
          this.teams.push(team)
        })
      })
    },
    getCurrentlyViewedWeeksGames (_currentlyViewedWeek) {
      this.games = []
      // TODO: Store cache of all gotten week's games, and check if week's games exist before doing .get
      let gamesRef = db.collection('games').where('week', '==', String(_currentlyViewedWeek))
      let gamesArray = []
      gamesRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let game = doc.data()
          game.id = doc.id
          if (!game.homeTeam && !game.awayTeam) {
            this.teams.forEach((team) => {
              if (team.id === game.homeTeamId) {
                game.homeTeam = team
              }
              if (team.id === game.awayTeamId) {
                game.awayTeam = team
              }
            })
          }
          gamesArray.push(game)
        })
      }).then(() => {
        this.games = gamesArray
      })
    },
    updateCurrentlyViewedWeek () {
      this.weekNumber = Number(this.$route.params.week_number)
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
  beforeCreate () {
    console.log('beforeCreate is firing')
  },
  created () {
    console.log('created is firing')
    this.getAllTeams()
    // TODO: this only fires on creation of the component, not on updated data
    this.getCurrentlyViewedWeeksGames(this.weekNumber)
  },
  beforeMount () {
    console.log('beforeMount is firing')
  },
  mounted () {
    console.log('mounted is firing')
  },
  beforeUpdate () {
    console.log('beforeUpdate is firing')
  },
  updated () {
    console.log('updated is firing')
  },
  watch: {
    $route: 'updateCurrentlyViewedWeek'
  }
}
</script>

<style>
</style>
