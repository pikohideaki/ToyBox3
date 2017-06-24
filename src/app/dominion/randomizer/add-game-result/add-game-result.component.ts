import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MdDialog, MdSnackBar } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";

import { MyUtilitiesService } from '../../../my-utilities.service';
import { PlayerName } from "../../player-name";
import { GameResult } from "../../game-result";
import { SelectedCards } from "../../selected-cards";
import { SubmitGameResultDialogComponent } from '../../submit-game-result-dialog/submit-game-result-dialog.component';
import { CardProperty } from "../../card-property";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-add-game-result',
  templateUrl: './add-game-result.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './add-game-result.component.css'
  ]
})
export class AddGameResultComponent implements OnInit {

  httpGetDone: boolean[] = [false, false, false];


  date: Date;

  place:string = "";
  places: string[] = [];
  stateCtrl: FormControl;
  filteredPlaces: any;

  GameResultList: GameResult[] = [];

  Players: {
      name      : string,
      selected  : boolean,
      VP        : number,
      lessTurns : boolean,
    }[] = [];

  startPlayerName: string = "";
  memo: string = "";


  @Input() DominionSetList: { name: string, selected: boolean }[] = [];
  @Input() CardPropertyList: CardProperty[];
  @Input() SelectedCards: SelectedCards = new SelectedCards();

  PlayersNameList: PlayerName[] = [];


  newGameResult: GameResult;


  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    this.date = new Date( Date.now() );

    this.stateCtrl = new FormControl();

    afDatabase.list( '/data/PlayersNameList' ).subscribe( val => {
      this.PlayersNameList = this.afDatabaseService.convertAs( val, "PlayersNameList" );
      this.httpGetDone[2] = true;
    } );

    afDatabase.list( '/data/ScoringList' ).subscribe( val => {
      this.httpGetDone[0] = true;
      let ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );
      afDatabase.list( '/data/GameResultList' ).subscribe( val => {
        this.httpGetDone[1] = true;
        this.GameResultList = this.afDatabaseService.convertAs( val, "GameResultList", ScoringList );
        this.places = this.utils.uniq( this.GameResultList.map( e => e.place ) )
                                .filter( e => e != "" );

        this.filteredPlaces = this.stateCtrl.valueChanges
              .startWith(null)
              .map( name => this.filterPlaces(name) );
      } );
    } );

  }

  ngOnInit() {
  }

  // ngOnChanges( changes: SimpleChanges ) {
  //   if ( changes.PlayersNameList != undefined ) {  // at http-get done
  //     this.Players = this.PlayersNameList.map( player => {
  //       return {
  //         name      : player.name,
  //         selected  : false,
  //         VP        : 0,
  //         lessTurns : false,
  //       } } );
  //   }
  // }


  httpGetAllDone() : boolean {
    return this.httpGetDone.every( e => e === true );
  }

  filterPlaces( val: string ): string[] {
    return val ? this.places.filter( s => this.utils.submatch( s, val, true ) )
           : this.places;
  }

  selectedPlayers(): any[] {
    return this.Players.filter( player => player.selected );
  }
  

  selectStartPlayer(): void {
    if ( this.selectedPlayers().length < 1 ) return;
    this.startPlayerName = this.utils.getRandomValue( this.selectedPlayers() ).name;
  }


  playerNumAlert(): boolean {
    return ( 2 <= this.selectedPlayers().length && this.selectedPlayers().length <= 4 );
  }


  submitGameResult(): void {
    if ( !this.playerNumAlert() ) return;
    let dialogRef = this.dialog.open( SubmitGameResultDialogComponent, {
        height: '80%',
        width : '80%',
      });

    this.newGameResult = new GameResult({
      no     : this.GameResultList.length + 1,
      id     : Date.now(),
      date   : this.date,
      place  : this.place,
      memo   : this.memo,
      selectedDominionSets : this.DominionSetList.map( e => e.selected ),
      usedCardIDs      : {
        Prosperity      : this.SelectedCards.Prosperity,
        DarkAges        : this.SelectedCards.DarkAges,
        KingdomCards10  : this.SelectedCards.KingdomCards10 .map( card => this.CardPropertyList[card.index].card_ID ),
        BaneCard        : this.SelectedCards.BaneCard       .map( card => this.CardPropertyList[card.index].card_ID ),
        EventCards      : this.SelectedCards.EventCards     .map( card => this.CardPropertyList[card.index].card_ID ),
        Obelisk         : this.SelectedCards.Obelisk        .map( card => this.CardPropertyList[card.index].card_ID ),
        LandmarkCards   : this.SelectedCards.LandmarkCards  .map( card => this.CardPropertyList[card.index].card_ID ),
        BlackMarketPile : this.SelectedCards.BlackMarketPile.map( card => this.CardPropertyList[card.index].card_ID ),
      },
      players : this.selectedPlayers().map( pl => {
              return {
                name      : pl.name,
                VP        : pl.VP,
                lessTurns : pl.lessTurns,
                rank      : 1,
                score     : 0,
              }
            }),
    });
    // this.newGameResultChange.emit( this.newGameResult );

    dialogRef.componentInstance.newGameResult    = this.newGameResult;
    dialogRef.componentInstance.GameResultList   = this.GameResultList;
    // dialogRef.componentInstance.CardPropertyList = this.CardPropertyList;

    dialogRef.afterClosed().subscribe( result => {
      if ( result == "OK Clicked" ) {
        this.Players.forEach( pl => {
          pl.lessTurns = false;
          pl.VP = 0;
        });
        this.memo = "";
        this.startPlayerName = "";
        this.openSnackBar();
      }
    });
  }


  openSnackBar() {
    this.snackBar.open( "Successfully Submitted!", undefined, { duration: 3000 } );
  }

}
