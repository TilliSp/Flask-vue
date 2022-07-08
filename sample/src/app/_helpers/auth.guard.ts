import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@/_services/';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import UserAPI from '@/_api/user';

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) {
        //
    }
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.isLoggedIn.pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );
    }
    async checkToken() {
        await UserAPI.checkToken()
          .then((user) => {
            console.log(user);
            this.authService.logged=true;
          })
          .catch(() => {
            this.authService.logout();
          });
      }
  }
  