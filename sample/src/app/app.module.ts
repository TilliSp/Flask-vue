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
} from './pages';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { UserState } from '@/_models/';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LayoutComponent,
    SidebarComponent,
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
  providers: [UserState],
  bootstrap: [AppComponent],
})
export class AppModule {}
