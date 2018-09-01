<template>
  <div v-if='user'>
    <form @submit.prevent="updateSettings">
      <h1>SETTINGS for {{ user.displayName }}</h1>
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
  props: [ 'favoriteTeam', 'user' ],
  data () {
    return {
      feedback: null,
      uid: this.$route.params.uid
    }
  },
  methods: {
    updateUid () {
      this.uid = this.$route.params.uid
    },
    updateSettings () {
      if (this.user.displayName) {
        this.feedback = null
        db.collection('users').doc(this.user.id).update({
          displayName: this.user.displayName
        }).then(() => {
          // TODO: push user to the current week
          this.$router.push({ name: 'Week', params: { week_number: '1' } })
        }).catch((err) => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Please enter the name you would like us to chant leading up to your inevitable victory'
      }
    }
  },
  watch: {
    $route: 'updateUid'
  }
}
</script>

<style>
</style>
