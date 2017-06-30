
export class GameResult {
  databaseKey: string;  // key of this game-result in fire-database
  no      : number;   // <- calculate locally

  date    : Date;
  place   : string;
  players : {
      name      : string;
      VP        : number;
      lessTurns : boolean;
      rank      : number;   // <- calculate locally
      score     : number;   // <- calculate locally
    }[];
  memo                 : string;
  DominionSetsSelected : boolean[];
  SelectedCardsID      : {
    Prosperity      : boolean;
    DarkAges        : boolean;
    KingdomCards10  : string[];
    BaneCard        : string[];
    EventCards      : string[];
    Obelisk         : string[];
    LandmarkCards   : string[];
    BlackMarketPile : string[];
  }

  constructor( grObj ) {
    this.players = [];
    Object.keys( grObj )
          .filter( key => key != "date" )
          .forEach( key => this[key] = grObj[key] );
    
    // this.players.forEach( pl => { pl.score = 0; pl.rank = 0; } );  // initialize
    this.date = new Date( grObj.date );
    this.rankPlayers();
  }

  rankPlayers() {
    this.players.forEach( e => e.rank = 1 );  // initialize ranks

    for ( let j = 1; j < this.players.length; j++ ) {
    for ( let i = 0; i < j; i++ ) {
      // 自分よりもVPが大きい要素があるごとにrank++. 等しいときは何もしない.
      if ( this.players[j].VP > this.players[i].VP ) { this.players[i].rank++; }
      if ( this.players[j].VP < this.players[i].VP ) { this.players[j].rank++; }
      if ( this.players[j].VP === this.players[i].VP ) {
          if ( this.players[j].lessTurns ) { this.players[i].rank++; }
          if ( this.players[i].lessTurns ) { this.players[j].rank++; }
      }
    }}

    this.players.sort( (a,b) => (a.rank - b.rank) );
  }


  setScores( scoreTable: number[][] ) {
    // httpGetGameResultList のときに呼び出される
    // GetScoreListは1度だけ行いたいのでここでhttp.getはしない

    // 同着に対応
    let scoringTemp: number[] = Array.from( scoreTable[this.players.length] )
    {
      let pl = this.players;  // alias; players is sorted by rank
      let count: number = 0;
      let sum: number = 0.0;
      let rank = 1;
      for ( let i = 0; i < pl.length; ++i ) {
        count++;
        sum += scoreTable[pl.length][rank++];
        if ( i === pl.length - 1 || pl[i].rank !== pl[i + 1].rank ) {
          scoringTemp[ pl[i].rank ] = Math.round( sum * 1000 / count ) / 1000;
          count = 0;  // reset
          sum = 0.0;  // reset
        }
      }
    }

    // write back
    this.players.forEach( e => { e.score = scoringTemp[ e.rank ]; } );
  }

}

