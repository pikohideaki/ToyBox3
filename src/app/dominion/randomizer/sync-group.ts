
import { GameResult } from "../game-result";
import { SelectedCards } from "../selected-cards";

export class SyncGroup {
  name                 : string;
  password             : string;
  timeStamp            : number;
  selectedCards        : SelectedCards;
  selectedDominionSets : { name: string, selected: boolean }[];
  // gameResult    : GameResult;

  constructor( sgObj? ) {
    this.name                 = "";
    this.password             = "";
    this.timeStamp            = 0;
    this.selectedCards        = new SelectedCards();
    this.selectedDominionSets = [];
    if ( sgObj ) {
      Object.keys( sgObj ).filter( key => key !== "members" )
                          .forEach( key => this[key] = sgObj[key] );
    }
  }

  getDate() {
    return ( this.timeStamp === 0 ? new Date( Date.now() ) : new Date( this.timeStamp ) );
  }
}
