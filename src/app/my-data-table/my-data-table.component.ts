import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


import { MyUtilitiesService } from '../my-utilities.service';

import { ResetButtonComponent } from './reset-button/reset-button.component';
import { ItemsPerPageComponent, initializeItemsPerPageOption } from './items-per-page/items-per-page.component';
import { PagenationComponent, getPagenatedData } from './pagenation/pagenation.component';


@Component({
  providers: [ResetButtonComponent],
  selector: 'my-data-table',
  templateUrl: './my-data-table.component.html',
  styleUrls: ['./my-data-table.component.css']
})
export class MyDataTableComponent implements OnInit, OnChanges  {

  @Input() data: any[] = [];
  filteredData: any[] = [];

  @Input()
  columnSettings: {
        name         : string,
        align        : string,
        manip        : string,
        manipState   : any,
        options      : string[],
        asyncOptions : any,
        button       : boolean,
        headerTitle  : string,
    }[] = [];

  // pagenation
  @Input() itemsPerPageOptions: number[];
  @Input() itemsPerPageDefault: number = Number.MAX_VALUE;
  itemsPerPage: number = 100;
  selectedPageIndex: number = 0;

  @Output() onClick = new EventEmitter<{ rowIndex: number, columnName: string }>();

  stateCtrl: FormControl;


  constructor(
    private utils: MyUtilitiesService,
    private resetButton: ResetButtonComponent
  ) {
    this.stateCtrl = new FormControl();
  }

  ngOnInit() {
    this.itemsPerPage = this.itemsPerPageDefault;
  }

  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.data != undefined ) {  // at http-get done
      this.columnSettings.forEach( e => {
        e.asyncOptions = this.stateCtrl.valueChanges
                    .startWith(null)
                    .map( inputString => this.filterAsyncOptions( e.name, inputString) );
      });
      this.updateView();
    }
  }


  filterAsyncOptions( columnName: string, inputString: string ): string[]{
    const uniqValues = this.utils.uniq( this.filteredData.map( e => e[columnName] ) );
    return inputString ? uniqValues.filter( s => this.utils.submatch( s, inputString, true ) )
                       : uniqValues;
  }


  updateView() {
    this.filteredData = ( this.data === undefined ? [] : this.data.filter( x => this.filterFunction(x) ) );
    this.setSelectorOptions( this.filteredData );
    this.selectedPageIndex = 0;
  }

  reset( name?: string ): void {
    this.resetButton.resetSelector( this.columnSettings, name );
    this.updateView();
  }


  filterFunction( lineOfData: any ): boolean {
    let validSettings = this.columnSettings.filter( column => column.manipState != undefined );

    for ( let column of validSettings ) switch ( column.manip ) {
      case 'filterBySelecter' :
        if ( lineOfData[ column.name ] != column.manipState ) return false;

      case 'incrementalSearch' :
        if ( !this.utils.submatch( lineOfData[ column.name ], column.manipState, true ) ) return false;
        break;

      default :
        break;
    }
    return true;
  }


  /* データから指定列を取り出す */
  getColumn( data: any[], columnName: string ): any[] {
    return data.map( e => e[ columnName ] );
  }

  setSelectorOptions( data: any[] ): any {
    let selectorOptions = {};
    for ( let e of this.columnSettings ) {
        if ( e.manip != 'filterBySelecter' ) continue;
        e.options = this.utils.uniq( this.getColumn( data, e.name ) );
    }
    return selectorOptions;
  }



/* フィルタ済みの表示直前データから指定ページ範囲分のみ取り出す */
  getDataAtPage( selectedPageIndex: number ): any[] {
    return getPagenatedData(
        this.filteredData,
        this.itemsPerPage,
        selectedPageIndex );
  }


  clicked( rowIndex: number, columnName: string ) {
    this.onClick.emit( { rowIndex: rowIndex, columnName: columnName } );
  }
}
