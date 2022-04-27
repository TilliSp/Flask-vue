import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '../store'
import _ from 'lodash'
import { userMapper } from '@/store/modules/user'

const Mapper = Vue.extend({
  methods: {
    ...userMapper.mapActions(['getUserRequest'])
  }
})
Vue.use(VueRouter)

const ifAuthenticated = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('user-token')
  if (!_.isEmpty(token)) {
    store.state.user.isAuthenticated = true
    //store.state.user.getUserRequest(token)
    next()
    return
  }
  //console.log('test ifAuthenticated if elfse: ', token)
  next('/auth')
}

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
        path: '/lorem',
        name: 'Lorem',
        component: () =>
            import(/* webpackChunkName: "lorem" */ '@/views/Lorem.vue')
      },
      {
        path: '/auth',
        name: 'MainPage',
        component: () =>
            import(/* webpackChunkName: "main" */ '@/views/MainPage.vue'),
      },
      {
        path: '/registration',
        name: 'Registration',
        component: () =>
          import(/* webpackChunkName: "registration" */ '@/views/Registration.vue')
      },
      {
        path: '/books',
        name: 'Books',
        component: () =>
          import(/* webpackChunkName: "books" */ '@/views/Books.vue'),
        beforeEnter: ifAuthenticated
      },
      {
        path: '/test',
        name: 'Test',
        component: () =>
          import(/* webpackChunkName: "test" */ '@/views/Test.vue'),
        beforeEnter: ifAuthenticated
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/Profile.vue'),
        beforeEnter: ifAuthenticated
      },
      {
        path: '/passwordChange',
        name: 'PasswordChange',
        component: () =>
          import(
            /* webpackChunkName: "passswordChange" */ '@/views/PasswordChange.vue'
          ),
        beforeEnter: ifAuthenticated
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
