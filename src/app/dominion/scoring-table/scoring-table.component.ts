import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";


@Component({
  providers: [MyFirebaseSubscribeService],
  selector: 'app-scoring-table',
  templateUrl: './scoring-table.component.html',
  styleUrls: ['./scoring-table.component.css']
})
export class ScoringTableComponent implements OnInit {

  httpGetDone: boolean = false;
  ScoringList : number[][] = [];

  ScoringListForView: {
    playerNum : number,
    rank_1st : string,
    rank_2nd : string,
    rank_3rd : string,
    rank_4th : string,
    rank_5th : string,
    rank_6th : string,
  }[];


  columnSettings = [
    { name: 'playerNum', align: 'c', manip: 'none', button: false, headerTitle: 'プレイヤー数' },
    { name: 'rank_1st' , align: 'c', manip: 'none', button: false, headerTitle: '1位' },
    { name: 'rank_2nd' , align: 'c', manip: 'none', button: false, headerTitle: '2位' },
    { name: 'rank_3rd' , align: 'c', manip: 'none', button: false, headerTitle: '3位' },
    { name: 'rank_4th' , align: 'c', manip: 'none', button: false, headerTitle: '4位' },
    { name: 'rank_5th' , align: 'c', manip: 'none', button: false, headerTitle: '5位' },
    { name: 'rank_6th' , align: 'c', manip: 'none', button: false, headerTitle: '6位' },
  ];


  constructor(
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    afDatabase.list( '/data/ScoringList' ).subscribe( val => {
      this.httpGetDone = true;
      this.ScoringList = this.afDatabaseService.convertAs( val, "ScoringList" );

      this.ScoringListForView
        = this.ScoringList
            .map( (value,index,_) => { return { playerNum: index, score: value } } )
            .filter( e => e.score[1] > 0 )
            .map( e => {
              return {
                playerNum : e.playerNum,
                rank_1st : ( e.score[1] < 0 ? '' : e.score[1].toString() ),
                rank_2nd : ( e.score[2] < 0 ? '' : e.score[2].toString() ),
                rank_3rd : ( e.score[3] < 0 ? '' : e.score[3].toString() ),
                rank_4th : ( e.score[4] < 0 ? '' : e.score[4].toString() ),
                rank_5th : ( e.score[5] < 0 ? '' : e.score[5].toString() ),
                rank_6th : ( e.score[6] < 0 ? '' : e.score[6].toString() ),
              } } );
    } );
  }

  ngOnInit() {
  }

}
