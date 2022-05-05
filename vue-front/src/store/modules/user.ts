import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module'
import UserAPI, { UserRegister, UserLogin, UserRequest } from '@/api/user.ts'
import _ from 'lodash'
import VueRouter, { RouteConfig } from 'vue-router'
import router from '@/router'
import { http } from '@/api/httpAxios'

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
  userReq = {
    username: '',
    role: ''
  }
  isAdmin = false
  isBadAuth = false
  isManager = false
}


export class __user {
  private _isAdmin: boolean = false
  private _isOperator: boolean = false
  private _isAuth: boolean = false
  private _token: any = null
  private _userInfo = {role:0, username: 'unknown'}
  setUserInfo(userInfo: any) {
    userInfo.username = userInfo.username
    userInfo.role = userInfo.role
    userInfo.created = userInfo.created
  }
  clearToken() {
    localStorage.removeItem('user-token')
    this._isAuth = false
  }
  static getRole(role: any){
    let payload = {isAdmin:false,isOperator:false}
    switch(role){
      case 2:
        payload = {isAdmin:false,isOperator:true}
      break;
      case 4:
        payload = {isAdmin:true,isOperator:true}
      break;
    }
    return payload
  }
  constructor() {
     
  }
    // get local item
    getItem( tokenObj : UserRequest) {
     
        let tokenInfo = UserAPI.checkToken(this._token)
        if (tokenInfo) {
          const userInfo = JSON.parse(tokenInfo)
          this.setUserInfo(userInfo)
          this._isAuth = true
          let result = __user.getRole(userInfo.role)
          this._isAdmin = result.isAdmin // FIX
          this._isOperator = result.isOperator
        }else{ 
      this.clearToken()}
    }
    // check token in local storage `
    // if token is true, get info user / generate role / get avatar
    // this._isAuth = true
    // if token is not true -> this.clearToken()
    // route -> redir /login
  isAdmin(){
    return this._isAdmin;
  }
  isOperator(){
    return this._isOperator;
  }
  isAuth(){
    return this._isAuth;
  }
  
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
    this.state.isAdmin = this.state.role === '4'
    this.state.isManager = this.state.role === '2'
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
  setUserReq(userInfo: UserLoginInfoI) {
    this.state.username = userInfo.username
    this.state.userId = userInfo.id
    this.state.role = userInfo.role
    this.state.token = userInfo.access_token
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
      if (!this.state.isAuthenticated) {
        const isToken = !!localStorage.getItem('user-token')
        this.state.isBadAuth = false
        let response = null
        if (isToken) {
          response = await UserAPI.getUserByToken(loginObj)
        } else {
          response = await UserAPI.login(loginObj)
        }
        //const response = isToken ? await UserAPI.getUserByToken(loginObj) : await UserAPI.login(loginObj)
        if (!_.isEmpty(response.data.accesstoken) && !.isEmpty(response.data.id)) {
          this.mutations.setNewUserInfo(response.data)
          console.log('test response.data: ', response.data, response.data.access_token)
          if (!isToken) {
            const token = localStorage.getItem('user-token')
            if (token) {
              http.defaults.headers.common['Authorization'] = 'Bearer ' + token
            }
          }
          this.state.isAuthenticated = true
        }
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
  async getUserRequest() {
    try {
      const reqObj: any = {
        username: localStorage.getItem('user-username'),
        token: localStorage.getItem('user-token')
      }
      const response = await UserAPI.req(reqObj) //token+username
      if (
        !_.isEmpty(response.data.access_token) &&
        !_.isEmpty(response.data.id)// FIX
      ) {
        this.mutations.setUserReq(response.data)        
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
}

export const user = new Module({
  state: UserState,
  getters: UserGetters,
  mutations: UserMutations,
  actions: UserActions
})
export const userMapper = createMapper(user)

