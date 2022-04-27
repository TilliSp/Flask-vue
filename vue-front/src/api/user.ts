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
  public static register(userInfo: UserRegister) {
    const data = new FormData()
    data.append('username', userInfo.username)
    data.append('psw', userInfo.password)

    return http.post(`/register`, data)
  }
  public static login(userInfo: UserLogin) {
    const data = new FormData()
    data.append('username', userInfo.username)
    data.append('psw', userInfo.password)
    return http.post(`/login`, data)
    //return http.post(`/login`, { ...userInfo })
  }
  public static req(userInfo: UserRequest) {
    const data = new FormData()
    data.append('username', userInfo.username)
    data.append('token', userInfo.token)
    return http.post(`/req`, data)
  }
  public static passChange(userInfo: PasswordChangeI) {
    const data = new FormData()
    data.append('username', userInfo.username)
    data.append('passwordOld', userInfo.passwordOld)
    data.append('password', userInfo.password)
    return http.post(`/passChange`, data)
  }
  public static getUser(idUser: string) {
    return http.get(`/${idUser}`)
  }
  public static editUser(userId: string, userInfo: any) {
    return http.put(`/${userId}`, { ...userInfo })
  }
}
