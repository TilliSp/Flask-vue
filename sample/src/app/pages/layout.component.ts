import { SidebarComponent } from './sidebar-component/sidebar.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  // template: `<router-outlet></router-outlet>`
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {
  @Output() sideBarButtonClicked = new EventEmitter();
  // @ViewChild(SidebarComponent) children!: SidebarComponent;
  ngOnInit(): void {
    var sidebarVars = document.getElementById("container")
    document.documentElement.setAttribute('data-sidebar-toggle', 'show');
    sidebarVars!.setAttribute('data-sidebar-toggle', 'show');
    }
  switchSideBar() {
    // document.documentElement.getAttribute("");
    var sidebarVar = document.getElementById("container")
    var sive = sidebarVar!.getAttribute('data-sidebar-toggle')
    const sidebarTogggle = document.documentElement.getAttribute('data-sidebar-toggle');
    // console.log('sidebarTogggle');    
    if (sive == null || sive == "hide") {
      sidebarVar!.setAttribute('data-sidebar-toggle', "show");
      console.log(sive);
    } else if (sive == "show") {
      sidebarVar!.setAttribute('data-sidebar-toggle', "hide");
      console.log(sive);
    } else {
      sidebarVar!.setAttribute('data-sidebar-toggle', "hide");
    }

    // const sidebarEl = document.getElementById('app-sidebar');
    // const contentEl = document.getElementById('content');
    // const btnNavEl = document.getElementById('btnNav');
    // if (sidebarEl?.classList.contains('col-2')) {
    //   sidebarEl?.classList.remove('col-2');
    //   console.log(1)
    //   contentEl?.classList.remove('col-9');
    //   console.log(2)
    //   sidebarEl?.classList.add('display');
    //   console.log(3)
    //   btnNavEl?.style.setProperty("opacity" ,"1"); 
    // } else {
    //   sidebarEl?.classList.add('col-2');
    //   contentEl?.classList.add('col-9');
    //   sidebarEl?.classList.remove('display');
    //   btnNavEl?.style.removeProperty("opacity");
    // }
  }

  
}
