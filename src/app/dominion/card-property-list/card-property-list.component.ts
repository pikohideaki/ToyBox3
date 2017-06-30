import { Component, OnInit, Input  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdDialog } from '@angular/material';


import { MyUtilitiesService } from '../../my-utilities.service';
import { MyDataTableComponent } from '../../my-data-table/my-data-table.component';

import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";

import { CardProperty } from "../card-property";
import { CardPropertyDialogComponent } from '../card-property-dialog/card-property-dialog.component';



@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-card-property-list',
  templateUrl: './card-property-list.component.html',
  styleUrls: [ './card-property-list.component.css' ]
})
export class CardPropertyListComponent implements OnInit {

  CardPropertyList: CardProperty[] = [];
  CardPropertyListForView: any[] = [];
  httpGetDone: boolean = false;

  // pagenation settings
  itemsPerPageOptions: number[] = [ 25, 50, 100, 200 ];
  itemsPerPageDefault: number = 50;


  columnSettings = [
    { name: 'no'                  , align: 'c', manip: 'none'             , button: false, headerTitle: 'No.' },
    { name: 'name_jp'             , align: 'c', manip: 'incrementalSearch', button: true , headerTitle: '名前' },
    { name: 'name_eng'            , align: 'c', manip: 'incrementalSearch', button: false, headerTitle: 'Name' },
    { name: 'set_name'            , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'セット名' },
    { name: 'category'            , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: '分類' },
    { name: 'card_type'           , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: '種別' },
    { name: 'costStr'             , align: 'c', manip: 'none'             , button: false, headerTitle: 'コスト' },
    { name: 'VP'                  , align: 'c', manip: 'none'             , button: false, headerTitle: 'VP' },
    { name: 'draw_card'           , align: 'c', manip: 'none'             , button: false, headerTitle: '+card' },
    { name: 'action'              , align: 'c', manip: 'none'             , button: false, headerTitle: '+action' },
    { name: 'buy'                 , align: 'c', manip: 'none'             , button: false, headerTitle: '+buy' },
    { name: 'coin'                , align: 'c', manip: 'none'             , button: false, headerTitle: '+coin' },
    { name: 'VPtoken'             , align: 'c', manip: 'none'             , button: false, headerTitle: '+VPtoken' },
    { name: 'implemented'         , align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'ゲーム実装状況' },
    { name: 'randomizer_candidate', align: 'c', manip: 'filterBySelecter' , button: false, headerTitle: 'ランダマイザー対象' },
  ];




  constructor(
    private utils: MyUtilitiesService,
    public dialog: MdDialog,
    afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    afDatabase.list( '/data/CardPropertyList' ).subscribe( val => {
      this.CardPropertyList = this.afDatabaseService.convertAs( val, "CardPropertyList" );
      this.httpGetDone = true;
      this.CardPropertyListForView = this.CardPropertyList.map( x => x.transform() );
    } );
  }

  ngOnInit() {
  }

  showDetail( rowIndex: number ) {
    const selectedCardForView = this.CardPropertyList[rowIndex].transform();
    
    let dialogRef = this.dialog.open( CardPropertyDialogComponent, {
            height: '80%',
            width : '80%',
        });
    dialogRef.componentInstance.card = selectedCardForView;
  }
}

