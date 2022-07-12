import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'
// import { SidebarComponent } from './pages';
@Component({
  selector: 'app-root',
  //templateUrl: 'app.component.html',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    
  }
}
