import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { read } from 'fs';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebar', { read: ElementRef }) sidebar!: ElementRef;
  @Output() sideBarButtonClicked = new EventEmitter<boolean>();
  constructor() {}
  document: any;
  switchSideBar(flag: any) {
    // this.sideBarButtonClicked.emit(flag);
    // flag == true 
    //   ? (this.sidebar.nativeElement.style.width = '0')
    //   : (this.sidebar.nativeElement.style.width = '200');
      // this.sideBarButtonClicked.emit();
      const sidebarEl = document.getElementById('app-sidebar');
    const contentEl = document.getElementById('content');
    const btnNavEl = document.getElementById('btnNav');
    const rowEl = document.getElementById('row-class');
    if (sidebarEl?.classList.contains('col-2')) {
      sidebarEl?.classList.remove('col-2');
      console.log(1);
      contentEl?.classList.toggle('col-9');
      // rowEl?.classList.remove('row');
      console.log(2);
      sidebarEl?.classList.add('display');
      console.log(3);
      btnNavEl?.style.setProperty("opacity" ,"1"); 
    } else {
      console.log(4);
    }
  }

  ngOnInit() {}
}
