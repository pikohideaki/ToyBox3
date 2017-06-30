import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';


// import { MyUtilitiesService } from '../../../my-utilities.service';
import { MyDataTableComponent } from '../../../my-data-table/my-data-table.component';
import { ConfirmDialogComponent } from "../../../confirm-dialog/confirm-dialog.component";
import { GameResult } from "../../game-result";



import { ItemsPerPageComponent, initializeItemsPerPageOption } from '../../../my-data-table/items-per-page/items-per-page.component';
import { PagenationComponent, getPagenatedData } from '../../../my-data-table/pagenation/pagenation.component';


@Component({
  selector: 'game-result-list',
  templateUrl: './game-result-list.component.html',
  styleUrls: [
    '../../../my-data-table/my-data-table.component.css',
    './game-result-list.component.css'
  ]
})
export class GameResultListComponent implements OnInit, OnChanges {

  @Input() GameResultListFiltered: GameResult[] = [];
  GameResultListForView: any[] = [];

  // pagenation
  selectedPageIndex: number = 0;
  itemsPerPageOptions: number[] = [ 50, 100, 200, 400 ];
  itemsPerPageDefault: number = 200;
  itemsPerPage: number;

  getDataForView() {
    return getPagenatedData(
        Array.from( this.GameResultListFiltered ).reverse(),
        this.itemsPerPage,
        this.selectedPageIndex );
  }
  setSelectedPageIndex( idx: number ): void { this.selectedPageIndex = idx; }
  setItemsPerPage( size: number ): void { this.itemsPerPage = size; }


  constructor(
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private afDatabase: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.itemsPerPage = this.itemsPerPageDefault;
  }


  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.GameResultListFiltered != undefined ) {  // at http-get done
      this.selectedPageIndex = 0;
    }
  }


  getDetail(): void {
    console.log("getDetail");
  }

  editGameResult(): void {
    console.log("editGameResult");
  }

  deleteGameResult( no: number ) {
    const grIndex: number = this.GameResultListFiltered.findIndex( e => e.no === no );
    const databaseKey = this.GameResultListFiltered[grIndex].databaseKey;

    let dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = `No.${no} を削除してもよろしいですか？`;
    dialogRef.afterClosed().subscribe( answer => {
      if ( answer === "yes" ) {
        this.afDatabase.list( `/data/GameResultList/${databaseKey}` ).remove();
        this.openSnackBar();
      }
    });
  }

  private openSnackBar() {
    this.snackBar.open( "Deleted.", undefined, { duration: 3000 } );
  }

}


