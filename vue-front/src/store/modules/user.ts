import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module'
import UserAPI, { UserRegister, UserLogin } from '@/api/user.ts'
import { http } from '@/api/httpAxios'
import _ from 'lodash'

class UserState {
  userId = '' //'5fc35fb1f95de0304367d53d'
  token: any = null
  isAuthenticated = false
  userInfo = {
    name: '',
    surname: '',
    type: '',
    email: '',
    customer: ''
  }
  isAdmin = false
  isBadAuth = false
}

class UserGetters extends Getters<UserState> {
  // TODO
}

class UserMutations extends Mutations<UserState> {
  // TODO
  logOut() {
    console.log('test logout')
    localStorage.removeItem('user-token')
    this.state.isAuthenticated = false
  }
  setNewUserId(id: string) {
    this.state.userId = id
  }
  setToken(token: any) {
    this.state.token = token
    localStorage.setItem('user-token', token)
  }
  setUserInfo(userInfo: any) {
    this.state.userInfo.name = userInfo.name
    this.state.userInfo.email = userInfo.email
    this.state.userInfo.customer = userInfo.customer
    this.state.userInfo.type = userInfo.type
    this.state.userInfo.surname = userInfo.surname
  }
}

class UserActions extends Actions<
  UserState,
  UserGetters,
  UserMutations,
  UserActions
> {
  async fetchRegisterUser(registerObj: UserRegister) {
    try {
      const response = await UserAPI.register(registerObj)
      //this.mutations.setNewUserId(response.data.id)
      console.log('test response: ',response.data)
      if (response.data.ok) {
        await this.actions.fetchLoginUser({
          email: registerObj.email,
          password: registerObj.password
        })
      }
    } catch (err) {
      this.state.isAuthenticated = false
      console.error(err)
    }
  }
  async fetchLoginUser(loginObj: UserLogin) {
    try {
      this.state.isBadAuth = false
      const response = await UserAPI.login(loginObj)
      if (!_.isEmpty(response.data.access_token) && !_.isEmpty(response.data.id)) {
        this.mutations.setToken(response.data.access_token)
        this.mutations.setNewUserId(response.data.id)
        console.log('test response.data: ', response.data, response.data.access_token)
        const token = localStorage.getItem('user-token')
        if (token) {
          http.defaults.headers.common['Authorization'] = 'Bearer ' + token
        }
        this.state.isAuthenticated = true
      }
    } catch (err) {
      localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
      this.state.isAuthenticated = false
      if (err.response.status === 401) {
        this.state.isBadAuth = true
      } else {
        console.error(err)
      }
    }
  }
  async fetchGetUser() {
    try {
      const response = await UserAPI.getUser(this.state.userId)
      this.mutations.setUserInfo(response.data)
    } catch (err) {
      localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
      this.state.isAuthenticated = !!localStorage.getItem('user-token')
      console.error(err)
    }
  }
}

export const user = new Module({
  state: UserState,
  getters: UserGetters,
  mutations: UserMutations,
  actions: UserActions
})

export const userMapper = createMapper(user)
