<template>
  <div>
    <h1>PICKS</h1>
    <h3>Games</h3>
    <div v-for='gameGroup in week.gameGroups' :key='gameGroup.id'>
      <div v-for='game in gameGroup.games' :key='game.id'>
        <div>{{ game.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Picks',
  data () {
    return {
      week: {
        gameGroups: [
          {
            id: '1',
            games: [
              {
                id: '1',
                name: 'A vs. B'
              },
              {
                id: '2',
                name: 'A vs. C'
              },
              {
                id: '3',
                name: 'B vs. A'
              },
              {
                id: '4',
                name: 'B vs. C'
              },
              {
                id: '5',
                name: 'C vs. A'
              },
              {
                id: '6',
                name: 'C vs. B'
              }
            ]
          },
          {
            id: '2',
            games: [
              {
                id: '7',
                name: 'D vs. E'
              },
              {
                id: '8',
                name: 'E vs. D'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
