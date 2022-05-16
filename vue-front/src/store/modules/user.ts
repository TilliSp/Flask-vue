/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module'

import _ from 'lodash'
import UserAPI, { UserRegister, UserLogin } from '@/api/user'

interface UserInterface {
  username: string
  role: any
  created: any
  id: null
}

class UserState {
  userInfo = {
    username: 'unknown',
    role: 0,
    id: null,
    created: null
  }
  _isAdmin = false
  _isOperator = false
  _isAuth = false
}
class UserGetters extends Getters<UserState> {}

export class UserMutations extends Mutations<UserState> {
  SET_USER(payload: UserInterface) {
    this.state.userInfo = payload
  }
  DELETE_USER() {
    this.state.userInfo = <UserInterface>{}
  }
  SET_IS_AUTH(payload: boolean) {
    this.state._isAuth = payload
  }
}
export class UserActions extends Actions<
  UserState,
  UserGetters,
  UserMutations,
  UserActions
> {
  logOut() {
    localStorage.removeItem('user-token')
    this.state._isAuth = false
  }
  setToken(token: string) {
    localStorage.setItem('user-token', token)
    this.state._isAuth = true // FIX IT
  }
  setUserInfo(payload: UserInterface) {
    this.commit('SET_USER', payload)
    this.state._isAdmin = this.state.userInfo.role === 4
    this.state._isOperator = this.state.userInfo.role === 2
  }
  setTheme(theme: string) {
    localStorage.setItem('theme', theme)
  }
  getTheme() {
    return localStorage.getItem('theme') === 'true' || false
  }
  getUserInfo() {
    return this.state.userInfo
  }
  getIsOperator() {
    return this.state._isOperator
  }
  getIsAdmin() {
    return this.state._isAdmin
  }
  getIsAuth() {
    return this.state._isAuth
  }
  async fetchRegisterUser(registerObj: UserRegister) {
    try {
      const response = await UserAPI.register(registerObj)
      if (response.ok) {
        this.setToken(response.token)
        // TODO SET USERDATA
        this.state._isAuth = true
      }
    } catch (err) {
      this.state._isAuth = false
      console.error(err)
    }
  }
  async fetchLoginUser(loginObj: UserLogin) {
    let response
    try {
      if (!this.state._isAuth) {
        response = await UserAPI.login(loginObj)
        console.log("SLEEEEP:")
        console.log(response)
        if (!_.isEmpty(response.access_token) && !_.isEmpty(response.id)) {
          this.setUserInfo(response)// FIX response.userInfo
          this.state._isAuth = true
          localStorage.setItem('user-token', response.access_token)
          return {ok: true}
        }
      }
    } catch (err) {
      localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
      this.state._isAuth = false
      response = 'Email or password invalid'
    }
    return {ok: false, text: response}
  }
  async checkToken() {
    await UserAPI.checkToken()
    .then((user) => {
      console.log(user)
      //this.setUserInfo(response)
      this.commit('SET_USER', user.userInfo)
      this.state._isAuth = true
    })
    .catch(() => {
      console.log('CATCH')
      this.state._isAuth = false
      localStorage.removeItem('user-token')
    })
  }
  
}

const user = new Module({
  state: UserState,
  getters: UserGetters,
  actions: UserActions,
  mutations: UserMutations
})

export default user

export const userMapper = createMapper(user)
