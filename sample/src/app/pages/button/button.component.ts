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
  selector: 'app-btn',
  templateUrl: './button.component.html',
  styleUrls: ['../layout.component.scss'],

  // template: '<button class="openbtn" (click)="switchSideBar(false)">☰</button>',
})
export class ButtonComponent implements OnInit {
  @ViewChild('sidebar', { read: ElementRef }) sidebar!: ElementRef;
  @Output() sideBarButtonClicked = new EventEmitter<boolean>();
  constructor() {}
  document: any;
  switchSideBar(event: any) {
    this.sideBarButtonClicked.emit();
  }

  ngOnInit() {}
}
