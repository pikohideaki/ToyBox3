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

  // httpGetDone: boolean[] = [false,false];
  httpGetDone: boolean = false;

  DominionSetList: { name: string, selected: boolean }[] = [];
  CardPropertyList: CardProperty[] = [];
  PlayersNameList: PlayerName[] = [];

  SelectedCards: SelectedCards = new SelectedCards();

  signedIn: boolean = false;

  // for myGroupID
  users: UserInfo[] = [];
  syncGroups: { id: string, selected: boolean, data: SyncGroup }[];

  user: Observable<firebase.User>;
  mySyncGroupName: string;


  constructor(
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService,
    public afAuth: AngularFireAuth
  ) {

    this.user = afAuth.authState;
    this.user.subscribe( () => 
      this.getMySyncGroupName().then( val => this.mySyncGroupName = val ) );


    const afDB_DominionSetNameList = afDatabase.list( '/data/DominionSetNameList' );
    const afDB_CardPropertyList = afDatabase.list( '/data/CardPropertyList' );

    Promise.all([
      afDB_DominionSetNameList.first().toPromise(),
      afDB_CardPropertyList.first().toPromise()
    ]).then( () => this.httpGetDone = true );


    afDB_DominionSetNameList.subscribe( val => {
      this.DominionSetList
        = this.afDatabaseService.convertAs( val, "DominionSetNameList" )
                .map( e => { return { name: e, selected: true } } );
    });

    afDB_CardPropertyList.subscribe( val => {
      this.CardPropertyList = this.afDatabaseService.convertAs( val, "CardPropertyList" );
    });

  }

  ngOnInit() {
  }


  private getMySyncGroupName(): Promise<string> {
    return ( async () => {
      const me = await this.user.first().toPromise();
      if ( !me ) return "";

      this.signedIn = !!me;

      if ( me.uid === "" ) return "";

      const myUserInfo
        = await this.afDatabase.object(`/userInfo/${me.uid}`)
                  .first().toPromise();

      const myDominionGroupID = new UserInfo( myUserInfo ).dominionGroupID;

      if ( myDominionGroupID === "" ) return "";

      const myDominionGroup
        = await this.afDatabase.object(`/syncGroups/${myDominionGroupID}`)
                  .first().toPromise();
      
      return myDominionGroup.name;
    })();
  }

}
