import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { AlertService, UserService, AuthenticationService } from '@/_services';
import { UserState } from '@/_models';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    // firstName: new FormControl(''),
    // lastName: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  loading = false;
  submitted = false;
  returnUrl!: string;
  authData = {
    login: '', //'test1@mail.ru',
    password: '', //'test'
    passwordConfirm: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private UserState: UserState
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  async registrationClick() {
    const objReq: any = {
      username: this.authData.login,
      password: this.authData.password,
    };
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    console.log('1');
    // stop here if form is invalid
    console.log('2');
    if (this.registerForm.invalid) {
      return;
    }
    console.log('3');
    const objReq: any = this.registerForm.getRawValue();
    console.log('4');
    console.log(objReq);
    // reset alerts on submit
    this.alertService.clear();

    this.loading = true;
    await this.authenticationService.fetchRegisterUser(objReq)
    .then(()=>{

    })
    // console.log(await this.authenticationService.fetchRegisterUser(objReq));
    // console.error();
    
  }
}

// this.userService.register(this.registerForm.value)
//     .pipe(first())
//     .subscribe(
//         data => {
//             this.alertService.success('Registration successful', true);
//             this.router.navigate(['/login']);
//         },
//         error => {
//             this.alertService.error(error);
//             this.loading = false;
//         });
