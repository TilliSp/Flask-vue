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

  switchSideBar(event: any) {
    // document.documentElement.getAttribute("");
    const sidebarEl = document.getElementById('app-sidebar');
    const contentEl = document.getElementById('content');
    const btnNavEl = document.getElementById('btnNav');
    if (sidebarEl?.classList.contains('col-2')) {
      sidebarEl?.classList.remove('col-2');
      console.log(1)
      contentEl?.classList.remove('col-9');
      console.log(2)
      sidebarEl?.classList.add('display');
      console.log(3)
    } else {
      sidebarEl?.classList.add('col-2');
      contentEl?.classList.add('col-9');
      sidebarEl?.classList.remove('display');
      btnNavEl?.style.removeProperty("opacity");
    }
  }

  ngOnInit(): void {}
}
