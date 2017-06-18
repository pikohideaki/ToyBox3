import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: Observable<firebase.User>;


  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth
  ) {
    this.user = afAuth.authState;
  }

  logout() {
    if ( !this.afAuth.auth.currentUser ) return;
    this.afAuth.auth.signOut()
    .then( () => this.openSnackBar("Successfully signed out!") );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

}
