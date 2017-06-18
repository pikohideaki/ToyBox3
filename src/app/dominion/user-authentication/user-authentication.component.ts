import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent implements OnInit {

  user: Observable<firebase.User>;
  email: string;
  password: string;
  displayName: string;

  errorMessageForEmail: string;
  errorMessageForPassword: string;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  ngOnInit() {
  }

  signUp() {
    this.errorMessageForEmail = "";  // reset
    this.errorMessageForPassword = "";  // reset

    this.afAuth.auth.createUserWithEmailAndPassword( this.email, this.password )
    .then( () => this.setDisplayName() )
    .catch( (error: any ) => {
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

  login() {
    this.afAuth.auth.signInWithEmailAndPassword( this.email, this.password )
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  setDisplayName() {
    this.afAuth.auth.currentUser.updateProfile( { displayName: this.displayName, photoURL: "" } );
  }

}
