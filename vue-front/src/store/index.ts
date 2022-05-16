import { Module, createStore, createMapper } from 'vuex-smart-module'

import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'

Vue.use(Vuex)

const root = new Module({
  modules: {
    user
  }
})

const store = createStore(root)

export default store

export const userModule = user.context(store)

export const userMapper = createMapper(user)
