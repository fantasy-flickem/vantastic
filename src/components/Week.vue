<template>
  <div>
    <div class="stripe">
      <div class="l-header">
        <h1>WEEK {{ currentWeekNumber }}</h1>
        <h3>Games</h3>
      </div>
    </div>
    <div class="stripe">
      <div class="l-content">
        <div v-if='gameGroups.length > 0'>
          <div v-for='(gameGroup, index) in gameGroups' :key='index' class="game-group">
            <div v-if='gameGroup.games'>{{ gameGroup.name }}</div>
            <Game v-for='(game, index) in gameGroup.games' :key='index' :game=game :user=user :gameGroupName=gameGroup.name class="game"></Game>
          </div>
        </div>
      </div>
    </div>
    <div class="stripe">
      <div class="l-footer">
        <router-link :to="{ name: 'Week', params: { week_number: (decrementWeekNumber()) } }">Previous Week</router-link>
        <router-link :to="{ name: 'Week', params: { week_number: (incrementWeekNumber()) } }">Next Week</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import Game from './Game'
export default {
  name: 'Week',
  components: { Game },
  props: [ 'user' ],
  data () {
    return {
      thisWeeksGames: [],
      gameGroups: [],
      favoriteTeamGame: null,
      currentWeekNumber: null
    }
  },
  methods: {
    fetchData (_currentlyViewedWeek) {
      this.currentWeekNumber = Number(_currentlyViewedWeek)
      let teamsRef = db.collection('teams')
      let gamesRef = db.collection('games').where('week', '==', _currentlyViewedWeek)
      let teams = []
      let games = []
      teamsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let team = doc.data()
          team.id = doc.id
          teams.push(team)
        })
        this.teams = teams
      }).then(() => {
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
            games.push(game)
          })
          this.games = games
        }).then(() => {
          let createGameGroupObject = (_gameGroupName, _gamesArray) => {
            if (_gamesArray.length > 0) {
              let gameGroupObject = { name: _gameGroupName + ' games' }
              gameGroupObject.games = _gamesArray
              return gameGroupObject
            }
          }
          let thursdayGames = []
          let saturdayGames = []
          let sundayEarlyGames = []
          let sundayLateGames = []
          let mondayGames = []
          let favoriteTeamIsPlayingThisWeek = false
          this.games.forEach(game => {
            // TODO-async: Because this.user is a prop coming from App, and it's async,
            //             It's not possible for the user will encounter this line before this.user is populated
            if (game.homeTeamId === this.user.favoriteTeamId || game.awayTeamId === this.user.favoriteTeamId) {
              favoriteTeamIsPlayingThisWeek = true
              this.favoriteTeamGame = game
            }
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
          if (!favoriteTeamIsPlayingThisWeek) {
            this.favoriteTeamGame = null
          }
          let gameGroups = []
          if (thursdayGames.length > 0) {
            gameGroups.push(createGameGroupObject('Thursday', thursdayGames))
          }
          if (saturdayGames.length > 0) {
            gameGroups.push(createGameGroupObject('Saturday', saturdayGames))
          }
          if (sundayEarlyGames.length > 0) {
            gameGroups.push(createGameGroupObject('Sunday early', sundayEarlyGames))
          }
          if (sundayLateGames.length > 0) {
            gameGroups.push(createGameGroupObject('Sunday late', sundayLateGames))
          }
          if (mondayGames.length > 0) {
            gameGroups.push(createGameGroupObject('Monday', mondayGames))
          }
          if (this.favoriteTeamGame) {
            gameGroups.push({name: 'Favorite team game', games: [this.favoriteTeamGame]})
          }
          this.gameGroups = gameGroups
        })
      })
    },
    decrementWeekNumber () {
      return Number(this.$route.params.week_number) - 1
    },
    incrementWeekNumber () {
      return Number(this.$route.params.week_number) + 1
    }
  },
  created () {
    this.fetchData(Number(this.$route.params.week_number))
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchData(to.params.week_number)
    next()
  }
}
</script>

<style>
.game {
  display: flex;
  justify-content: space-between;
}
</style>
