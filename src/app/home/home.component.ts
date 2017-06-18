import { Component, OnInit } from '@angular/core';

import { AppListComponent } from "../app-list/app-list.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Apps = [
    {
      routerLink : "/dominion",
      inService  : true,
      title      : "Dominion Apps",
      subtitle   : "サプライ生成＆ゲーム結果追加，成績表，プレイヤー一覧，カード一覧表，ルールブック",
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
