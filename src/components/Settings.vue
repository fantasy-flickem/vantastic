<template>
  <div v-if='user'>
    <form @submit.prevent="updateSettings">
      <h1>SETTINGS for {{ user.displayName }}</h1>
      <div v-if='this.user.favoriteTeamId'>Your favorite team is {{ this.user.favoriteTeamId }}</div>
      <div v-if='this.user.tribeId'>You belong to {{ this.user.tribeId }}</div>
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="user.email" disabled>
      </div>
      <div>
        <label for="displayName">Display name</label>
        <input id="displayName" type="text" v-model="user.displayName">
      </div>
      <p v-if="feedback">{{ feedback }}</p>
      <div>
        <button>Update my settings</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Settings',
  props: [ 'user' ],
  data () {
    return {
      feedback: null,
      favoriteTeam: null
    }
  },
  methods: {
    updateSettings () {
      if (this.user.displayName) {
        this.feedback = null
        db.collection('users').doc(this.user.id).update({
          displayName: this.user.displayName
        }).then(() => {
          // TODO: push user to the current week
          this.$router.push({ name: 'Week', params: { week_number: 1 } })
        }).catch((err) => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Please enter the name you would like us to chant leading up to your inevitable victory'
      }
    }
  },
  created () {
  }
}
</script>

<style>
</style>
