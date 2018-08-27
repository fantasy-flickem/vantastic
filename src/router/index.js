import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Landing from '@/components/Landing'
import Leaderboard from '@/components/Leaderboard'
import Picks from '@/components/Picks'
import Settings from '@/components/Settings'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/picks',
      name: 'Picks',
      component: Picks
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard
    },
    {
      path: '/settings/:user_id',
      name: 'Settings',
      component: Settings
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let currentUser = firebase.auth().currentUser
    if (currentUser) {
      next()
    }
    else {
      next({ name: 'Signin' })
    }
  }
  else {
    next()
  }
})

export default router
