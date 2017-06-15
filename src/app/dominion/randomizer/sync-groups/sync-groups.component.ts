import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SelectedCards } from "../../selected-cards";
import { GameResult } from "../../game-result";
import { SyncGroup } from "../sync-group";

@Component({
  selector: 'app-sync-groups',
  templateUrl: './sync-groups.component.html',
  styleUrls: ['./sync-groups.component.css']
})
export class SyncGroupsComponent implements OnInit {

  @Input() SelectedCards: SelectedCards;

  @Input()  newGameResult: GameResult;

  @Input()  syncGroups: SyncGroup[];
  @Output() syncGroupsChange = new EventEmitter<SyncGroup[]>();

  newGroupName: string;
  newGroupPassword: string;


  constructor() { }

  ngOnInit() {
  }

  addSyncGroup() {
    this.syncGroupsChange.emit( this.syncGroups );
  }
}
