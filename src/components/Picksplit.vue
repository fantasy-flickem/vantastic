<template>
  <div class="picksplit" style="position:relative; height:65px;">
    <button style="height:65px; background-color:#FCFEFF" @click='displayPicksplitByName()'>
      <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="25" :height="awayBarHeight" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#B1012F"></rect>
        <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">{{ _tribePicks.away.length }}</text>
      </svg>
      <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="25" :height="homeBarHeight" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#428FC1"></rect>
        <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">{{ _tribePicks.home.length }}</text>
      </svg>
    </button>
    <!-- <div class="callout" style="position:absolute; top:0; right:50%;">
      <div class="text">{{ _tribePicks.away.map(awayPicks => this._userNameDictionary[awayPicks.uid]) }}</div>
      <div class="text">{{ _tribePicks.home.map(homePicks => this._userNameDictionary[homePicks.uid]) }}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'Picksplit',
  props: [ '_tribePicks', '_userNameDictionary' ],
  data () {
    return { }
  },
  computed: {
    totalPicks () {
      return this._tribePicks.away.length + this._tribePicks.home.length
    },
    awayBarHeight () {
      return (this._tribePicks.away.length / this.totalPicks) * 50
    },
    homeBarHeight () {
      return (this._tribePicks.home.length / this.totalPicks) * 50
    }
  },
  created () {
    console.log('Picksplit.created is firing')
  },
  methods: {
    displayPicksplitByName () {
      console.log('displayPicksplitByName', this._tribePicks)
    }
  }
}
</script>
