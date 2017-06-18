import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../my-utilities.service';
import { MyDataTableComponent } from '../../my-data-table/my-data-table.component';
import { PlayerName } from "../player-name";
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";


@Component({
  providers: [MyFirebaseSubscribeService],
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: [
        '../../my-data-table/my-data-table.component.css',
        './players.component.css'
    ]
})
export class PlayersComponent implements OnInit {

  PlayersNameList: { name: string, name_yomi: string }[] = [];
  httpGetDone: boolean = false;

  columnSettings = [
    { name: 'name'     , align: 'l', manip: 'none', button: false, headerTitle: '名前' },
    { name: 'name_yomi', align: 'l', manip: 'none', button: false, headerTitle: '読み' },
  ];



  constructor(
    private utils: MyUtilitiesService,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
      afDatabase.list( '/data/PlayersNameList' ).subscribe( val => {
        this.PlayersNameList = this.afDatabaseService.convertAs( val, "PlayersNameList" );
        this.httpGetDone = true;
      } );
  }

  ngOnInit() {
  }

}
