import {
    Component, OnInit,
    Input, Output, EventEmitter,
    OnChanges, SimpleChanges
  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";

import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { SyncGroup } from "../sync-group";

@Component({
  providers: [MyUtilitiesService],
  selector: 'app-randomizer-select-cards',
  templateUrl: './randomizer-select-cards.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './randomizer-select-cards.component.css'
  ]
})
export class RandomizerSelectCardsComponent implements OnInit, OnChanges {

  httpGetDone: boolean[] = [false,false];

  @Input() CardPropertyList: CardProperty[] = [];

  @Input()  DominionSetList: { name: string, selected: boolean }[] = [];
  @Output() DominionSetListChange = new EventEmitter<{ name: string, selected: boolean }[]>();

  @Input()  SelectedCards: SelectedCards = new SelectedCards(); 
  @Output() SelectedCardsChange = new EventEmitter<SelectedCards>();

  // @Input() mySyncGroup: { id: string, data: SyncGroup } = { id: "", data: new SyncGroup() };
  @Input() myUserID: string;
  mySyncGroupID: string;

  users;
  syncGroups;

  randomizerButtonDisabled: boolean = false;
  AllSetsSelected: boolean = true;

  constructor(
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService
  ) {
    
    afDatabase.list("/users", { preserveSnapshot: true }).subscribe( snapshots => {
      this.httpGetDone[0] = true;
      this.users = this.afDatabaseService.convertAs( snapshots, "users" );
      console.log("sc_users", this.users)
      this.getFromSync();
    });

    afDatabase.list("/syncGroups", { preserveSnapshot: true }).subscribe( snapshotsGroups => {
      this.httpGetDone[1] = true;
      this.syncGroups = this.afDatabaseService.convertAs( snapshotsGroups, "syncGroups" );
      console.log("sc_syncGroups", this.syncGroups)
      this.getFromSync();
    });

  }

  ngOnInit() {
  }

  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.myUserID !== undefined ) {
      console.log( "ngOnChanges", this.myUserID )
      this.getFromSync();
    }
  }


  httpGetAllDone(): boolean {
    return this.httpGetDone.every( e => e === true );
  }


  signedIn(): boolean {
    return this.myUserID !== undefined && this.myUserID !== "";
  }

  getFromSync() {
    console.log( "getFromSync", this.signedIn(), this.httpGetDone, this.httpGetAllDone(), this.myUserID)
    if ( !this.signedIn() || !this.httpGetAllDone() ) return;

    console.log("signedIn")
    this.mySyncGroupID = this.users.find( user => user.id === this.myUserID ).data.groupID;
    const mySyncGroup = this.syncGroups.find( g => g.id === this.mySyncGroupID );
    const DominionSets_sync = mySyncGroup.data.selectedDominionSets;
    console.log(DominionSets_sync)
    if ( DominionSets_sync !== undefined && DominionSets_sync.length !== 0 ) {
      this.DominionSetList = DominionSets_sync;
      this.DominionSetListChange.emit( this.DominionSetList );
    }

    const SelectedCards_sync = mySyncGroup.data.selectedCards;
    console.log(SelectedCards_sync)
    if ( SelectedCards_sync !== undefined && SelectedCards_sync.length !== 0 ) {
      this.SelectedCards = new SelectedCards( SelectedCards_sync );
      this.SelectedCardsChange.emit( this.SelectedCards );
    }
  }


  DominionSetNameListOnChange() {
    this.DominionSetListChange.emit( this.DominionSetList );
    console.log("DominionSetNameListOnChange")
    if ( this.signedIn() ) {
      this.afDatabase.list(`/syncGroups`)
        .update( `${this.mySyncGroupID}/selectedDominionSets`, this.DominionSetList );
    }
  }

  SelectedCardsOnChange() {
    this.SelectedCardsChange.emit( this.SelectedCards );
    console.log("SelectedCardsOnChange")
    if ( this.signedIn() ) {
      this.afDatabase.list(`/syncGroups`)
        .update( `${this.mySyncGroupID}/selectedCards`, this.SelectedCards );
    }
  }



  selectAllToggle() {
    this.DominionSetList.forEach( DominionSet => DominionSet.selected = this.AllSetsSelected );
    this.DominionSetNameListOnChange();
  }

  randomizerClicked() {
    if ( this.DominionSetList.every( DominionSet => !DominionSet.selected ) ) return;
    this.randomizerButtonDisabled = true;
    this.randomize();
    this.utils.localStorage_set('DominionSetNameList', this.DominionSetList );
    this.SelectedCardsOnChange();
  }

  unlockClicked() {
    this.randomizerButtonDisabled = false;
  }

  private randomize() {
    this.SelectedCards = new SelectedCards();  // reset

    // 選択されている拡張セットに含まれているカードすべてをシャッフルし，indexとペアにしたリスト
    let CardsInSelectedSets_Shuffled: { index: number, data: CardProperty }[]
     = this.utils.shuffle(
      this.CardPropertyList
      .map( (val,index) => { return { index: index, data: val }; } )
      .filter ( e => e.data.randomizer_candidate )
      .filter( e => this.DominionSetList
                     .filter( s => s.selected )
                     .map( s => s.name )
                     .findIndex( val => val == e.data.set_name ) >= 0 )
      );

    console.log( CardsInSelectedSets_Shuffled.map( e => e.index ) );

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
