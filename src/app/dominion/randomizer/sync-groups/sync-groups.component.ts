import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdSnackBar } from '@angular/material';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";
import { GameResult } from "../../game-result";
import { SelectedCards } from "../../selected-cards";
import { SyncGroup } from "../sync-group";
import { PlayerName } from "../../player-name";


@Component({
  providers: [ MyUtilitiesService, MyFirebaseSubscribeService ],
  selector: 'app-sync-groups',
  templateUrl: './sync-groups.component.html',
  styleUrls: ['./sync-groups.component.css']
})
export class SyncGroupsComponent implements OnInit {

  @Input() PlayersNameList: PlayerName[] = [];
  @Input() DominionSetList: { name: string, selected: boolean }[] = [];
  @Input() SelectedCards: SelectedCards = new SelectedCards(); 

  syncGroups: { id: string, selected: boolean, data: SyncGroup }[];
  users: { id: string, data: { name: string, groupID: string } }[];

  mySyncGroup: { id: string, data: SyncGroup };

  // bind to form element
  myName: string;
  newGroupName: string;
  newGroupPassword: string;
  signInPassword: string;



  constructor(
    public snackBar: MdSnackBar,
    public utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {

    this.afDatabase.list("/users", { preserveSnapshot: true }).subscribe( snapshots => {
      this.users = this.afDatabaseService.convertAs( snapshots, "users" );
      console.log("users", this.users)
    });

    this.afDatabase.list("/syncGroups", { preserveSnapshot: true }).subscribe( snapshots => {
      this.syncGroups = this.afDatabaseService.convertAs( snapshots, "syncGroups" );
      console.log("syncGroups", this.syncGroups)
    });

    console.log( "c() localStorage_has", this.utils.localStorage_has( "myUserID" ))
  }

  ngOnInit() {
  }

  getUserNamesInGroup( groupID ) {
    return this.users.filter( user => user.data.groupID === groupID ).map( user => user.data.name );
  }

  updateMyGroupID( groupID ) {
    const userIndex = this.users.findIndex( user => user.data.name === this.myName );

    console.log(groupID, userIndex, this.users)

    if ( userIndex === -1 ) {  // new user
      const newID = this.afDatabase.list("/users").push( { name: this.myName, groupID: groupID } ).key;
    } else {
      // this.afDatabase.list("/users").update( this.myUserID, { name: this.myName, groupID: groupID } );
    }
  }

  addSyncGroup() {
    const newGroup = new SyncGroup({
      name                 : this.newGroupName,
      password             : this.newGroupPassword,
      timeStamp            : Date.now(),
      selectedCards        : this.SelectedCards,
      selectedDominionSets : this.DominionSetList,
    });

    const groupID = this.afDatabase.list("/syncGroups").push( newGroup ).key;

    this.updateMyGroupID( groupID );

    this.removeMemberEmptyGroup();
  }


  groupClicked( index: number ) {
    this.syncGroups.forEach( g => g.selected = false );
    this.syncGroups[index].selected = true;
  }


  // private sub( groupID ) {
  //   if ( this.signInPassword !== this.syncGroups.find( g => g.id === groupID ).data.password ) {
  //     this.signInPasswordIsValid = false;
  //     return false;
  //   }
  //   this.signInPasswordIsValid = true;
  //   return true;
  // }

  signInPasswordIsValid( groupID ): boolean {
    return ( this.signInPassword === this.syncGroups.find( g => g.id === groupID ).data.password );
  }

  signIn( groupID ) {
    if ( this.signInPasswordIsValid( groupID ) === true ) {
      this.updateMyGroupID( groupID );
      this.openSnackBar("Successfully signed in!");
      this.removeMemberEmptyGroup();
    }
  }

  signOut( groupID ) {
    if ( this.signInPasswordIsValid( groupID ) === true ) {
      const userIndex = this.users.findIndex( user => user.data.name === this.myName );
      if ( userIndex !== -1 ) {
        this.afDatabase.list("/users").remove( this.users[userIndex].id );
      }
      this.openSnackBar("Successfully signed out!");
      this.removeMemberEmptyGroup();
    }
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }


  removeMemberEmptyGroup() {
    this.syncGroups
      .filter( g => this.users.findIndex( user => user.data.groupID === g.id ) === -1 )
      .forEach( g => this.afDatabase.list("/syncGroups").remove( g.id ) );
  }

}
