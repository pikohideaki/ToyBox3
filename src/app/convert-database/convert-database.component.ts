import { Component, OnInit } from '@angular/core';

import { MdDialog, MdSnackBar } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyFirebaseSubscribeService } from "../dominion/my-firebase-subscribe.service";
import { MyUtilitiesService } from '../my-utilities.service';

import { GameResult } from "../dominion/game-result";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],

  selector: 'app-convert-database',
  templateUrl: './convert-database.component.html',
  styleUrls: ['./convert-database.component.css']
})
export class ConvertDatabaseComponent implements OnInit {

  GameResultList: GameResult[] = [];


  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    // afDatabase.list( '/data/GameResultList', { preserveSnapshot: true } )
    // .first().subscribe( shapshots => {
    //   shapshots.forEach( snapshot => {
    //     afDatabase.object( `/data/GameResultList/${snapshot.key}/id` )
    //       // .update( {'databaseKey' : snapshot.key} );
    //       .remove()
    //   })
    // })
    // afDatabase.list( '/data/GameResultList3' ).remove();

    // afDatabase.list( '/data/ScoringList' ).subscribe( val => {
    //   let ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );
    //   afDatabase.list( '/data/GameResultList3' ).subscribe( val => {
    //     this.GameResultList = this.afDatabaseService.convertAs( val, "GameResultList", ScoringList );
    //     // console.log(this.GameResultList)
    //     afDatabase.list( '/data/GameResultList' ).remove()
    //     .then( () => this.GameResultList.forEach( gr => {
    //         afDatabase.list( '/data/GameResultList' ).push({
    //           id                   : gr.id,
    //           date                 : gr.date.toString(),
    //           place                : gr.place,
    //           players              : gr.players.map( e => { return {
    //             VP : e.VP,
    //             lessTurns : e.lessTurns,
    //             name : e.name,
    //           } }),
    //           memo                 : gr.memo,
    //           DominionSetsSelected : gr.DominionSetsSelected,
    //           SelectedCardsID      : gr.SelectedCardsID,
    //         })
    //       })
    //     );
    //   } );
    // } );

  }


  ngOnInit() {
  }

}
