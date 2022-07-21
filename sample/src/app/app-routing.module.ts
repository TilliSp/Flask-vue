import { validate } from 'json-schema';
import { AppComponent } from './app.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  LoginComponent,
  ProfileComponent,
  RegisterComponent,
  LayoutComponent,
  LoginLayoutComponent,
  SidebarComponent,
  videoPanel,
  actFormComponent,
} from './pages';
import { AuthGuard } from '@/_helpers';
import UserAPI from './_api/user';
import { AuthenticationService } from './_services';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
       { path: 'home', component: ProfileComponent },
       { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'video', component: videoPanel
      // ,canActivate: [AuthGuard] 
    },
      { path: 'actform', component: actFormComponent,
      // canActivate: [AuthGuard] 
    },
    ],
  },
  
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

const config: ExtraOptions = {};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(authService: AuthenticationService) {
    setInterval((()=>{
      // check loggedin ? if false -> clear set interval
      authService.validator()
      // console.log("___@;;") 
    }),10000)
  }
}
