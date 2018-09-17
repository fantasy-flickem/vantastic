<template>
  <div>
    <button class='button team team--is-home' :class=shclasses @click='selectShteam(_shteam, _shpick)'>{{ _shteam.id }} {{ _shteam.name }}</button>
  </div>
</template>

<script>
export default {
  name: 'Shteam',
  props: [
    '_shame',
    '_shpick',
    '_shteam'
  ],
  data () {
    return { }
  },
  computed: {
    shclasses () {
      let shteamPickednessClass = ''
      let shteamCorrectnessClass = ''
      if (this._shpick && this._shpick.shteamId === this._shteam.id) {
        shteamPickednessClass = 'team--is-picked'
      }
      // if (this._shpick && this._shpick.shteamId === this._shteam.id) {
      //   shteamPickednessClass = 'team--is-picked'
      //   if (this._shame.isFinal) {
      //     this.pick.isCorrect ? shteamCorrectnessClass = 'team--is-correct' : shteamCorrectnessClass = 'team--is-incorrect'
      //   }
      // }
      console.log('shclasses is computing', this._shpick)
      return [
        shteamPickednessClass,
        shteamCorrectnessClass
      ]
    }
  },
  methods: {
    selectShteam (_shteam, _shpick) {
      this._shpick.shteamId = _shteam.id
    }
  }
}
</script>
