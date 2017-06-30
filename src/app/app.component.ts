import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  signedIn: boolean;

  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user = afAuth.authState;
    this.user.subscribe( () => this.signedIn = !!this.afAuth.auth.currentUser );
  }

  logout() {
    if ( !this.afAuth.auth.currentUser ) return;
    this.afAuth.auth.signOut()
    .then( () => {
      this.openSnackBar("Successfully signed out!");
    } );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

}
