import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";
import { SelectedCards } from "../../selected-cards";
import { GameResult } from "../../game-result";
import { SyncGroup } from "../sync-group";

@Component({
  providers: [ MyUtilitiesService, MyFirebaseSubscribeService ],
  selector: 'app-sync-groups',
  templateUrl: './sync-groups.component.html',
  styleUrls: ['./sync-groups.component.css']
})
export class SyncGroupsComponent implements OnInit {

  @Input() SelectedCards: SelectedCards;
  @Input() newGameResult: GameResult;

  @Input()  syncGroups: SyncGroup[];
  @Output() syncGroupsChange = new EventEmitter<SyncGroup[]>();

  PlayersNameList;

  newGroup: SyncGroup = new SyncGroup();

  myname: string;
  password: string;


  constructor(
    public utils: MyUtilitiesService,
    private FDB: AngularFireDatabase,
    private FDBservice: MyFirebaseSubscribeService
  ) {
    this.FDB.list("/syncGroups").subscribe( val => {
      console.log(val)
      this.syncGroups = this.FDBservice.convertAs( val, "syncGroups" );
    });

    
    FDB.list( '/data/PlayersNameList' ).subscribe( val => {
      this.PlayersNameList = this.FDBservice.convertAs( val, "PlayersNameList" );
    } );
  }

  ngOnInit() {
  }


  addSyncGroup( form: NgForm ) {
    console.log(form)
    this.newGroup.members   = [ form.value.myname ];
    this.newGroup.name      = form.value.newGroupName;
    this.newGroup.password  = form.value.newGroupPassword;
    this.newGroup.timeStamp = Date.now();
    this.FDB.list("/syncGroups").push( this.newGroup );
    // this.syncGroupsChange.emit( this.syncGroups );
  }


  groupClicked( index: number ) {
    this.syncGroups[index].active = !this.syncGroups[index].active;
  }


  signIn() {

  }

}
