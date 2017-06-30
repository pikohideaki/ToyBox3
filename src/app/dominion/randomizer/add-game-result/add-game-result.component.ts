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

  httpGetDone: boolean = false;


  date: Date;

  place:string = "";
  places: string[] = [];
  stateCtrl: FormControl;
  filteredPlaces: any;

  GameResultList: GameResult[] = [];

  startPlayerName: string = "";
  memo: string = "";


  @Input() DominionSetList: { name: string, selected: boolean }[] = [];
  @Input() CardPropertyList: CardProperty[];
  @Input() SelectedCards: SelectedCards = new SelectedCards();

  PlayersNameList: PlayerName[] = [];
  Players: {
      name      : string,
      selected  : boolean,
      VP        : number,
      lessTurns : boolean,
    }[] = [];


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

    const afdb_PlayersNameList = afDatabase.list( '/data/PlayersNameList' );
    const afdb_ScoringList     = afDatabase.list( '/data/ScoringList' );
    const afdb_GameResultList  = afDatabase.list( '/data/GameResultList' );

    Promise.all([
      afdb_PlayersNameList.first().toPromise(),
      afdb_ScoringList.first().toPromise(),
      afdb_GameResultList.first().toPromise(),
    ])
    .then( () => this.httpGetDone = true );


    afdb_PlayersNameList.subscribe( val => {
      this.PlayersNameList = this.afDatabaseService.convertAs( val, "PlayersNameList" );
      this.initializePlayers();
    } );

    afdb_ScoringList.subscribe( val => {
      let ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );
      afdb_GameResultList.subscribe( val => {
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

  filterPlaces( val: string ): string[] {
    return val ? this.places.filter( s => this.utils.submatch( s, val, true ) )
           : this.places;
  }

  private initializePlayers(): void {
    this.Players = this.PlayersNameList.map( player => {
      return {
        name      : player.name,
        selected  : false,
        VP        : 0,
        lessTurns : false,
      } } );
  }

  selectedPlayers(): any[] {
    return this.Players.filter( player => player.selected );
  }
  

  selectStartPlayer(): void {
    if ( this.selectedPlayers().length < 1 ) return;
    this.startPlayerName = this.utils.getRandomValue( this.selectedPlayers() ).name;
  }


  private playerNumOK(): boolean {
    return ( 2 <= this.selectedPlayers().length && this.selectedPlayers().length <= 6 );
  }


  submitGameResult(): void {
    if ( !this.playerNumOK() ) return;
    let dialogRef = this.dialog.open( SubmitGameResultDialogComponent, {
        height: '80%',
        width : '80%',
      });

    this.newGameResult = new GameResult({
      no     : this.GameResultList.length + 1,
      date   : this.date,
      place  : this.place,
      memo   : this.memo,
      DominionSetsSelected : this.DominionSetList.map( e => e.selected ),
      SelectedCardsID      : {
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

    dialogRef.componentInstance.newGameResult    = this.newGameResult;

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


  private openSnackBar() {
    this.snackBar.open( "Successfully Submitted!", undefined, { duration: 3000 } );
  }

}
