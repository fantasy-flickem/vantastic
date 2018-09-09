<template>
  <div>
    <div>{{ competitor.displayName }}</div>
    <div>{{ competitor.score }}</div>
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
