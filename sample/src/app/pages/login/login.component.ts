import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthenticationService } from '@/_services';
import { UserState } from '@/_models/';

@Component ({ selector: 'app-loggin',templateUrl: 'login.component.html', styleUrls: ['./login.component.css'] })
export class LoginComponent implements OnInit{
    form: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')    
      });
    loading = false;
    submitted = false;
    returnUrl!: string;
    authData = {
        login: '', //'test1@mail.ru',
        password: '' //'test'
    }
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private UserState: UserState
    ) {
        // redirect to home if already logged in
        
    }

    ngOnInit() {
        this.form = this.formBuilder.group(
            {
              username: ['',[Validators.required]],
              password: ['',[Validators.required]]
            }
          )

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    async onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        const objReq: any = this.form.getRawValue()
        // reset alerts on submit

        this.loading = true;
        this.authenticationService.login(objReq)
        // console.log(await this.authenticationService.login(objReq))
        // console.log(objReq)
    }
}