import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '../store'
import { userMapper } from '@/store/modules/user'
import { userModule } from '@/store'

Vue.use(VueRouter)

/*
const ifAuthenticated = (to: any, from: any, next: any) => {
  //if (__user._isAuth){}
  if (!_.isEmpty(token)) {
    store.state.user.isAuthenticated = true
    //store.state.user.getUserRequest(token)
    next()
    return
  }
  //console.log('test ifAuthenticated if elfse: ', token)
  next('/auth')
}
*/

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ '@/views/About.vue')
      },
      {
        path: '/auth',
        name: 'Auth',
        component: () =>
          import(/* webpackChunkName: "main" */ '@/views/Auth.vue')
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () =>
          import(/* webpackChunkName: "books" */ '@/views/Dashboard.vue')
      },
      {
        path: '/registration',
        name: 'Registration',
        component: () =>
          import(
            /* webpackChunkName: "registration" */ '@/views/Registration.vue'
          )
      },
      {
        path: '/test',
        name: 'Test',
        component: () =>
          import(/* webpackChunkName: "test" */ '@/views/Test.vue')
        //beforeEnter: ifAuthenticated
      },
      {
        path: '/profile',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
      },
      {
        path: '/actGenerate',
        name: 'ActGenerate',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/ActGenerate.vue')
      },
      {
        path: '/passwordChange',
        name: 'PasswordChange',
        component: () =>
          import(
            /* webpackChunkName: "passswordChange" */ '@/views/PasswordChange.vue'
          )
        //beforeEnter: ifAuthenticated
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// запрет перехода на страницы пользователей для неавторизованных пользователей
router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('AFTER 1')
    await userModule.actions.checkToken()
    if (!userModule.state._isAuth) {
      next('/auth')
      return
    }
    next()
  } else {
    next()
  }
})

// запрет перехода на страницы входа и регистрации для авторизованных пользователей
router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    console.log('AFTER 2')
    await userModule.actions.checkToken()
    if (userModule.state._isAuth) {
      next('/profile')
      return
    }
    next()
  } else {
    next()
  }
})

export default router
