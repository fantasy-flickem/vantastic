<template>
  <div class="l-content" style="margin-bottom:50px;">
    <div class="runner" style="padding-bottom:20px;">
      <div v-if='isFetchingData' style="height:100vh">
      </div>
      <div v-else v-for='(gameGroup, index) in gameGroups' :key='index' class="game__group">
        <div class="text text--handegg-text text--fs-medium text--transform-uppercase text--align-center" style="padding:10px 0;">{{ gameGroup.name }}</div>
        <Game v-for='(gameObject, index) in gameGroup.gameObjects' :key='index' :_game='gameObject.game' :_myPick='gameObject.myPick' :_tribePicks='gameObject.tribePicks' :_user='user' :_userNameDictionary='userNameDictionary' :_currentlyViewedWeekNumber='currentlyViewedWeekNumber' :_isFavoriteTeamGame='gameGroup.name === "Favorite team game"'></Game>
      </div>
    </div>
    <div class="l-footer">
      <div class="button__group button__group--horizontal" style="margin-top:0;">
        <router-link v-if='currentlyViewedWeekNumber > 1' :to="{ name: 'Picks', params: { week_number: (decrementWeekNumber()) } }" class="button button--previous-week">Previous Week</router-link>
        <div class="l-absolute-center-input dot">
          <div class="text text--fw-bold text--line-height-input-height">{{ currentlyViewedWeekNumber }}</div>
        </div>
        <router-link v-if='currentlyViewedWeekNumber < 17' :to="{ name: 'Picks', params: { week_number: (incrementWeekNumber()) } }" class="button button--next-week">Next Week</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import Game from './Game'
export default {
  name: 'Picks',
  components: { Game },
  props: [ 'user' ],
  data () {
    return {
      currentlyViewedWeekNumber: null,
      // favoriteTeamGame: null,
      gameGroups: [],
      isFetchingData: true,
      thisWeeksGames: [],
      userNameDictionary: {}
    }
  },
  methods: {
    fetchData (_currentlyViewedWeek) {
      this.isFetchingData = true
      this.currentlyViewedWeekNumber = Number(_currentlyViewedWeek)
      let tribeId = this.user ? this.user.tribeId : 'testTribe'
      let teamsRef = db.collection('teams')
      let gamesRef = db.collection('games').where('week', '==', _currentlyViewedWeek)
      let usersRef = db.collection('users').where('tribeId', '==', tribeId)
      let games = []
      let teams = []
      let teamIdsArray = []
      teamsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          let team = doc.data()
          team.id = doc.id
          teamIdsArray.push(team.id)
          teams.push(team)
        })
        this.teams = teams
        return teamIdsArray
      }).then(_teamIdsArray => {
        usersRef.get().then(snapshot => {
          snapshot.forEach(doc => {
            let user = doc.data()
            user.id = doc.id
            this.userNameDictionary[user.uid] = user.displayName
          })
          return _teamIdsArray
        }).then(_teamIdsArray => {
          gamesRef.get().then(snapshot => {
            snapshot.forEach(doc => {
              let game = doc.data()
              game.id = doc.id
              if (!game.homeTeam && !game.awayTeam) {
                if (!game.homeTeam) {
                  let homeTeamIndex = _teamIdsArray.indexOf(game.homeTeamId)
                  game.homeTeam = this.teams[homeTeamIndex]
                }
                if (!game.awayTeam) {
                  let awayTeamIndex = _teamIdsArray.indexOf(game.awayTeamId)
                  game.awayTeam = this.teams[awayTeamIndex]
                }
              }
              games.push(game)
            })
            return games
          }).then(_games => {
            var promises = []
            let picksRef = db.collection('picks').where('tribeId', '==', this.user.tribeId)
            let gameObjects = []
            _games.forEach(game => {
              let gameObject = { game: game }
              gameObjects.push(gameObject)
            })
            gameObjects.forEach(gameObject => {
              gameObject.tribePicks = []
              promises.push(
                picksRef.where('gameId', '==', gameObject.game.id).get().then(snapshot => {
                  snapshot.forEach(doc => {
                    let pick = doc.data()
                    pick.id = doc.id
                    if (pick.uid === this.user.uid) {
                      gameObject.myPick = pick
                      gameObject.tribePicks.push(pick)
                    } else {
                      gameObject.tribePicks.push(pick)
                    }
                  })
                }).then(() => {
                  return gameObject
                })
              )
            })
            Promise.all(promises).then(values => {
              return gameObjects
            }).then(_gameObjects => {
              let createGameGroupObject = (_gameGroupName, _gameGroupArray) => {
                if (_gameGroupArray.length > 0) {
                  let gameGroupObject = { name: _gameGroupName + ' games' }
                  gameGroupObject.gameObjects = _gameGroupArray
                  return gameGroupObject
                }
              }
              let thursdayGames = []
              let saturdayGames = []
              let sundayEarlyGames = []
              let sundayLateGames = []
              let mondayGames = []
              // let favoriteTeamIsPlayingThisWeek = false
              _gameObjects.forEach(gameObject => {
                // if (gameObject.game.homeTeamId === this.user.favoriteTeamId || gameObject.game.awayTeamId === this.user.favoriteTeamId) {
                //   favoriteTeamIsPlayingThisWeek = true
                //   this.favoriteTeamGame = gameObject.game
                // }
                let startTime = gameObject.game.startTime.seconds * 1000
                let gameDay = moment(startTime).format('dddd')
                switch (gameDay) {
                  case 'Thursday':
                    thursdayGames.push(gameObject)
                    break
                  case 'Saturday':
                    saturdayGames.push(gameObject)
                    break
                  case 'Sunday':
                    if (Number(moment(startTime).format('kk')) < 14) {
                      sundayEarlyGames.push(gameObject)
                    } else {
                      sundayLateGames.push(gameObject)
                    }
                    break
                  case 'Monday':
                    mondayGames.push(gameObject)
                    break
                  default:
                    break
                }
              })
              // if (!favoriteTeamIsPlayingThisWeek) {
              //   this.favoriteTeamGame = null
              // }
              let gameGroups = []
              if (thursdayGames.length > 0) { gameGroups.push(createGameGroupObject('Thursday', thursdayGames)) }
              if (saturdayGames.length > 0) { gameGroups.push(createGameGroupObject('Saturday', saturdayGames)) }
              if (sundayEarlyGames.length > 0) { gameGroups.push(createGameGroupObject('Sunday early', sundayEarlyGames)) }
              if (sundayLateGames.length > 0) { gameGroups.push(createGameGroupObject('Sunday late', sundayLateGames)) }
              if (mondayGames.length > 0) { gameGroups.push(createGameGroupObject('Monday', mondayGames)) }
              // if (this.favoriteTeamGame) { gameGroups.push({name: 'Favorite team game', games: [this.favoriteTeamGame]}) }
              this.gameGroups = gameGroups
              console.log('gameGroups', this.gameGroups)
              this.isFetchingData = false
            })
          })
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
