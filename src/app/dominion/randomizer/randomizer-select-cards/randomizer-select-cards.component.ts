import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyFirebaseSubscribeService } from "../../my-firebase-subscribe.service";

import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { SyncGroup } from "../sync-group";
import { UserInfo } from "../../../user-info";


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

  httpGetDone: boolean[] = [false,false];

  @Input() CardPropertyList: CardProperty[] = [];

  @Input()  DominionSetList: { name: string, selected: boolean }[] = [];
  @Output() DominionSetListChange = new EventEmitter<{ name: string, selected: boolean }[]>();

  @Input()  SelectedCards: SelectedCards = new SelectedCards(); 
  @Output() SelectedCardsChange = new EventEmitter<SelectedCards>();

  users: UserInfo[] = [];
  syncGroups: { id: string, selected: boolean, data: SyncGroup }[];

  me: Observable<firebase.User>;
  myID: string;
  signedIn: boolean = false;


  randomizerButtonDisabled: boolean = false;
  AllSetsSelected: boolean = true;


  constructor(
    private utils: MyUtilitiesService,
    private afDatabase: AngularFireDatabase,
    private afDatabaseService: MyFirebaseSubscribeService,
    public afAuth: AngularFireAuth
  ) {

    this.me = afAuth.authState;
    this.me.subscribe( val => {
      this.signedIn = !!val;
      this.myID = ( this.signedIn ? val.uid : "" );
      this.loadFromSync();
    });

    this.afDatabase.list("/userInfo").subscribe( val => {
      this.httpGetDone[0] = true;
      this.users = val.map( e => new UserInfo(e) );
      this.loadFromSync();
    });

    afDatabase.list("/syncGroups", { preserveSnapshot: true }).subscribe( snapshotsGroups => {
      this.httpGetDone[1] = true;
      this.syncGroups = this.afDatabaseService.convertAs( snapshotsGroups, "syncGroups" );
      this.loadFromSync();
    });

  }

  ngOnInit() {
  }


  httpGetAllDone(): boolean {
    return this.httpGetDone.every( e => e === true );
  }


  mySyncGroupID() {
    let me = this.users.find( user => user.id === this.myID );
    return ( me? me.dominionGroupID : "" );
  }


  private loadFromSync() {
    if ( !this.signedIn || !this.httpGetAllDone() ) return;

    const mySyncGroup = this.syncGroups.find( g => g.id === this.mySyncGroupID() );

    const DominionSets_sync = mySyncGroup.data.DominionSetsSelected;
    if ( DominionSets_sync !== undefined && DominionSets_sync.length !== 0 ) {
      this.DominionSetList.forEach( (elem,idx,_) => elem.selected = DominionSets_sync[idx] );
      this.DominionSetListChange.emit( this.DominionSetList );
    }

    const SelectedCards_sync = mySyncGroup.data.SelectedCards;
    if ( SelectedCards_sync !== undefined ) {
      this.SelectedCards = new SelectedCards( SelectedCards_sync );
      this.SelectedCardsChange.emit( this.SelectedCards );
    }

    const randomizerButtonDisabled_sync = mySyncGroup.data.randomizerButtonDisabled;
    if ( randomizerButtonDisabled_sync !== undefined ) {
      this.randomizerButtonDisabled = randomizerButtonDisabled_sync;
    }

  }


  DominionSetListOnChange() {
    this.DominionSetListChange.emit( this.DominionSetList );
    // this.utils.localStorage_set('DominionSetNameList', this.DominionSetList.map( e => e.selected ) );
    if ( this.signedIn ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID()}/DominionSetsSelected`)
        .set( this.DominionSetList.map( e => e.selected ) );
    }
  }

  SelectedCardsOnChange() {
    this.SelectedCardsChange.emit( this.SelectedCards );
    if ( this.signedIn ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID()}/SelectedCards`)
        .set( this.SelectedCards );
    }
  }



  selectAllToggle() {
    this.DominionSetList.forEach( DominionSet => DominionSet.selected = this.AllSetsSelected );
    this.DominionSetListOnChange();
  }

  disableRandomizerButton( flag: boolean ) {
    this.randomizerButtonDisabled = flag;
    if ( this.signedIn ) {
      this.afDatabase.object( `/syncGroups/${this.mySyncGroupID()}/randomizerButtonDisabled`)
        .set( this.randomizerButtonDisabled );
    }
  }

  randomizerClicked() {
    if ( this.DominionSetList.every( DominionSet => !DominionSet.selected ) ) return;
    this.disableRandomizerButton(true);
    this.randomize();
    this.SelectedCardsOnChange();
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

    this.SelectedCards.KingdomCards10 .sort( (a,b) => a.index - b.index );   // 繁栄場・避難所場の決定後にソート
    this.SelectedCards.EventCards     .sort( (a,b) => a.index - b.index );
    this.SelectedCards.LandmarkCards  .sort( (a,b) => a.index - b.index );
    this.SelectedCards.BlackMarketPile.sort( (a,b) => a.index - b.index );

  }

}
