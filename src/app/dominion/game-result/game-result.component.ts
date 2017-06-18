import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";
import { GameResult } from "../game-result";


@Component({
  providers: [MyFirebaseSubscribeService],
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.css']
})
export class GameResultComponent implements OnInit {

  httpGetDone: boolean = false;
  GameResultList: GameResult[] = [];
  GameResultListFiltered: GameResult[] = [];

  playerNumOptions: { playerNum: number, selected: boolean }[] = [];


  dateBegin: Date;
  dateEnd  : Date;

  // GetGameResultListUrl = `${this.HOST_NAME}/api/GameResultList.json`;


  constructor(
    private utils: MyUtilitiesService,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    this.dateBegin = new Date();
    this.dateEnd   = new Date();

    afDatabase.list( '/data/ScoringList' ).subscribe( val => {
      let ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );

      afDatabase.list( '/data/GameResultList' ).subscribe( val => {
        this.GameResultList = this.afDatabaseService.convertAs( val, "GameResultList", ScoringList );

        this.httpGetDone = true;
        this.playerNumOptions
          = this.utils.uniq( this.GameResultList.map( e => e.players.length ).sort() )
                      .map( v => { return { playerNum: v, selected: true }; } );
        this.resetFilter();
      } );
    });
  }



  ngOnInit() {
  }


  filterGameResultList() {
    let playerNumIsSelected = {};
    this.playerNumOptions.forEach( e => playerNumIsSelected[e.playerNum] = e.selected );

    this.GameResultListFiltered = this.GameResultList.filter(
      gr => (    this.utils.getMidnightOfDate( gr.date ) >= this.dateBegin
              && this.utils.getMidnightOfDate( gr.date ) <= this.dateEnd
              && playerNumIsSelected[gr.players.length] )
    );
  }

  latestResult() {
    let latestDate = new Date( this.utils.back( this.GameResultList.map( e => e.date ) ) );
    this.dateEnd   = this.utils.getMidnightOfDate( latestDate );
    this.dateBegin = this.utils.getMidnightOfDate( latestDate );
    this.filterGameResultList();
  }

  resetFilter() {
    // set default values (don't use setDate() to avoid letting ngModel sleep)
    this.dateBegin = this.utils.getMidnightOfDate( this.utils.front( this.GameResultList.map( e => e.date ) ) );
    this.dateEnd   = this.utils.getMidnightOfDate( this.utils.back ( this.GameResultList.map( e => e.date ) ) );
    this.playerNumOptions.forEach( e => e.selected = true );
    this.filterGameResultList();
  }
}
