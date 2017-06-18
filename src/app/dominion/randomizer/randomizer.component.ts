import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";

import { CardProperty } from "../card-property";
import { GameResult } from "../game-result";
import { PlayerName } from "../player-name";
import { SelectedCards } from "../selected-cards";
import { SyncGroup } from "./sync-group";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.css']
})
export class RandomizerComponent implements OnInit {

  httpGetDone: boolean[] = [false,false];

  DominionSetList: { name: string, selected: boolean }[] = [];
  CardPropertyList: CardProperty[] = [];
  PlayersNameList: PlayerName[] = [];

  SelectedCards: SelectedCards = new SelectedCards();
  newGameResult: GameResult;

  myUserID: string;

  constructor(
    private utils: MyUtilitiesService,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {

    afDatabase.list( '/data/PlayersNameList' ).subscribe( val => {
      this.PlayersNameList = this.afDatabaseService.convertAs( val, "PlayersNameList" );
    } );

    afDatabase.list( '/data/DominionSetNameList' ).subscribe( val => {
      this.httpGetDone[0] = true;
      this.DominionSetList
        = this.afDatabaseService.convertAs( val, "DominionSetNameList" )
                .map( e => { return { name: e, selected: true } } );

      if ( this.utils.localStorage_has('DominionSetNameList') ) {
        let ls = this.utils.localStorage_get('DominionSetNameList');
        this.DominionSetList.forEach( elm => {
          let localValue = ls.find( e => e.name == elm.name );
          if ( localValue ) { elm.selected = localValue.selected; }
        })
      }
    });

    afDatabase.list( '/data/CardPropertyList' ).subscribe( val => {
      this.httpGetDone[1] = true;
      this.CardPropertyList = this.afDatabaseService.convertAs( val, "CardPropertyList" );
    });
  }

  httpGetAllDone() : boolean {
    return this.httpGetDone.every( e => e === true );
  }

  ngOnInit() {
  }

}
