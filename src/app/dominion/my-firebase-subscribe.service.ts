import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CardProperty } from "./card-property";
import { GameResult } from "./game-result";
import { PlayerName } from "./player-name";


@Injectable()
export class MyFirebaseSubscribeService {

  constructor() { }


  convertAs( val: any, targetname: string ) {
    let result = [];

    switch (targetname) {
      case "CardPropertyList":
        val.forEach( e => result.push( new CardProperty(e) ) );
        console.log( "convertAs CardPropertyList done. " );
        return result;

      case "DominionSetNameList":
        result = val.map( e => e.$value );
        console.log( "convertAs DominionSetNameList done. " );
        return result;

      case "GameResultList":
        val.forEach( e => result.push( new GameResult(e) ) );
        console.log( "convertAs GameResultList done. " );
        return result;

      case "PlayersNameList":
        val.forEach( e => result.push( new PlayerName(e) ) );
        console.log( "convertAs PlayersNameList done. " );
        return result;

      case "ScoringList":
        val.forEach( e => result.push( new Array(e) ) );
        console.log( "convertAs ScoringList done. " );
        return result;

      default:
        break;
    }
  }

}
