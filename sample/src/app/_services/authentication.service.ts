import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';
import UserAPI, { UserLogin, UserRegister } from '@/_api/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  getLoggedIn() {
    return this.loggedIn.value;
  }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  set logged(status: boolean) {
    this.loggedIn.next(status);
  }
  checkToken(): Promise<boolean> {
    return UserAPI.checkToken().then((bool) => {
      this.loggedIn.next(bool);
      return bool;
    });
  }

  constructor(private router: Router, private alertService: AlertService) {}

  login(loginObj: UserLogin) {
    return UserAPI.login(loginObj)
      .then((response) => {
        if (!this.getLoggedIn()) {
          if (
            Object.keys(response.token).length !== 0 &&
            Object.keys(response.id).length !== 0
          ) {
            // UserState.setUserInfo(response);
            this.loggedIn.next(true);
            // console.log('bef token set!')
            localStorage.setItem('user-token', response.token);
            // console.log('after token set!')
            this.router.navigate(['/']);
            // console.log('bbbbbbbb!')
          }
        } else {
          // ALERT!
          console.log('rrrrrrrrrrrr');
        }
      })
      .catch((err) => {
        // ALERT!
        console.log('ssssssssssssss');
        // this.alertService.error;
        // this.logout();
      });
  }
  fetchRegisterUser(registerObj: UserRegister) {
    return UserAPI.register(registerObj)
      .then((response) => {
        if (response.ok) {
          // localStorage.setItem('username', response.username);
          localStorage.setItem('user-token', response.token);
          this.loggedIn.next(true);
          return true;
        } else {
          console.log('reg');
          this.alertService.error(`REG ERROR: ${JSON.stringify(response)}`);
          return false;
        }
      })
      .catch((err) => {
        console.log('catch');
        this.alertService.error(`CATCH ERROR: ${JSON.stringify(err)}`);
        return false;
      });
  }

  logout() {
    localStorage.removeItem('user-token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
