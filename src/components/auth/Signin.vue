<template>
  <div>
    <form @submit.prevent="signin">
      <h2>Signin</h2>
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
        <button>Signin</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Signin',
  props: [ 'currentWeekNumber' ],
  data () {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    signin () {
      if (this.email && this.password) {
        this.feedback = null
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.push({ name: 'Week', params: { week_number: this.currentWeekNumber } })
          })
          .catch(err => {
            this.feedback = err.message
          })
      } else {
        this.feedback = 'Please enter your email and password to sign in'
      }
    }
  }
}
</script>

<style>
</style>
