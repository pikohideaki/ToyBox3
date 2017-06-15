import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-data-table--reset-buttons',
  templateUrl: './reset-button.component.html',
  styleUrls: ['./reset-button.component.css']
})
export class ResetButtonComponent implements OnInit {

  // @Input() columnSettings: any[] = [];
  // @Input() updateFunction;
  @Output() click = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  clicked() {
    this.click.emit();
  }

  resetSelector( columnSettings: any[], columnName?: string ): void {
    if ( columnName != undefined ) {
      columnSettings = columnSettings.filter( column => column.name == columnName );
    }
    columnSettings.forEach( e => e.manipState = undefined );
  }

}

