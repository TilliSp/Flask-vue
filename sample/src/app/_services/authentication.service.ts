import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, switchMap, take, first, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AlertService } from './alert.service';
import { UserState } from '@/_models/';
import UserAPI, { UserLogin, UserRegister } from '@/_api/user';
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  getLoggedIn(){
    return this.loggedIn.value;
  }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  set logged(status: boolean){
    this.loggedIn.next(status);
  }

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  async login(loginObj: UserLogin) {
    let response;
    try {
      if (!this.getLoggedIn()) {
        console.log(this.getLoggedIn())
        response = await UserAPI.login(loginObj);
        console.log(response)
        if (
          Object.keys(response.token).length !== 0 &&
          Object.keys(response.id).length !== 0
        ) {          
          // UserState.setUserInfo(response);
          this.loggedIn.next(true);
          console.log('bef token set!')
          localStorage.setItem('user-token', response.token);
          console.log('after token set!')
          this.router.navigate(['/']);
          console.log('bbbbbbbb!')
        }
      }else{
        // ALERT!
      }
    } catch (err) {
      // ALERT!
      this.alertService.error;
      this.logout();
    }
  }
  async fetchRegisterUser(registerObj: UserRegister) {
    try {
      const response = await UserAPI.register(registerObj);
      if (response.ok) {
        localStorage.setItem('user-token', response.token);
        this.loggedIn.next(true);
      }
    } catch (err) {
        // alert
        // this.loggedIn.next(false);
        console.error(err);
    }
  }

  logout() {
    localStorage.removeItem('user-token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
