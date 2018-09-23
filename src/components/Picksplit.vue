<template>
  <div class="picksplit" style="height:65px; max-width:50px;">
    <button style="display:flex; justify-content:space-between; height:65px; background-color:#FCFEFF" @click.stop.prevent='displayPicksplitByName'>
      <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="25" :height="awayBarHeight" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#B1012F"></rect>
        <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">{{ _tribePicks.away.length }}</text>
      </svg>
      <svg width="25" height="65" version="1" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="25" :height="homeBarHeight" transform="rotate(180, 12.5, 32.5) translate(0, 15)" fill="#428FC1"></rect>
        <text x="12.5" y="65" text-anchor="middle" class="text text--handegg-text text--fs-extra-small">{{ _tribePicks.home.length }}</text>
      </svg>
    </button>
    <div :id=calloutId class="callout">
      <div class="callout__content">
        <div class="callout__away-pickers">
          <div v-for='(awayPicker, index) in tribePickNames.away' :key=index class="text">{{ awayPicker }}</div>
        </div>
        <div class="callout__home-pickers">
          <div v-for='(homePicker, index) in tribePickNames.home' :key=index class="text">{{ homePicker }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Picksplit',
  props: [
    '_gameId',
    '_tribePicks',
    '_user',
    '_userNameDictionary'
  ],
  data () {
    return {
      calloutId: 'callout-id-' + this._gameId,
      tribeDisplayNameDictionary: {},
      tribePickNames: {away: [], home: []}
    }
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
    let tribeUsersRef = db.collection('users').where('tribeId', '==', this._user.tribeId).orderBy('score', 'desc')
    let tribeDisplayNameDictionary = {}
    tribeUsersRef.get().then(snapshot => {
      let tribeUsersArray = []
      snapshot.forEach(doc => {
        let tribeUser = doc.data()
        tribeUser.id = doc.id
        tribeUsersArray.push(tribeUser)
        tribeDisplayNameDictionary[tribeUser.uid] = tribeUser.displayName
      })
      this.tribeDisplayNameDictionary = tribeDisplayNameDictionary
    })
  },
  methods: {
    loadPicksplitNames () {
      this._tribePicks.away.forEach(awayTribePick => {
        this.tribePickNames.away.push(this.tribeDisplayNameDictionary[awayTribePick.uid])
      })
      this._tribePicks.home.forEach(homeTribePick => {
        this.tribePickNames.home.push(this.tribeDisplayNameDictionary[homeTribePick.uid])
      })
    },
    displayPicksplitByName (event) {
      let picksAreLoaded = this.tribePickNames.away.length > 0 || this.tribePickNames.home.length > 0
      let openCallout = document.querySelector('#' + this.calloutId)
      if (!picksAreLoaded) {
        this.loadPicksplitNames()
        if (this.tribePickNames.away.length > 0 || this.tribePickNames.home.length > 0) {
          openCallout.classList.toggle('open')
        }
      } else {
        openCallout.classList.toggle('open')
      }
    }
  }
}
</script>
