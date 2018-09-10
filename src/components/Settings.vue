<template>
  <div v-if="user" class="l-content">
    <form @submit.prevent="updateSettings" class="runner">
      <div class="text text--fs-large text--fw-bold text--align-center" style="margin-top:10px">Settings</div>
      <div class="input" style="margin-top:20px;">
        <label for="displayName">Display name</label>
        <input id="displayName" type="text" v-model="user.displayName">
      </div>
      <div v-if="feedback" class="text" style="margin-top:20px; margin-left:20px;">{{ feedback }}</div>
      <!-- TODO Add group password to settings -->
      <!-- <div v-if='this.user.tribeId'>You belong to {{ this.user.tribeId }}</div> -->
      <!-- TODO Add current record to settings -->
      <!-- TODO Add edit password (nav?) to settings -->
      <!-- TODO Add favorite team logo to settings -->
      <div v-if="this.user.favoriteTeamId">
        <div class="text text--fs-mega-small text--fw-regular" style="margin-top:20px; margin-left:20px;">Favorite team</div>
        <div class="text" style="padding:10px 20px 0;">{{ this.user.favoriteTeamId }}</div>
      </div>
      <div class="button__group button__group--vertical">
        <button class="button">Update my settings</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'Settings',
  props: [ 'currentWeekNumber', 'user' ],
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
          this.$router.push({ name: 'Picks', params: { week_number: this.currentWeekNumber } })
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
