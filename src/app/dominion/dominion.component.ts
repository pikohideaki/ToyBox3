import { Component, OnInit } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import 'rxjs/add/operator/toPromise';

import { CardProperty } from "./card-property";
import { GameResult } from "./game-result";
import { PlayerName } from "./player-name";
// import { MyFirebaseSubscribeService } from "./my-firebase-subscribe.service";


@Component({
  // providers: [MyFirebaseSubscribeService],
  selector: 'app-dominion',
  templateUrl: './dominion.component.html',
  styleUrls: ['./dominion.component.css']
})
export class DominionComponent implements OnInit {

  dominionApps: {routerLink: string, inService: boolean, title: string, subtitle: string}[] = [
    { routerLink: "/dominion"           , inService: false, title: "Online Game"     , subtitle: "Dominion オンライン対戦", },
    { routerLink: "/dominion/randomizer", inService: true , title: "Randomizer"      , subtitle: "サプライ生成＆ゲーム結果追加", },
    { routerLink: "/dominion/gameresult", inService: true , title: "Game Result List", subtitle: "成績表", },
    { routerLink: "/dominion/cardlist"  , inService: true , title: "Card List"       , subtitle: "カード一覧表", },
    { routerLink: "/dominion/rulebooks" , inService: true , title: "RuleBooks"       , subtitle: "Dominionのルールブック(PDF)", },
    { routerLink: "/dominion/players"   , inService: true , title: "Players"         , subtitle: "プレイヤー一覧", },
    { routerLink: "/dominion/scoring"   , inService: true , title: "Scoring"         , subtitle: "成績表でのスコアのつけ方", },
  ];

  // CardPropertyList    : CardProperty[] = [];
  // DominionSetNameList : string[] = [];
  // GameResultList      : GameResult[] = [];
  // PlayersNameList     : PlayerName[] = [];
  // ScoringList         : number[][] = [];

  constructor(
  //   afDatabase: AngularFireDatabase,
  //   private afDatabaseService: MyFirebaseSubscribeService
  ) {
  //   afDatabase.list( '/data/CardPropertyList' ).subscribe( val => {
  //     this.CardPropertyList = this.afDatabaseService.convertAs( val, "CardPropertyList" );
  //   } );

  //   afDatabase.list( '/data/DominionSetNameList' ).subscribe( val => {
  //     this.DominionSetNameList = this.afDatabaseService.convertAs( val, "DominionSetNameList" );
  //   } );

  //   afDatabase.list( '/data/ScoringList' ).subscribe( val => {
  //     this.ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );
  //     afDatabase.list( '/data/GameResultList' ).subscribe( val => {
  //       this.GameResultList = this.afDatabaseService.convertAs( val, "GameResultList", this.ScoringList );
  //     } );
  //   } );

  //   afDatabase.list( '/data/PlayersNameList' ).subscribe( val => {
  //     this.PlayersNameList = this.afDatabaseService.convertAs( val, "PlayersNameList" );
  //   } );
  }

  ngOnInit() {
  }


}
