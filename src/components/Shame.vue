<template>
  <div>
    <Shteam :_shteam=_shame.awayShteam :_shame=_shame :_shpick=_shpick :_user=_user></Shteam>
    <Shteam :_shteam=_shame.homeShteam :_shame=_shame :_shpick=_shpick :_user=_user></Shteam>
  </div>
</template>

<script>
import Shteam from './Shteam'
export default {
  name: 'Shame',
  components: { Shteam },
  props: [
    '_currentlyViewedWeekNumber',
    '_shame',
    '_shpick',
    '_user'
  ],
  data () {
    return { }
  },
  created () {
    console.log('Shame.created', this._shame, this._shpick)
  }
}
</script>
