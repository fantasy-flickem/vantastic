import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Accounting from '@/components/Accounting'
import Landing from '@/components/Landing'
import Leaderboard from '@/components/Leaderboard'
import Register from '@/components/auth/Register'
import Settings from '@/components/Settings'
import Signin from '@/components/auth/Signin'
import Picks from '@/components/Picks'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/accounting/',
      name: 'Accounting',
      component: Accounting,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/weeks/:week_number',
      name: 'Picks',
      component: Picks,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let currentUser = firebase.auth().currentUser
    if (currentUser) {
      next()
    } else {
      next({ name: 'Signin' })
    }
  } else {
    next()
  }
})

export default router
