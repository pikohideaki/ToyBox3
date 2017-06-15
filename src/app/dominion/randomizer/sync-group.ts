
import { GameResult } from "../game-result";
import { SelectedCards } from "../selected-cards";

export class SyncGroup {
    name                 : string;
    password             : string;
    members              : string[];
    createdTime          : Date;
    selectedCards        : SelectedCards;
    selectedDominionSets : boolean[];
    // gameResult    : GameResult;

    constructor() {
      this.createdTime = new Date( Date.now() );
      this.selectedCards = new SelectedCards();
    }
}
