<template>
  <div>
    <form @submit.prevent="register">
      <h2>Register</h2>
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password">
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
  data () {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    register () {
      if (this.email && this.password) {
        this.feedback = null
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(credentials => {
            let firebaseAuthUser = credentials.user
            db.collection('users').add({
              uid: firebaseAuthUser.uid,
              email: this.email,
              displayName: null
              // favoriteTeam: this.favoriteTeam
            })
          })
          .then(() => {
            this.$router.push({ name: 'Landing' })
          })
          .catch(err => {
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
