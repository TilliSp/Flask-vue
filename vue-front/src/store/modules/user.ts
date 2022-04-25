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

interface UserLoginInfoI {
  username: string
  id: string
  access_token: string
  role: string
}

class UserState {
  userId = '' //'5fc35fb1f95de0304367d53d'
  role = ''
  username = ''
  token: any = null
  isAuthenticated = false
  userInfo = {
    name: '',
    surname: '',
    type: '',
    username: '',
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
    localStorage.removeItem('user-username')
    this.state.isAuthenticated = false
  }
  setNewUserInfo(userInfo: UserLoginInfoI) {
    this.state.userId = userInfo.id
    this.state.username = userInfo.username
    this.state.role = userInfo.role ?? 0
    this.state.token = userInfo.access_token
    localStorage.setItem('user-token', userInfo.access_token)
    localStorage.setItem('user-username', userInfo.username)
  }
  getUserInfo() {
    console.log(localStorage.getItem('user-username'))
  }
  setToken(token: any) {
    this.state.token = token
    localStorage.setItem('user-token', token)
  }
  setUserInfo(userInfo: any) {
    this.state.userInfo.name = userInfo.name
    this.state.userInfo.username = userInfo.username
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
      console.log('test response: ', response.data)
      if (response.data.ok) {
        await this.actions.fetchLoginUser({
          username: registerObj.username,
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
        this.mutations.setNewUserInfo(response.data)
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
  // getUserRequest() {
  //   const response = UserAPI.getUser(this.state.userId)
  //   this.mutations.setUserInfo(response.data)
  // }
}

export const user = new Module({
  state: UserState,
  getters: UserGetters,
  mutations: UserMutations,
  actions: UserActions
})

export const userMapper = createMapper(user)
