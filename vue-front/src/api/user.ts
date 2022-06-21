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
  passwordOld: string
  password: string
  passwordConfirm: string
}

export default class UserAPI {
  public static async requestPost(method: string, json: any) {
    const token = localStorage.getItem('user-token')
    let headers = {}
    if (token !== null && token.length === 32) {
      headers = { Authorization: 'Bearer ' + token }
    }
    return await http.post(`/${method}`, json, { headers }).then(response => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }
  public static register(json: UserRegister) {
    return this.requestPost('register', json)
  }
  public static login(json: UserLogin) {
    return this.requestPost('login', json)
  }
  static async checkToken() {
    return await this.requestPost(`validation`, { validation: true })
  }
  public static passChange(json: PasswordChangeI) {
    return this.requestPost('passChange', json)
  }
  public static profile() {
    return this.requestPost(`profile`, {})
  }
}
