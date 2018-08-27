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
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.push({ name: 'Week', params: { week_number: '1' } })
          })
          .catch(err => {
            this.feedback = err.message
          })
      }
      else {
        this.feedback = 'Please enter the email and password you\'d like to register with'
      }
    }
  }
}
</script>

<style>
</style>
