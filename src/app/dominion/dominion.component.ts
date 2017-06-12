import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import 'rxjs/add/operator/toPromise';

import { CardProperty } from "./card-property";
import { GameResult } from "./game-result";
import { PlayerName } from "./player-name";
import { MyFirebaseSubscribeService } from "./my-firebase-subscribe.service";


@Component({
  providers: [MyFirebaseSubscribeService],
  selector: 'app-dominion',
  templateUrl: './dominion.component.html',
  styleUrls: ['./dominion.component.css']
})
export class DominionComponent implements OnInit {

  dominionApps: {address: string, inService: boolean, title: string, subtitle: string}[] = [
    { address: "/dominion/randomizer", inService: true , title: "Randomizer"      , subtitle: "サプライ生成＆ゲーム結果追加", },
    { address: "/dominion/gameresult", inService: true , title: "Game Result List", subtitle: "成績表", },
    { address: "/dominion"           , inService: false, title: "Scoring"         , subtitle: "成績表でのスコアのつけ方を設定", },
    { address: "/dominion/players"   , inService: true , title: "Players"         , subtitle: "プレイヤー一覧", },
    { address: "/dominion/cardlist"  , inService: true , title: "Card List"       , subtitle: "カード一覧表", },
    { address: "/dominion/rulebooks" , inService: true , title: "RuleBooks"       , subtitle: "Dominionのルールブック(PDF)", },
    { address: "/dominion"           , inService: false, title: "Online"          , subtitle: "Dominion オンライン対戦", },
  ];

  CardPropertyList    : CardProperty[] = [];
  DominionSetNameList : string[] = [];
  GameResultList      : GameResult[] = [];
  PlayersNameList     : PlayerName[] = [];
  ScoringList         : number[][] = [];


  constructor(
      FDB: AngularFireDatabase,
      private FDBservice: MyFirebaseSubscribeService
  ) {

    FDB.list( '/data/CardPropertyList' ).subscribe( val => {
      this.CardPropertyList = this.FDBservice.convertAs( val, "CardPropertyList" );
    } );

    FDB.list( '/data/DominionSetNameList' ).subscribe( val => {
      this.DominionSetNameList = this.FDBservice.convertAs( val, "DominionSetNameList" );
    } );

    FDB.list( '/data/GameResultList' ).subscribe( val => {
      this.GameResultList = this.FDBservice.convertAs( val, "GameResultList" );
    } );

    FDB.list( '/data/PlayersNameList' ).subscribe( val => {
      this.PlayersNameList = this.FDBservice.convertAs( val, "PlayersNameList" );
    } );

    FDB.list( '/data/ScoringList' ).subscribe( val => {
      this.ScoringList = this.FDBservice.convertAs( val, "ScoringList" );
    } );

  }

  ngOnInit() {
    // this.httpServicePlayers.GetPlayersNameList()
    // .then( data => console.log(data) );
  }

}
