<template>
  <div class="l-content">
    <form @submit.prevent="signin" class="runner">
      <div class="text text--fs-large text--fw-bold text--align-center" style="margin-top:10px">Sign in</div>
      <div class="input" style="margin-top:20px">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email">
      </div>
      <div class="input" style="margin-top:20px;">
        <label for="email">Password</label>
        <input id="password" type="password" v-model="password">
      </div>
      <div v-if="feedback" class="text" style="margin-top:20px; margin-left:20px;">{{ feedback }}</div>
      <div class="button__group button__group--vertical">
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
