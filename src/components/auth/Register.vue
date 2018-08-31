<template>
  <div>
    <form @submit.prevent="register">
      <h2>Register</h2>
      <div>
        <label for="display-name">Display name</label>
        <input id="display-name" v-model="displayName">
      </div>
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password">
      </div>
      <label for="favorite-team-id">Choose your favorite team:</label>

      <select id="favorite-team-id" v-model="favoriteTeamId">
        <!-- <option value="">--Please choose an option--</option> -->
        <option v-for='team in teams' :key=team.id :value=team.id>{{ team.name }}</option>
      </select>
      <p v-if="feedback">{{ feedback }}</p>
      <div>
        <button>Register</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'Register',
  data () {
    return {
      email: null,
      password: null,
      displayName: null,
      favoriteTeamId: null,
      feedback: null,
      teams: []
    }
  },
  methods: {
    register () {
      if (this.email && this.password && this.displayName && this.favoriteTeamId) {
        this.feedback = null
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(credentials => {
            let firebaseAuthUser = credentials.user
            db.collection('users').add({
              uid: firebaseAuthUser.uid,
              email: this.email,
              displayName: this.displayName,
              favoriteTeamId: this.favoriteTeamId
            })
          })
          .then(() => {
            this.$router.push({ name: 'Landing' })
          })
          .catch(err => {
            this.feedback = err.message
          })
      } else {
        this.feedback = 'Please fill out the form in its entirety so we know who to congratulate'
      }
    }
  },
  created () {
    let ref = db.collection('teams')
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        let team = doc.data()
        team.id = doc.id
        this.teams.push(team)
      })
    })
  }
}
</script>

<style>
</style>
