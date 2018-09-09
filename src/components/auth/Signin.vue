<template>
  <div class="l-content">
    <form @submit.prevent="signin" class="runner">
      <div class="input">
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="Enter your email" v-model="email">
      </div>
      <div class="input" style="margin-top:20px;">
        <input id="password" type="password" placeholder="Aaaaaand your password" v-model="password">
      </div>
      <div v-if="feedback" class="text">{{ feedback }}</div>
      <div class=button__group>
        <button class="button">Enter</button>
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
            this.$router.push({ name: 'Picks', params: { week_number: this.currentWeekNumber } })
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
