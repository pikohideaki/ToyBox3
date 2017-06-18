import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdDialogRef } from '@angular/material';

import { MyUtilitiesService } from '../../my-utilities.service';

import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";
import { GameResult } from "../game-result";
import { CardProperty } from "../card-property";
import { SelectedCards } from "../selected-cards";

@Component({
  providers: [ MyUtilitiesService, MyFirebaseSubscribeService ],
  selector: 'app-submit-game-result-dialog',
  templateUrl: './submit-game-result-dialog.component.html',
  styleUrls: [
    '../../my-data-table/my-data-table.component.css',
    './submit-game-result-dialog.component.css'
  ]
})
export class SubmitGameResultDialogComponent implements OnInit {

  @Input() CardPropertyList: CardProperty[] = [];
  @Input() DominionSetNameList: { name: string, selected: boolean }[] = [];
  @Input() GameResultList: GameResult[] = [];

  @Input() newGameResult: GameResult;

  constructor(
    public dialogRef: MdDialogRef<SubmitGameResultDialogComponent>,
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
  }

  ngOnInit() {
    this.afDatabase.list( '/data/ScoringList' ).subscribe( val => {
      let defaultScores = this.afDatabaseService.convertAs( val, "ScoringList" );
      this.newGameResult.rankPlayers();
      this.newGameResult.setScores( defaultScores );
    } );
  }


  submitGameResult() {
    this.afDatabase.list( '/data/GameResultList/' )
      .update( `${this.GameResultList.length}`, this.newGameResult );
  }
}
