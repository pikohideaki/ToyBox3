import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";

import { CardProperty } from "../card-property";
import { GameResult } from "../game-result";
import { SelectedCards } from "../selected-cards";
import { SyncGroup } from "./sync-group";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.css']
})
export class RandomizerComponent implements OnInit {

  httpGetDone: number = 0;

  DominionSetNameList: { name: string, selected: boolean }[] = [];
  CardPropertyList: CardProperty[] = [];

  SelectedCards: SelectedCards = new SelectedCards();
  newGameResult: GameResult;

  syncGroups: SyncGroup[];


  constructor(
    private utils: MyUtilitiesService,
    FDB: AngularFireDatabase,
    private FDBservice: MyFirebaseSubscribeService
  ) {

    // get sync groups
    FDB.list( "/syncGroups" ).subscribe( val => {
      this.httpGetDone++;
      // this.syncGroups = val.map( e => )
    });

    FDB.list( '/data/DominionSetNameList' ).subscribe( val => {
      this.httpGetDone++;
      this.DominionSetNameList
        = this.FDBservice.convertAs( val, "DominionSetNameList" )
                .map( e => { return { name: e, selected: true } } );

      if ( this.utils.localStorage_has('DominionSetNameList') ) {
        let ls = this.utils.localStorage_get('DominionSetNameList');
        this.DominionSetNameList.forEach( elm => {
          let localValue = ls.find( e => e.name == elm.name );
          if ( localValue ) { elm.selected = localValue.selected; }
        })
      }
    });

    FDB.list( '/data/CardPropertyList' ).subscribe( val => {
      this.httpGetDone++;
      this.CardPropertyList = this.FDBservice.convertAs( val, "CardPropertyList" );
    });
  }

  httpGetAllDone() : boolean {
    return this.httpGetDone >= 3;
  }

  ngOnInit() {
  }

}
