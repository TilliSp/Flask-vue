import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'profile.component.html',styleUrls: ['./profile.component.css'] })
export class ProfileComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        
    }

    ngOnInit() {
        
    }
}