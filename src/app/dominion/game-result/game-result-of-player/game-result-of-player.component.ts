import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';

import { GameResult } from "../../game-result";


@Component({
  selector: 'game-result-of-player',
  templateUrl: './game-result-of-player.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './game-result-of-player.component.css'
  ]
})
export class GameResultOfPlayerComponent implements OnInit, OnChanges {

  @Input() GameResultListFiltered: GameResult[] = [];
  @Input() playerNumOptions: { playerNum: number, selected: boolean }[] = [];

  rankOptions: boolean[] = [];

  GameResultOfEachPlayer = {};
  GameResultOfEachPlayerForView = [];


  constructor(
    private utils: MyUtilitiesService
  ) { }

  ngOnInit() {
  }


  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.GameResultListFiltered != undefined ) {  // at http-get done
      this.calcGameResultOfPlayers();

      let playerNumIsSelected = [];
      this.playerNumOptions.forEach( e => playerNumIsSelected[e.playerNum] = e.selected );
      this.rankOptions = Array(6).fill(true);
      for ( let i = 6; i > 0; --i ) {
        if ( !playerNumIsSelected[i] ) this.rankOptions[i] = false;
        else break;
      }
    }
  }

  calcGameResultOfPlayers() {
    // get all player names
    let playerNamesFiltered = new Set();
    this.GameResultListFiltered.forEach( gr => gr.players.forEach( player => {
      playerNamesFiltered.add( player.name );
    }));

    // initialize
    this.GameResultOfEachPlayer = [];
    playerNamesFiltered.forEach( name => {
      this.GameResultOfEachPlayer[name] = {
        count        : 0,
        countRank    : [0,0,0,0,0,0,0],
        scoreSum     : 0.0,
        scoreAverage : 0.0,
      };
    } );

    // sum up rank & score of each player
    this.GameResultListFiltered.forEach( gr => gr.players.forEach( player => {
      this.GameResultOfEachPlayer[ player.name ].countRank[ player.rank ]++;
      this.GameResultOfEachPlayer[ player.name ].scoreSum += player.score;
    }));

    // calculate countRank and score average
    this.utils.objectForEach( this.GameResultOfEachPlayer, playerResult => {
      playerResult.countRank.forEach( e => playerResult.count += e );  // sum of countRank
      playerResult.scoreAverage = playerResult.scoreSum / playerResult.count;
    });

    // round and sort
    this.GameResultOfEachPlayerForView = [];  // reset
    this.utils.objectForEach( this.GameResultOfEachPlayer, (playerResult, playerName) => {
      this.GameResultOfEachPlayerForView.push( {
        name         : playerName,
        scoreAverage : this.utils.roundAt( playerResult.scoreAverage, 3 ),
        scoreSum     : this.utils.roundAt( playerResult.scoreSum, 3 ),
        count        : playerResult.count,
        countRank    : playerResult.countRank
      })
    });
    this.GameResultOfEachPlayerForView.sort( (a,b) => b.scoreAverage - a.scoreAverage );
  }

}
