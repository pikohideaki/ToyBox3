export class SelectedCards {
  Prosperity      : boolean;
  DarkAges        : boolean;
  // Prosperity      : { enabled: boolean, checked: boolean },
  // DarkAges        : { enabled: boolean, checked: boolean },
  KingdomCards10  : { index: number, checked: boolean }[];
  BaneCard        : { index: number, checked: boolean }[];
  EventCards      : { index: number, checked: boolean }[];
  LandmarkCards   : { index: number, checked: boolean }[];
  Obelisk         : { index: number, checked: boolean }[];
  BlackMarketPile : { index: number, checked: boolean }[];
  // SelectedDominionSets: boolean[];


  constructor( scObj? ) {
    if ( scObj === undefined ) {
      this.Prosperity      = false;
      this.DarkAges        = false;
      this.KingdomCards10  = [];
      this.BaneCard        = [];
      this.EventCards      = [];
      this.LandmarkCards   = [];
      this.Obelisk         = [];
      this.BlackMarketPile = [];
    } else {
      this.Prosperity      = ( scObj.Prosperity      || false );
      this.DarkAges        = ( scObj.DarkAges        || false );
      this.KingdomCards10  = ( scObj.KingdomCards10  || [] );
      this.BaneCard        = ( scObj.BaneCard        || [] );
      this.EventCards      = ( scObj.EventCards      || [] );
      this.LandmarkCards   = ( scObj.LandmarkCards   || [] );
      this.Obelisk         = ( scObj.Obelisk         || [] );
      this.BlackMarketPile = ( scObj.BlackMarketPile || [] );
    }
  }
}
