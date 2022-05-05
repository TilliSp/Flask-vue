import { http } from '@/api/httpAxios'
/*import createURLParams from '@/api/datasource/createURLParams.ts'*/

export interface UserRegister {
  username: string
  name: string
  surname?: string
  password: string
  type: string
  customer?: string
}

export interface UserLogin {
  username: string
  password: string
}
export interface UserRequest {
  token: string
}
export interface PasswordChangeI {
  username: string
  passwordOld: string
  password: string
  passwordConfirm: string
}

export default class UserAPI {
  public static async requestPost(method: string, json: any) {
    const token = localStorage.getItem('user-token')
    let headers = {}
    if (token !== null && token.length === 32) {
      headers =  { Authorization: 'Bearer ' + token }
    }
    const result = await http.post(`/${method}`, json, {headers})
    if ('data' in result) {
      return result
      // parse code http FIXME
    }
    return false
  }
  public static register(json: UserRegister) {
    // const data = new FormData()
    // data.append('username', userInfo.username)
    // data.append('psw', userInfo.password)
    // return http.post(`/register`, data)
    return this.requestPost('register', json)
  }
  public static login(json: UserLogin) {
    return this.requestPost('login', json)
  }
  public static checkToken(json: UserRequest) {
    // const data = new FormData()
    // data.append('username', userInfo.username)
    // data.append('token', userInfo.token)
    return this.requestPost(`/req`, json) // TODO
  }
  public static passChange(json: PasswordChangeI) {
    return this.requestPost('passChange', json)
  }
  public static profile() {
    return this.requestPost(`/profile`, {})
  }
}
