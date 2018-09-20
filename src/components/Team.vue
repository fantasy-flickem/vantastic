<template>
  <button class="button team" :class=teamClasses :disabled=hasStarted @click='selectTeam(_team.id)'>
    <div class="text__list" style="height:50px;" :style='teamTextClasses'>
      <div class="text text--handegg-text text--fs-tiny text--transform-uppercase">{{_team.id}} {{_team.name}}</div>
      <div v-if='_score' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--transform-uppercase">{{_score}}</div>
      <div v-else-if='hasStarted' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--red text--transform-uppercase">Live</div>
      <div v-else class="text text--handegg-text text--fs-hero text--line-height-fs-medium text--transform-uppercase">--</div>
    </div>
    <Logo :_teamId='_team.id' :_isHome='isHome'></Logo>
  </button>
</template>

<script>
import moment from 'moment'
import Logo from './Logo'
export default {
  name: 'Team',
  components: { Logo },
  props: [
    '_game',
    '_myPick',
    '_score',
    '_team'
  ],
  data () {
    return { }
  },
  computed: {
    hasStarted () {
      let gameStartTime = moment(this._game.startTime.seconds * 1000)
      let now = moment()
      return gameStartTime.diff(now) < 0
    },
    isHome () {
      return this._team.id === this._game.homeTeamId
    },
    teamClasses () {
      let teamPickednessClass = ''
      let teamCorrectnessClass = ''
      let teamLocationAdvantageClass = ''
      if (this._myPick && this._myPick.teamId === this._team.id) {
        teamPickednessClass = 'team--is-picked'
        if (this._game.isFinal) {
          teamCorrectnessClass = this._myPick.isCorrect ? 'team--is-correct' : 'team--is-incorrect'
        }
      } else {
        teamPickednessClass = ''
      }
      teamLocationAdvantageClass = this._game.homeTeamId === this._team.id ? 'team--is-home' : 'team--is-away'
      return [
        teamPickednessClass,
        teamCorrectnessClass,
        teamLocationAdvantageClass
      ]
    },
    teamTextClasses () {
      return this.isHome ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }
    }
  },
  methods: {
    selectTeam (_teamId) {
      this.$emit('send-selection', _teamId)
    }
  }
}
</script>
