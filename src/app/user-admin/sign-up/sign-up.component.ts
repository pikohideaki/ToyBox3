import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { UserInfo } from '../../user-info';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  waitingForResponse: boolean = false;

  // user: Observable<firebase.User>;
  email: string;
  password: string;
  displayName: string;

  errorMessageForEmail: string;
  errorMessageForPassword: string;


  constructor(
    public snackBar: MdSnackBar,
    public afAuth: AngularFireAuth,
    private router: Router,
    private afDatabase: AngularFireDatabase,
  ) {
  }

  ngOnInit() {
  }

  signUp() {
    this.errorMessageForEmail = "";
    this.errorMessageForPassword = "";

    this.waitingForResponse = true;
    this.afAuth.auth.createUserWithEmailAndPassword( this.email, this.password )
    .then( () => {
      this.waitingForResponse = false;
      this.setDisplayName();
      this.afAuth.authState.subscribe( val => {
        let newUser = new UserInfo();
        newUser.databaseKey = val.uid;
        newUser.id          = val.uid;
        newUser.name        = this.displayName;
        this.afDatabase.list("/userInfo").update( val.uid, newUser );
      } );
      this.router.navigate(['/']);
      this.openSnackBar("Successfully logged in!");
    } )
    .catch( (error: any ) => {
      this.waitingForResponse = false;

      switch ( error.code ) {
        case "auth/email-already-in-use" :
          this.errorMessageForEmail = error.message;
          break;
        case "auth/invalid-email" :
          this.errorMessageForEmail = error.message;
          break;
        case "auth/operation-not-allowed" :
          console.log( error.message );
          break;
        case "auth/weak-password" :
          this.errorMessageForPassword = error.message;
          break;
        default :
          break;
      }
    } );
  }

  private setDisplayName() {
    this.afAuth.auth.currentUser.updateProfile( { displayName: this.displayName, photoURL: "" } );
  }


  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}
