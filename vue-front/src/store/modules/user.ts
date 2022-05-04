import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module'
import UserAPI, { UserRegister, UserLogin, UserRequest } from '@/api/user.ts'
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
  userReq = {
    username: '',
    role: ''
  }
  isAdmin = false
  isBadAuth = false
  isManager = false
}

/*
class user {
  private boolean: any._isAdmin = false
  private this: boolean._isOperator = false
  private this: boolean._isAuth = false
  constructor(user){
     this.user = user; }
    // get local item
    getItem() {
      let token = localStorage.getItem('user-token')
      //валидацию только на сервере или на клиенте тоже?(profile)
      const tokenF = token||false
      if (tokenF) {
        let tokenInfo = UserAPI.checkToken(token)
        (this._isAdmin,this._isOperator) = user.getRole(tokenInfo.role)
      }
    }
    // check token in local storage `
    // if token is true, get info user / generate role / get avatar
    // this._isAuth = true
    // if token is not true -> this.clearToken()
    // route -> redir /login

    // this.isAuth = true
    // this.role = this.getRole()
    
    
    
  }
  static getRole(role){
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
  rewriteRole(role){
    switch(role){
      case 2:
        this.isOperator = true
        break;
      case 4: 
        this._isAdmin =  true
        this.isOperator = true
        break;
    }
  }
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
*/
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
      this.state.isBadAuth = false
      const response = await UserAPI.login(loginObj)
      if (
        response &&
        !_.isEmpty(response.data.access_token) &&
        !_.isEmpty(response.data.id)
      ) {
        this.mutations.setNewUserInfo(response.data)
        console.log('test response.data: ', response.data)
        this.state.isAuthenticated = true
      }
    } catch (err) {
      localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
      this.state.isAuthenticated = false
      this.state.isBadAuth = true
      console.error(err)
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
        console.log(
          'TEST_TEST response.data: ',
          response.data,
          response.data.access_token
        )
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
