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
  username: string
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
    const result = await http.post(`/${method}`, json)
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
    return http.post('register', json)
  }
  public static login(json: UserLogin) {
    return this.requestPost('login', json)
  }
  public static req(userInfo: UserRequest) {
    const data = new FormData()
    data.append('username', userInfo.username)
    data.append('token', userInfo.token)
    return http.post(`/req`, data)
  }
  public static passChange(json: PasswordChangeI) {
    return http.post('passChange', json)
  }
  public static getUser(idUser: string) {
    return http.get(`/${idUser}`)
  }
  public static editUser(userId: string, userInfo: any) {
    return http.put(`/${userId}`, { ...userInfo })
  }
}