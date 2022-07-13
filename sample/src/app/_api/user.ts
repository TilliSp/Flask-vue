import { http } from '@/_api/httpAxios';
import { resolve } from 'path';
import {pipe,delay,retry} from 'rxjs'
/*import createURLParams from '@/api/datasource/createURLParams.ts'*/

export interface UserRegister {
  username: string;
  name: string;
  surname?: string;
  password: string;
  type: string;
  customer?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}
export interface UserRequest {
  token: string;
}
export interface PasswordChangeI {
  passwordOld: string;
  password: string;
  passwordConfirm: string;
}

export default class UserAPI {
  // catchError => errorMessage pool -> subscribe to alert 
  /*
   catchError(err => {  
            console.log(err); 
            this.errorMessage = err.message;
            return [];
        }))*/
  public static sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  public static requestPost(method: string, json: any) {
    const token = localStorage.getItem('user-token');
    let headers = {};
    if (token !== null && token.length === 32) {
      headers = { Authorization: 'Bearer ' + token };
    }
    return http
      .post(`/${method}`, json, { headers, timeout: 5000 })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data;
        }
        console.log('REQUEST POST +');
        return Promise.reject(response.status);// {code:response.status}
      })
      .catch((err):any => {
        console.log('REQUEST POST -');
        switch (err.code) {
          case 'ERR_NETWORK':
            // + 503
            console.log('1');
            this.sleep(5000);
            console.log('2');
           // return this.requestPost(method, json);
           break;
        }
        console.log(err.code);

        return err;
      });
  }
  public static register(json: UserRegister) {
    return this.requestPost('register', json);
  }
  public static login(json: UserLogin) {
    return this.requestPost('login', json);
  }
  static checkToken() {
    return this.requestPost(`validation`, { validation: true })
      .then((user) => {
        return 'userInfo' in user;
      })
      .catch(() => {
        return false;
      });
  }
  public static passChange(json: PasswordChangeI) {
    return this.requestPost('passChange', json);
  }
  public static profile() {
    return this.requestPost(`profile`, {});
  }
}
// function sleep(ms: number | undefined) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

