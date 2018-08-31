<template>
  <div v-if='profile'>
    <form @submit.prevent="updateSettings">
      <h1>SETTINGS for {{ profile.displayName }}</h1>
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="profile.email" disabled>
      </div>
      <div>
        <label for="displayName">Display name</label>
        <input id="displayName" type="text" v-model="profile.displayName">
      </div>
      <p v-if="feedback">{{ feedback }}</p>
      <div>
        <button>Update my settings</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
  name: 'Settings',
  data () {
    return {
      feedback: null,
      profile: null,
      uid: this.$route.params.uid
    }
  },
  created () {
    if (firebase.auth().currentUser.uid === this.$route.params.uid) {
      let ref = db.collection('users')
      ref.where('uid', '==', this.$route.params.uid).limit(1).get()
        .then(snapshot => {
          let profile = null
          // TODO: the forEach here seems expensive. Is there a better way to get data from snapshot?
          snapshot.forEach(_profile => {
            if (!profile) {
              profile = _profile.data()
              profile.id = _profile.id
              this.profile = profile
            }
          })
        })
    }
  },
  methods: {
    updateSettings () {
      if (this.profile.email) {
        this.feedback = null
        db.collection('users').doc(this.profile.id).update({
          displayName: this.profile.displayName,
          email: this.profile.email
        }).then(() => {
          this.$router.push({ name: 'Week', params: { week_number: '1' } })
        }).catch((err) => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'Please enter your email address and password you\'d like to register with'
      }
    }
  }
}
</script>

<style>
</style>
