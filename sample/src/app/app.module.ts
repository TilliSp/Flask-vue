import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import {
  SidebarComponent,
  LayoutComponent,
  LoginComponent,
  RegisterComponent,
  LoginLayoutComponent,
  AlertComponent
} from './pages';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { UserState } from '@/_models/';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { AuthenticationService } from './_services';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LoginLayoutComponent,
    LayoutComponent,
    SidebarComponent,
    AlertComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    FormsModule,
  ],
  providers: [UserState, AuthenticationService, AuthGuard ],
  bootstrap: [AppComponent],
})
export class AppModule {}
