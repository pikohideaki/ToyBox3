import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";


@Component({
  providers: [MyUtilitiesService, MyFirebaseSubscribeService],
  selector: 'local-game-groups',
  templateUrl: './local-game-groups.component.html',
  styleUrls: ['./local-game-groups.component.css']
})
export class LocalGameGroupsComponent implements OnInit {

  localGameGroups: { name: string, password: string }[] = [];


  constructor(
    private FDB: AngularFireDatabase,
    private FDBservice: MyFirebaseSubscribeService
  ) {
    this.FDB.list( '/localGameGroups' ).subscribe( val => {
      this.localGameGroups = val.map( e => { return { name: e.name, password: e.password } } );
    } );
  }

  ngOnInit() {
  }


  groupClicked( index: number ) {
    console.log(`group ${index} Clicked`)
  }

  addNewGroup( form: NgForm ) {
    this.FDB.list( '/localGameGroups' )
      .update( `${this.localGameGroups.length}`, { name: form.value.newGroupName, password: form.value.newGroupPassword } );
  }

}
