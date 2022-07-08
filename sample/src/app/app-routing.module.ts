import { AppComponent } from './app.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent,ProfileComponent,RegisterComponent, LoginLayoutComponent,SidebarComponent, videoPanel, actFormComponent} from './pages';
import { AuthGuard } from '@/_helpers';


export const routes: Routes = [
  
  { path: 'home', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'video', component: videoPanel },
  { path: 'actform', component: actFormComponent },
  { path: 's', component: SidebarComponent },
  { path: 'app', component: AppComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

const config: ExtraOptions = {};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
