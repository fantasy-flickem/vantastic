<template>
  <div class="text__row text__row--spaced-padding-1" style="margin-right:20px; margin-left:20px;">
    <div class="text">{{ competitor.displayName }}</div>
    <div class="text">{{ competitor.score }}</div>
  </div>
</template>

<script>
export default {
  name: 'Competitor',
  props: [ 'competitor' ],
  data () {
    return { }
  },
  computed: {
  },
  created () {
  }
}
</script>
