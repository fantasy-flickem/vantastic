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
        <option value="">--Please choose an option--</option>
        <option v-for='team in teams' :key=team.id :value=team.id>{{ team.name }}</option>
      </select>
      <div>
        <label for="tribe-id">Please enter your tribe's password</label>
        <input id="tribe-id" type="text" v-model="tribeId">
      </div>
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
  props: [ 'currentWeekNumber' ],
  data () {
    return {
      email: null,
      displayName: null,
      favoriteTeamId: null,
      feedback: null,
      password: null,
      teams: [],
      tribeId: null
    }
  },
  methods: {
    register () {
      if (this.email && this.password && this.displayName && this.favoriteTeamId && this.tribeId) {
        this.feedback = null
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(credentials => {
            let firebaseAuthUser = credentials.user
            db.collection('users').add({
              uid: firebaseAuthUser.uid,
              email: this.email,
              displayName: this.displayName,
              favoriteTeamId: this.favoriteTeamId,
              tribeId: this.tribeId
            })
          })
          .then(() => {
            this.$router.push({ name: 'Week', params: { week_number: this.currentWeekNumber } })
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
    let teamsArray = []
    let teamsRef = db.collection('teams')
    teamsRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let team = doc.data()
          team.id = doc.id
          teamsArray.push(team)
        })
        this.teams = teamsArray
      })
  }
}
</script>
