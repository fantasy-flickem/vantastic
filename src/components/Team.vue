<template>
  <button v-if=_isHome class="button team team--home" :class="{ 'team--is-picked': _isPicked, 'team--is-correct': _isCorrect, 'team--is-incorrect': _isIncorrect }">
    <div class="text__list" style="align-items:flex-start; height:50px;">
      <div class="text text--handegg-text text--fs-tiny text--transform-uppercase">{{_team.id}} {{_team.name}}</div>
      <div v-if='_score' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--transform-uppercase">{{_score}}</div>
      <div v-else-if='_hasStarted' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--red text--transform-uppercase">Live</div>
      <div v-else class="text text--handegg-text text--fs-hero text--line-height-fs-medium text--transform-uppercase">--</div>
    </div>
    <Logo :_teamId='_team.id' :_isHome='_isHome'></Logo>
  </button>
  <button v-else class="button team team--away" :class="{ 'team--is-picked': _isPicked, 'team--is-correct': _isCorrect, 'team--is-incorrect': _isIncorrect }">
    <Logo :_teamId='_team.id' :_isHome='_isHome'></Logo>
    <div class="text__list" style="align-items:flex-end; height:50px; margin-left:50px;">
      <div class="text text--handegg-text text--fs-tiny text--transform-uppercase">{{_team.id}} {{_team.name}}</div>
      <div v-if='_score' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--transform-uppercase">{{_score}}</div>
      <div v-else-if='_hasStarted' class="text text--handegg-text text--fs-hero text--line-height-fs-mega-large text--red text--transform-uppercase">Live</div>
      <div v-else class="text text--handegg-text text--fs-hero text--line-height-fs-medium text--transform-uppercase">--</div>
    </div>
  </button>
</template>

<script>
import Logo from './Logo'
export default {
  name: 'Team',
  components: { Logo },
  props: [
    '_hasStarted',
    '_isCorrect',
    '_isHome',
    '_isIncorrect',
    '_isPicked',
    '_score',
    '_team'
  ],
  data () {
    return { }
  },
  created () {
    console.log('Team.created is firing', this._team)
  }
}
</script>
