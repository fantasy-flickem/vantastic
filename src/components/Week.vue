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
            <!-- <Game v-for='(game, index) in gameGroup.games' :key='index' :game=game class="game"></Game> -->
          </div>
        </div>
      </div>
      <!-- <div>
        <div v-if='favoriteTeamGame' class="game">
          <button class="team" @click="makePick(favoriteTeamGame, favoriteTeamGame.homeTeamId, true)">{{ favoriteTeamGame.homeTeam.name }}</button>
          <button class="team" @click="makePick(favoriteTeamGame, favoriteTeamGame.awayTeamId, true)">{{ favoriteTeamGame.awayTeam.name }}</button>
        </div>
      </div> -->
    </div>
    <div class="stripe">
      <div class="l-footer">
        <router-link :to="{ name: 'Week', params: { week_number: (currentWeekNumber - 1) } }">Previous Week</router-link>
        <router-link :to="{ name: 'Week', params: { week_number: (currentWeekNumber + 1) } }">Next Week</router-link>
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
  components: {Game},
  props: [ 'user' ],
  data () {
    return {
      thisWeeksGames: [],
      gameGroups: [],
      favoriteTeamGame: null,
      currentWeekNumber: Number(this.$route.params.week_number)
    }
  },
  methods: {
    fetchData (_currentlyViewedWeek) {
      this.currentWeekNumber = _currentlyViewedWeek
      console.log('fetchData is firing', this.user)
      let teamsRef = db.collection('teams')
      let gamesRef = db.collection('games')
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
          // TODO How often does the computed property run (and do a forEach on all games for the day)?
          this.games.forEach(game => {
            if (game.id === this.user.favoriteTeamId) {
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
          let gameGroups = []
          thursdayGames.length > 0
            ? gameGroups.push(createGameGroupObject('Thursday', thursdayGames))
            : console.log('There are no thursdayGames')
          saturdayGames.length > 0
            ? gameGroups.push(createGameGroupObject('Saturday', saturdayGames))
            : console.log('There are no saturdayGames')
          sundayEarlyGames.length > 0
            ? gameGroups.push(createGameGroupObject('Sunday early', sundayEarlyGames))
            : console.log('There are no sundayEarlyGames')
          sundayLateGames.length > 0
            ? gameGroups.push(createGameGroupObject('Sunday late', sundayLateGames))
            : console.log('There are no sundayLateGames')
          mondayGames.length > 0
            ? gameGroups.push(createGameGroupObject('Monday', mondayGames))
            : console.log('There are no mondayGames')
          this.gameGroups = gameGroups
          console.log('fetchData is done fetching', this.gameGroups)
        })
      })
    }
  },
  created () {
    this.fetchData(Number(this.$route.params.week_number))
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchData(Number(this.$route.params.week_number))
    next()
  }
  // watch: {
  //   $route: 'updateCurrentlyViewedWeek'
  // }
}
</script>

<style>
.game {
  display: flex;
  justify-content: space-between;
}
</style>
