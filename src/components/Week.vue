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
        <div v-for='(game, index) in gameGroup.games' :key='index' class="game">
          <button class="team" @click="makePick(game, game.homeTeamId)">{{ game.homeTeam.name }}</button>
          <button class="team" @click="makePick(game, game.awayTeamId)">{{ game.awayTeam.name }}</button>
        </div>
        <div v-if='favoriteTeamGame' class="game">
          <button class="team" @click="makePick(favoriteTeamGame, favoriteTeamGame.homeTeamId)">{{ favoriteTeamGame.homeTeam.name }}</button>
          <button class="team" @click="makePick(favoriteTeamGame, favoriteTeamGame.homeTeamId)">{{ favoriteTeamGame.homeTeam.name }}</button>
        </div>
      </div>
    </div>
    <div class="stripe">
      <div class="l-footer">
        <router-link :to="{ name: 'Week', params: { week_number: (weekNumber - 1) } }">Previous Week</router-link>
        <router-link :to="{ name: 'Week', params: { week_number: (weekNumber + 1) } }">Next Week</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
export default {
  name: 'Week',
  data () {
    return {
      teams: [],
      games: [],
      favoriteTeamGame: null,
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
    makePick (_game, _teamId) {
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
  created () {
    this.getAllTeams()
    // TODO: this only fires on creation of the component, not on updated data
    this.getCurrentlyViewedWeeksGames(this.weekNumber)
  },
  watch: {
    $route: 'updateCurrentlyViewedWeek'
  }
}
</script>

<style>
.game {
  display: flex;
  justify-content: space-between;
}
</style>
