import Vue from 'vue'
import Vuex from 'vuex'
import { user } from '@/store/modules/user'

import { Module, createStore } from 'vuex-smart-module'

Vue.use(Vuex)

const root = new Module({
  modules: {
    user
  }
})

export default createStore(root)
