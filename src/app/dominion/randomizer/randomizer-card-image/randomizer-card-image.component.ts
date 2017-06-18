import { Component, OnInit, Input } from '@angular/core';

import { MyUtilitiesService } from '../../../my-utilities.service';
import { CardProperty } from "../../card-property";
import { SelectedCards } from "../../selected-cards";
import { DominionCardImageComponent } from "../../dominion-card-image/dominion-card-image.component";


@Component({
  selector: 'app-randomizer-card-image',
  templateUrl: './randomizer-card-image.component.html',
  styleUrls: ['./randomizer-card-image.component.css']
})
export class RandomizerCardImageComponent implements OnInit {

  @Input() longSideLength: number = 140;

  @Input() CardPropertyList: CardProperty[];

  @Input() SelectedCards: SelectedCards = new SelectedCards(); 

  Platinum: { data: CardProperty, checked: boolean };
  Colony  : { data: CardProperty, checked: boolean };



  constructor(
    private utils: MyUtilitiesService,
  ) { }

  ngOnInit() {
    this.Platinum = {
      checked : false,
      data  : this.CardPropertyList.find( e => e.card_ID === "Platinum" )
    }
    this.Colony = {
      checked : false,
      data  : this.CardPropertyList.find( e => e.card_ID === "Colony" )
    }
  }
}
