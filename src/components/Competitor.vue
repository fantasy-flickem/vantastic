<template>
  <div v-if='scoresHaveLoaded'>
    <div>{{ tribeUser.displayName }}</div>
    <div>{{ tribeUser.currentScore }}</div>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Competitor',
  props: [ 'tribeUser' ],
  data () {
    return { }
  },
  computed: {
    scoresHaveLoaded () {
      return Boolean(String(this.tribeUser.currentScore))
    }
  },
  created () {
    let usersCorrectPicksRef = db.collection('picks').where('isCorrect', '==', true)
    usersCorrectPicksRef.where('uid', '==', this.tribeUser.uid).get().then(snapshot => {
      this.tribeUser.currentScore = snapshot.size
    })
  }
}
</script>

<style>
</style>
