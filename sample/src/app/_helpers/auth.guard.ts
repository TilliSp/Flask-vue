import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '@/_services/';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.authService.checkToken().then((bool)=>{
      if(!bool){this.authService.logout();}
    })
    /*
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          console.log('isLoggedIn:');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );*/
    return true
  }
}
