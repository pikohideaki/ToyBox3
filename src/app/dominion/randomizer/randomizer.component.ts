import { Component, OnInit, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { MyUtilitiesService } from '../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../my-firebase-subscribe.service";

import { CardProperty } from "../card-property";
// import { GameResult } from "../game-result";
import { PlayerName } from "../player-name";
import { SelectedCards } from "../selected-cards";
import { SyncGroup } from "./sync-group";
import { UserInfo } from "../../user-info";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.css']
})
export class RandomizerComponent implements OnInit {

  httpGetDone: boolean[] = [false,false];

  DominionSetList: { name: string, selected: boolean }[] = [];
  CardPropertyList: CardProperty[] = [];
  PlayersNameList: PlayerName[] = [];

  SelectedCards: SelectedCards = new SelectedCards();

  signedIn: boolean = false;

  // for myGroupID
  myID: string;
  users: UserInfo[] = [];
  syncGroups: { id: string, selected: boolean, data: SyncGroup }[];
  mySyncGroupName: string;

  constructor(
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService,
    public afAuth: AngularFireAuth
  ) {

    afAuth.authState.subscribe( user => {
      this.signedIn = !!user;
      this.myID = ( this.signedIn ? user.uid : "" );

      if ( this.myID === "" ) return;

      this.afDatabase.object(`/userInfo/${this.myID}`).subscribe( myUserInfo => {
        let myDominionGroupID = new UserInfo( myUserInfo ).dominionGroupID;
        console.log(myUserInfo)

        if ( myDominionGroupID === "" ) return;

        this.afDatabase.object(`/syncGroups/${myDominionGroupID}`).subscribe( myDominionGroup => {
          this.mySyncGroupName = myDominionGroup.name;
        } );
      });
    });

    // afAuth.authState.subscribe( val => {
    //   this.signedIn = !!val;
    //   this.myID = ( this.signedIn ? val.uid : "" );
    // });

    // this.afDatabase.list("/userInfo").subscribe( val => {
    //   this.httpGetDone[2] = true;
    //   this.users = val.map( e => new UserInfo(e) );

    //   this.afDatabase.list("/syncGroups", { preserveSnapshot: true }).subscribe( snapshotsGroups => {
    //     this.httpGetDone[3] = true;
    //     this.syncGroups = this.afDatabaseService.convertAs( snapshotsGroups, "syncGroups" );
    //     const mySyncGroup = this.syncGroups.find( g => g.id === this.mySyncGroupID() );
    //     this.mySyncGroupName = mySyncGroup.data.name;
    //   });
    // });


    // if ( this.utils.localStorage_has('DominionSetNameList') ) {
    //   let ls = this.utils.localStorage_get('DominionSetNameList');
    //   this.DominionSetList.forEach( elm => {
    //     let localValue = ls.find( e => e.name == elm.name );
    //     if ( localValue ) { elm.selected = localValue.selected; }
    //   })
    // }

    afDatabase.list( '/data/DominionSetNameList' ).subscribe( val => {
      this.httpGetDone[0] = true;
      this.DominionSetList
        = this.afDatabaseService.convertAs( val, "DominionSetNameList" )
                .map( e => { return { name: e, selected: true } } );
    });

    afDatabase.list( '/data/CardPropertyList' ).subscribe( val => {
      this.httpGetDone[1] = true;
      this.CardPropertyList = this.afDatabaseService.convertAs( val, "CardPropertyList" );
    });

  }

  ngOnInit() {
  }


  httpGetAllDone() : boolean {
    return this.httpGetDone.every( e => e === true );
  }



  // private mySyncGroupID() {
  //   let me = this.users.find( user => user.id === this.myID );
  //   return ( me ? me.dominionGroupID : "" );
  // }


}
