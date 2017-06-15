
import { GameResult } from "../game-result";
import { SelectedCards } from "../selected-cards";

export class SyncGroup {
    name                 : string;
    password             : string;
    members              : string[];
    timeStamp            : number;
    selectedCards        : SelectedCards;
    selectedDominionSets : boolean[];
    active               : boolean;  // used in list view
    // gameResult    : GameResult;

    constructor( sgObj? ) {
      this.name                 = "";
      this.password             = "";
      this.members              = [];
      this.timeStamp            = 0;
      this.selectedCards        = new SelectedCards();
      this.selectedDominionSets = [];
      this.active               = false;
      if ( sgObj ) {
        Object.keys( sgObj ).forEach( key => this[key] = sgObj[key] );
      }
    }

    getDate() {
      return ( this.timeStamp === 0 ? new Date( Date.now() ) : new Date( this.timeStamp ) );
    }
}
