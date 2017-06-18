import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {

  @Input() AppName: string;
  @Input() Apps: {
          routerLink : string,
          inService  : boolean,
          title      : string,
          subtitle   : string
      }[] = [];

  constructor() { }

  ngOnInit() {
  }

}
