
import { GameResult } from "../game-result";
import { SelectedCards } from "../selected-cards";

export class SyncGroup {
  name                     : string;
  password                 : string;
  timeStamp                : number;
  SelectedCards            : SelectedCards;
  DominionSetsSelected     : boolean[];
  randomizerButtonDisabled : boolean;
  // gameResult    : GameResult;

  constructor( sgObj? ) {
    this.name                     = "";
    this.password                 = "";
    this.timeStamp                = 0;
    this.SelectedCards            = new SelectedCards();
    this.DominionSetsSelected     = [];
    this.randomizerButtonDisabled = false;
    if ( sgObj ) {
      Object.keys( sgObj ).forEach( key => this[key] = sgObj[key] );
    }
  }

  getDate() {
    return ( this.timeStamp === 0 ? new Date( Date.now() ) : new Date( this.timeStamp ) );
  }
}
