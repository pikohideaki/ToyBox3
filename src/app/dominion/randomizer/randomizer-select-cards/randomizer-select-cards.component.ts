import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";

@Component({
  providers: [MyUtilitiesService],
  selector: 'app-randomizer-select-cards',
  templateUrl: './randomizer-select-cards.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './randomizer-select-cards.component.css'
  ]
})
export class RandomizerSelectCardsComponent implements OnInit {

  @Input() CardPropertyList: CardProperty[] = [];
  @Input() DominionSetNameList: { name: string, selected: boolean }[] = [];
  @Input() SelectedCards: SelectedCards = new SelectedCards(); 
  @Output() SelectedCardsChange = new EventEmitter<SelectedCards>();


  randomizerButtonDisabled: boolean = false;
  AllSetsSelected: boolean = true;

  constructor(
    private utils: MyUtilitiesService
  ) { }

  ngOnInit() {
  }


  selectAllToggle( $event ) {
    this.DominionSetNameList.forEach( DominionSet => DominionSet.selected = this.AllSetsSelected );
  }

  randomizerClicked() {
    if ( this.DominionSetNameList.every( DominionSet => !DominionSet.selected ) ) return;
    this.randomizerButtonDisabled = true;
    this.randomizer();
    this.utils.localStorage_set('DominionSetNameList', this.DominionSetNameList );
  }

  unlockClicked() {
    this.randomizerButtonDisabled = false;
  }

  randomizer() {
    this.SelectedCards = new SelectedCards();  // reset
    // this.SelectedCards = {
    //   KingdomCards10  : [],
    //   Prosperity      : false,
    //   DarkAges        : false,
    //   BaneCard        : [],
    //   EventCards      : [],
    //   LandmarkCards   : [],
    //   Obelisk         : [],
    //   BlackMarketPile : [],
    // }

    // 選択されている拡張セットに含まれているカードすべてをシャッフルし，indexとペアにしたリスト
    let CardsInSelectedSets_Shuffled: { index: number, data: CardProperty }[]
     = this.utils.shuffle(
      this.CardPropertyList
      .map( (val,index) => { return { index: index, data: val }; } )
      .filter ( e => e.data.randomizer_candidate )
      .filter( e => this.DominionSetNameList
                     .filter( s => s.selected )
                     .map( s => s.name )
                     .findIndex( val => val == e.data.set_name ) >= 0 )
      );

    // 10 Supply KingdomCards10 and Event, LandmarkCards
    while ( this.SelectedCards.KingdomCards10.length < 10 ) {
      let card = CardsInSelectedSets_Shuffled.pop();
      if ( card.data.category == '王国' ) {
        this.SelectedCards.KingdomCards10.push( { index: card.index, checked: false } );
      }
      if ( (this.SelectedCards.EventCards.length + this.SelectedCards.LandmarkCards.length ) < 2 ) {
        if ( card.data.card_type == 'イベント' ) {
          this.SelectedCards.EventCards.push( { index: card.index, checked: false } );
        }
        if ( card.data.card_type == 'ランドマーク' ) {
          this.SelectedCards.LandmarkCards.push( { index: card.index, checked: false } );
        }
      }
    }


    // 繁栄場・避難所場の決定
    this.SelectedCards.Prosperity = ( this.CardPropertyList[ this.SelectedCards.KingdomCards10[0].index ].set_name === '繁栄' );
    this.SelectedCards.DarkAges   = ( this.CardPropertyList[ this.SelectedCards.KingdomCards10[9].index ].set_name === '暗黒時代' );


    // 災いカード（収穫祭：魔女娘）
    if ( this.SelectedCards.KingdomCards10
        .findIndex( e => this.CardPropertyList[e.index].name_jp == '魔女娘' ) >= 0 )
    {
      const cardIndex = this.utils.removeIf( CardsInSelectedSets_Shuffled, e => (
               e.data.cost.debt   == 0
            && e.data.cost.potion == 0
            && e.data.cost.coin   >= 2
            && e.data.cost.coin   <= 3 ) ).index;
      this.SelectedCards.BaneCard = [ { index: cardIndex, checked: false } ];
    }

    // Black Market (one copy of each Kingdom card not in the supply. 15種類選択を推奨)
    if ( this.SelectedCards.KingdomCards10
        .findIndex( e => this.CardPropertyList[e.index].name_jp == '闇市場' ) >= 0 )
    {
      while ( this.SelectedCards.BlackMarketPile.length < 15 ) {
        let card = CardsInSelectedSets_Shuffled.pop();
        if ( card.data.category == '王国' ) {
          this.SelectedCards.BlackMarketPile.push( { index: card.index, checked: false } );
        }
      }
    }

    // Obelisk (Choose 1 Action Supply Pile)
    if ( this.SelectedCards.LandmarkCards
        .findIndex( e => this.CardPropertyList[e.index].name_eng == 'Obelisk' ) >= 0 )
    {
      const cardIndex: number = ( () => {
        let supplyUsed: number[] = [].concat( this.SelectedCards.KingdomCards10, this.SelectedCards.BaneCard );
        let ObeliskCandidatesActionCards: number[] = this.utils.copy( supplyUsed );
        if ( supplyUsed.findIndex( e => this.CardPropertyList[e].card_type.includes('略奪者') ) >= 0 ) {
          let ruinsIndex: number = this.CardPropertyList.findIndex( e => e.name_jp == '廃墟' );
          ObeliskCandidatesActionCards.unshift( ruinsIndex );
        }
        return this.utils.getRandomValue( supplyUsed );
      } )();
      this.SelectedCards.Obelisk = [{ index: cardIndex, checked: false }];
    }

    this.utils.sortNumeric( this.SelectedCards.KingdomCards10 );  // 繁栄場・避難所場の決定後にソート
    this.utils.sortNumeric( this.SelectedCards.EventCards );
    this.utils.sortNumeric( this.SelectedCards.LandmarkCards );
    this.utils.sortNumeric( this.SelectedCards.BlackMarketPile );

    // output
    this.SelectedCardsChange.emit( this.SelectedCards );
  }

}
