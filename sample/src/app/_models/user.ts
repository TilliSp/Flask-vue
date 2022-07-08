import UserAPI, {
  UserRegister,
  UserLogin,
} from '@/_api/user';

export interface UserInterface {
  username: string;
  role: any;
  created: any;
  id: 0;
}
export class UserState {
  static userInfo = <UserInterface>{};
  static _isAdmin = false;
  static _isOperator = false;
  // static _isAuth = false;

  static get id(): number {
    return this.userInfo.id;
  }

  static set SET_USER(payload: UserInterface) {
    this.userInfo = payload;
  }
  static DELETE_USER() {
    this.userInfo = <UserInterface>{};
  }
  // public set SET_IS_AUTH(payload: boolean) {
  //   UserState._isAuth = payload;
  // }

  // static setToken(token: string) {
  //   localStorage.setItem('user-token', token);
  //   UserState._isAuth = true;
  // }
  static set setUserInfo(role:any) {
    //this.commit('SET_USER', payload)
    UserState._isAdmin = this.userInfo.role === 4;
    UserState._isOperator = this.userInfo.role === 2;
  }
  public set setTheme(theme: string) {
    localStorage.setItem('theme', theme);
  }
  public get getTheme() {
    return localStorage.getItem('theme') === 'true' || false;
  }
  static get getUserInfo() {
    return this.userInfo;
  }
  public get getIsOperator() {
    return UserState._isOperator;
  }
  public get getIsAdmin() {
    return UserState._isAdmin;
  }
  // public get getIsAuth() {
  //   return UserState._isAuth;
  // }
  
}
